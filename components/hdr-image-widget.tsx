/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useRef, useState } from "react"

type WidgetVariant = "ultra" | "native"
type StatusTone = "neutral" | "success" | "error"
type VipsLike = any

const DEFAULT_IMAGE = {
  assetPath: "/hdr-images/cat-normal.jpg",
  filename: "cat-normal.jpg",
  mimeType: "image/jpeg",
}

const NATIVE_PROFILE = {
  assetPath: "/profiles/rec2100-pq.icc",
  fsPath: "/profiles/rec2100-pq.icc",
  look: {
    referenceWhiteNits: 205,
    contrast: 1,
    baseChromaCompression: 0,
    highlightChromaCompression: 0,
  },
}

const NATIVE_SDR_PREVIEW_PROFILE = {
  assetPath: "/profiles/compact/sRGB-v4.icc",
  fsPath: "/profiles/compact/sRGB-v4.icc",
}

const matteBackground = [246, 241, 233]
const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})

const SCRGB_REFERENCE_WHITE_NITS = 80
const SDR_PREVIEW_REFERENCE_WHITE_NITS = 32
const SDR_PREVIEW_EXPOSURE = 25
const PQ_MAX_NITS = 10000
const PQ_M1 = 0.1593017578125
const PQ_M2 = 78.84375
const PQ_C1 = 0.8359375
const PQ_C2 = 18.8515625
const PQ_C3 = 18.6875

const LYMUI_SRGB_TO_REC2020_MATRIX = [
  [0.6275036736679035, 0.32927545955223236, 0.04330269391936256],
  [0.06910839218548846, 0.9195192066915597, 0.011359589258349458],
  [0.016394049277743794, 0.08801124848947786, 0.895380381498773],
]

const LYMUI_REC2020_TO_XYZ_MATRIX = [
  [0.636958, 0.1446169, 0.168881],
  [0.2627002, 0.6779981, 0.0593017],
  [0, 0.0280727, 1.0609851],
]

const assetCache = new Map<string, Uint8Array>()
const fsAssets = new Set<string>()

let vipsPromise: Promise<VipsLike> | null = null
let renderQueue: Promise<void> = Promise.resolve()
let widgetCounter = 0

function enqueueExclusiveRender<T>(task: () => Promise<T>) {
  const queued = renderQueue.then(task, task)
  renderQueue = queued.then(
    () => undefined,
    () => undefined,
  )
  return queued
}

function sliderToBoost(value: number) {
  return 1 + (value / 100) * 14
}

function sliderToMinContentBoost(value: number) {
  return 1 - (value / 100) * 0.75
}

function sliderToThreshold(value: number) {
  return value / 100
}

function formatFactor(value: number) {
  return `${numberFormatter.format(value)}x`
}

function formatBytes(bytes: number) {
  if (!bytes) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${numberFormatter.format(size)} ${units[unitIndex]}`
}

function formatThreshold(value: number) {
  const threshold = sliderToThreshold(value)

  if (threshold <= 0.02) {
    return "Highlights only"
  }

  if (threshold >= 0.98) {
    return "Lift dark grays"
  }

  return `${Math.round(threshold * 100)}%`
}

function toFsSafeExtension(name: string) {
  const match = /\.[a-z0-9]+$/i.exec(name)
  return match ? match[0].toLowerCase() : ".img"
}

function safeUnlink(vips: VipsLike | null, path: string) {
  if (!path || !vips) {
    return
  }

  try {
    vips.FS.unlink(path)
  } catch {
    // Ignore temporary files that are already gone.
  }
}

function safeDispose(resource: any) {
  if (resource && typeof resource.delete === "function") {
    resource.delete()
  }
}

function track<T>(resources: any[], resource: T) {
  if (resource) {
    resources.push(resource)
  }

  return resource
}

function revokeUrl(url: string) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

async function fetchBytes(url: string) {
  if (!assetCache.has(url)) {
    const response = await fetch(url)
    const bytes = new Uint8Array(await response.arrayBuffer())
    assetCache.set(url, bytes)
  }

  return assetCache.get(url)!
}

function ensureFsDirectory(vips: VipsLike, path: string) {
  try {
    vips.FS.mkdir(path)
  } catch {
    // Directory already exists.
  }
}

function ensureFsPath(vips: VipsLike, targetPath: string) {
  const parts = targetPath.split("/").filter(Boolean)
  let currentPath = ""

  for (const part of parts) {
    currentPath += `/${part}`
    ensureFsDirectory(vips, currentPath)
  }
}

async function ensureBundledFsAsset(
  vips: VipsLike,
  assetPath: string,
  fsPath: string,
) {
  const directoryPath = fsPath.split("/").slice(0, -1).join("/") || "/"
  ensureFsPath(vips, directoryPath)

  if (!fsAssets.has(fsPath)) {
    vips.FS.writeFile(fsPath, await fetchBytes(assetPath))
    fsAssets.add(fsPath)
  }

  return fsPath
}

function haveOperation(vips: VipsLike, nickname: string) {
  return vips.Utils.typeFind("VipsOperation", nickname) !== 0
}

async function loadVips() {
  if (!window.crossOriginIsolated) {
    throw new Error(
      "HDR preview needs SharedArrayBuffer. The page must be served with COOP/COEP headers.",
    )
  }

  const runtimeUrl = new URL("/wasm-vips/vips-es6.js", window.location.href).toString()
  const mod = await import(/* webpackIgnore: true */ runtimeUrl)
  const vips = await mod.default()

  if (!haveOperation(vips, "uhdrsave")) {
    throw new Error("This wasm-vips build does not expose UltraHDR export support.")
  }

  return vips
}

async function getVips() {
  if (!vipsPromise) {
    vipsPromise = loadVips().catch((error) => {
      vipsPromise = null
      throw error
    })
  }

  return vipsPromise
}

function maybeLoadUltraHdr(vips: VipsLike, filename: string, resources: any[]) {
  if (!haveOperation(vips, "uhdrload")) {
    return null
  }

  try {
    const image = track(resources, vips.Image.uhdrload(filename))
    if (image.gainmap) {
      return image
    }

    resources.pop()
    safeDispose(image)
  } catch {
    return null
  }

  return null
}

function ensureEditableBase(image: any, vips: VipsLike, resources: any[]) {
  let current = image

  if (current.hasAlpha()) {
    current = track(resources, current.flatten({ background: matteBackground }))
  }

  if (current.bands === 1) {
    current = track(resources, current.bandjoin([current, current]))
  } else if (current.bands > 3) {
    current = track(resources, current.extractBand(0, { n: 3 }))
  }

  if (current.interpretation !== "srgb") {
    current = track(resources, current.colourspace(vips.Interpretation.srgb))
  }

  if (current.format !== "uchar") {
    current = track(
      resources,
      current.cast(vips.BandFormat.uchar, { shift: true }),
    )
  }

  return current
}

function ensureRgbBands(image: any, resources: any[]) {
  let current = image

  if (current.hasAlpha()) {
    current = track(resources, current.extractBand(0, { n: current.bands - 1 }))
  }

  if (current.bands === 1) {
    current = track(resources, current.bandjoin([current, current]))
  } else if (current.bands > 3) {
    current = track(resources, current.extractBand(0, { n: 3 }))
  }

  return current
}

function buildHighlightMask(
  baseImage: any,
  threshold: number,
  vips: VipsLike,
  resources: any[],
) {
  const minimumLuminance = 0.999 - threshold * 0.999
  const maskRange = Math.max(0.001, 1 - minimumLuminance)
  const luminance = track(resources, baseImage.bandmean())
  const luminanceFloat = track(resources, luminance.cast(vips.BandFormat.float))
  const normalizedLuminance = track(resources, luminanceFloat.linear(1 / 255, 0))
  const thresholdedMask = track(resources, normalizedLuminance.subtract(minimumLuminance))
  const normalizedMask = track(resources, thresholdedMask.divide(maskRange))

  return track(resources, normalizedMask.clamp({ min: 0, max: 1 }))
}

function applyContrast(image: any, amount: number, resources: any[]) {
  if (Math.abs(amount - 1) < 0.001) {
    return image
  }

  const pivot = 127.5
  return track(
    resources,
    image.linear(amount, pivot * (1 - amount)).clamp({ min: 0, max: 255 }),
  )
}

function applyHdrReferenceWhite(
  image: any,
  referenceWhiteNits: number,
  resources: any[],
) {
  const safeReferenceWhiteNits = Math.max(80, referenceWhiteNits)
  const scale = safeReferenceWhiteNits / SCRGB_REFERENCE_WHITE_NITS

  if (Math.abs(scale - 1) < 0.001) {
    return image
  }

  return track(resources, image.multiply(scale))
}

function applyHdrGamutCompression(
  image: any,
  highlightMask: any,
  baseCompression: number,
  highlightCompression: number,
  resources: any[],
) {
  const safeBaseCompression = Math.max(0, Math.min(0.95, baseCompression))
  const safeHighlightCompression = Math.max(
    0,
    Math.min(0.95, highlightCompression),
  )
  const totalCompression = safeBaseCompression + safeHighlightCompression

  if (totalCompression < 0.001) {
    return image
  }

  const compressionMask = track(
    resources,
    highlightMask
      .linear(safeHighlightCompression, safeBaseCompression)
      .clamp({ min: 0, max: 0.95 }),
  )
  const keepMask = track(
    resources,
    compressionMask.linear(-1, 1).clamp({ min: 0.05, max: 1 }),
  )
  const compressionMaskRgb = track(
    resources,
    compressionMask.bandjoin([compressionMask, compressionMask]),
  )
  const keepMaskRgb = track(resources, keepMask.bandjoin([keepMask, keepMask]))
  const neutral = track(resources, image.bandmean())
  const neutralRgb = track(resources, neutral.bandjoin([neutral, neutral]))
  const preserved = track(resources, image.multiply(keepMaskRgb))
  const compressed = track(resources, neutralRgb.multiply(compressionMaskRgb))

  return track(resources, preserved.add(compressed))
}

function applyRec2020Matrix(image: any, resources: any[]) {
  return track(resources, image.recomb(LYMUI_SRGB_TO_REC2020_MATRIX))
}

function encodeRec2100Pq(image: any, vips: VipsLike, resources: any[]) {
  const clampedLinear = track(
    resources,
    image.clamp({ min: 0, max: PQ_MAX_NITS / SCRGB_REFERENCE_WHITE_NITS }),
  )
  const absoluteNits = track(
    resources,
    clampedLinear.multiply(SCRGB_REFERENCE_WHITE_NITS),
  )
  const normalizedNits = track(
    resources,
    absoluteNits.linear(1 / PQ_MAX_NITS, 0).clamp({ min: 0, max: 1 }),
  )
  const powerTerm = track(resources, normalizedNits.pow(PQ_M1))
  const numerator = track(resources, powerTerm.linear(PQ_C2, PQ_C1))
  const denominator = track(resources, powerTerm.linear(PQ_C3, 1))
  const pqEncoded = track(
    resources,
    numerator.divide(denominator).pow(PQ_M2).clamp({ min: 0, max: 1 }),
  )

  return track(
    resources,
    pqEncoded
      .linear(65535, 0)
      .clamp({ min: 0, max: 65535 })
      .cast(vips.BandFormat.ushort),
  )
}

function decodeRec2100PqToRelativeRec2020(
  image: any,
  previewWhiteNits: number,
  vips: VipsLike,
  resources: any[],
) {
  const safePreviewWhiteNits = Math.max(80, previewWhiteNits)
  const pqSignal = track(
    resources,
    ensureRgbBands(image, resources)
      .cast(vips.BandFormat.float)
      .linear(1 / 65535, 0)
      .clamp({ min: 0, max: 1 }),
  )
  const powerTerm = track(resources, pqSignal.pow(1 / PQ_M2))
  const numerator = track(
    resources,
    powerTerm.linear(1, -PQ_C1).clamp({ min: 0, max: 1 }),
  )
  const denominator = track(
    resources,
    powerTerm.linear(-PQ_C3, PQ_C2).clamp({ min: 0.000001, max: PQ_C2 }),
  )
  const normalizedNits = track(
    resources,
    numerator.divide(denominator).pow(1 / PQ_M1),
  )

  return track(
    resources,
    normalizedNits.linear(PQ_MAX_NITS / safePreviewWhiteNits, 0),
  )
}

function remasterRec2100PqPreviewToSrgb(
  image: any,
  vips: VipsLike,
  resources: any[],
) {
  const relativeRec2020 = decodeRec2100PqToRelativeRec2020(
    image,
    SDR_PREVIEW_REFERENCE_WHITE_NITS,
    vips,
    resources,
  )
  const xyz = track(resources, relativeRec2020.recomb(LYMUI_REC2020_TO_XYZ_MATRIX))
  const xyzImage = track(
    resources,
    xyz.copy({ interpretation: vips.Interpretation.xyz }),
  )
  const scrgb = track(resources, xyzImage.XYZ2scRGB())
  const liftedScrgb = track(resources, scrgb.multiply(SDR_PREVIEW_EXPOSURE))

  return track(resources, liftedScrgb.scRGB2sRGB())
}

function buildGainmap(mask: any, vips: VipsLike, resources: any[]) {
  const scaledMask = track(resources, mask.linear(255, 0))
  return track(resources, scaledMask.cast(vips.BandFormat.uchar))
}

function buildHdrScaleImage(
  mask: any,
  minContentBoost: number,
  maxContentBoost: number,
  resources: any[],
) {
  const safeMin = Math.max(0.0001, Math.min(minContentBoost, maxContentBoost))
  const safeMax = Math.max(safeMin, maxContentBoost)
  const logMin = Math.log(safeMin)
  const logMax = Math.log(safeMax)
  const scaleLog = track(resources, mask.linear(logMax - logMin, logMin))
  const scaleMono = track(resources, scaleLog.exp())

  return track(resources, scaleMono.bandjoin([scaleMono, scaleMono]))
}

function buildGainmapMetadata(boost: number, minContentBoost: number) {
  const safeBoost = Math.max(1.0001, boost)
  const safeMinBoost = Math.max(0.0001, Math.min(minContentBoost, safeBoost))

  return {
    maxContentBoost: [safeBoost, safeBoost, safeBoost],
    minContentBoost: [safeMinBoost, safeMinBoost, safeMinBoost],
    gamma: [1, 1, 1],
    offsetSdr: [0, 0, 0],
    offsetHdr: [0, 0, 0],
    hdrCapacityMin: 1,
    hdrCapacityMax: safeBoost,
    useBaseCg: 1,
  }
}

function attachGainmap(
  baseImage: any,
  gainmap: any,
  metadata: ReturnType<typeof buildGainmapMetadata>,
  resources: any[],
) {
  const output = track(resources, baseImage.copy())
  output.setImage("gainmap", gainmap)
  output.setArrayDouble("gainmap-max-content-boost", metadata.maxContentBoost)
  output.setArrayDouble("gainmap-min-content-boost", metadata.minContentBoost)
  output.setArrayDouble("gainmap-gamma", metadata.gamma)
  output.setArrayDouble("gainmap-offset-sdr", metadata.offsetSdr)
  output.setArrayDouble("gainmap-offset-hdr", metadata.offsetHdr)
  output.setDouble("gainmap-hdr-capacity-min", metadata.hdrCapacityMin)
  output.setDouble("gainmap-hdr-capacity-max", metadata.hdrCapacityMax)
  output.setInt("gainmap-use-base-cg", metadata.useBaseCg)
  return output
}

async function buildNativeHdrVariant({
  editableBase,
  boost,
  minContentBoost,
  threshold,
  resources,
  vips,
}: {
  editableBase: any
  boost: number
  minContentBoost: number
  threshold: number
  resources: any[]
  vips: VipsLike
}) {
  const nativeContrastBase = applyContrast(
    editableBase,
    NATIVE_PROFILE.look.contrast,
    resources,
  )
  const hdrWorking = track(resources, nativeContrastBase.sRGB2scRGB())
  const hdrReferenceMapped = applyHdrReferenceWhite(
    hdrWorking,
    NATIVE_PROFILE.look.referenceWhiteNits,
    resources,
  )
  const nativeHighlightMask = buildHighlightMask(
    editableBase,
    threshold,
    vips,
    resources,
  )
  const nativeHdrScaled = track(
    resources,
    hdrReferenceMapped.multiply(
      buildHdrScaleImage(nativeHighlightMask, minContentBoost, boost, resources),
    ),
  )
  const nativeCompressedWorking = applyHdrGamutCompression(
    nativeHdrScaled,
    nativeHighlightMask,
    NATIVE_PROFILE.look.baseChromaCompression,
    NATIVE_PROFILE.look.highlightChromaCompression,
    resources,
  )
  const nativeProfilePath = await ensureBundledFsAsset(
    vips,
    NATIVE_PROFILE.assetPath,
    NATIVE_PROFILE.fsPath,
  )
  const rec2020Working = applyRec2020Matrix(nativeCompressedWorking, resources)
  const pqEncoded = encodeRec2100Pq(rec2020Working, vips, resources)

  return pqEncoded.pngsaveBuffer({
    bitdepth: 16,
    compression: 4,
    profile: nativeProfilePath,
    keep: vips.ForeignKeep.all,
  })
}

async function buildNativeSdrPreviewFromHdrBytes({
  hdrBytes,
  jobPathPrefix,
  resources,
  tempFiles,
  vips,
}: {
  hdrBytes: Uint8Array
  jobPathPrefix: string
  resources: any[]
  tempFiles: string[]
  vips: VipsLike
}) {
  const nativePreviewPath = `${jobPathPrefix}-native-preview.png`
  const previewProfilePath = await ensureBundledFsAsset(
    vips,
    NATIVE_SDR_PREVIEW_PROFILE.assetPath,
    NATIVE_SDR_PREVIEW_PROFILE.fsPath,
  )

  tempFiles.push(nativePreviewPath)
  vips.FS.writeFile(nativePreviewPath, hdrBytes)

  const pqImage = track(resources, vips.Image.newFromFile(nativePreviewPath))
  const remasteredPreview = remasterRec2100PqPreviewToSrgb(pqImage, vips, resources)

  return remasteredPreview.pngsaveBuffer({
    bitdepth: 16,
    compression: 4,
    profile: previewProfilePath,
    keep: vips.ForeignKeep.all,
  })
}

async function buildUltraHdrOutputs({
  editableBase,
  boost,
  minContentBoost,
  threshold,
  jobPathPrefix,
  resources,
  tempFiles,
  vips,
}: {
  editableBase: any
  boost: number
  minContentBoost: number
  threshold: number
  jobPathPrefix: string
  resources: any[]
  tempFiles: string[]
  vips: VipsLike
}) {
  const highlightMask = buildHighlightMask(editableBase, threshold, vips, resources)
  const gainmap = buildGainmap(highlightMask, vips, resources)
  const gainmapMetadata = buildGainmapMetadata(boost, minContentBoost)
  const ultraHdrImage = attachGainmap(editableBase, gainmap, gainmapMetadata, resources)
  const hdrBytes = ultraHdrImage.uhdrsaveBuffer({
    Q: 100,
    keep: vips.ForeignKeep.all,
  })

  const outputPath = `${jobPathPrefix}-ultra.jpg`
  tempFiles.push(outputPath)
  vips.FS.writeFile(outputPath, hdrBytes)
  const exported = track(resources, vips.Image.uhdrload(outputPath))
  const sdrBytes = exported.writeToBuffer(".png")

  return { hdrBytes, sdrBytes }
}

async function buildNativeOutputs({
  editableBase,
  boost,
  minContentBoost,
  threshold,
  jobPathPrefix,
  resources,
  tempFiles,
  vips,
}: {
  editableBase: any
  boost: number
  minContentBoost: number
  threshold: number
  jobPathPrefix: string
  resources: any[]
  tempFiles: string[]
  vips: VipsLike
}) {
  const hdrBytes = await buildNativeHdrVariant({
    editableBase,
    boost,
    minContentBoost,
    threshold,
    resources,
    vips,
  })
  const sdrBytes = await buildNativeSdrPreviewFromHdrBytes({
    hdrBytes,
    jobPathPrefix,
    resources,
    tempFiles,
    vips,
  })

  return { hdrBytes, sdrBytes }
}

async function createDefaultFile() {
  const bytes = await fetchBytes(DEFAULT_IMAGE.assetPath)
  return new File([bytes], DEFAULT_IMAGE.filename, {
    type: DEFAULT_IMAGE.mimeType,
  })
}

const PreviewCard = ({
  title,
  src,
  alt,
  emptyText,
}: {
  title: string
  src: string
  alt: string
  emptyText: string
}) => {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
        {title}
      </p>
      <div className="border-2 border-slate-900 bg-white">
        {src ? (
          <img className="w-full" src={src} alt={alt} />
        ) : (
          <div className="flex items-center justify-center p-6 text-center text-sm text-slate-500">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  )
}

export const HDRImageWidget = ({
  variant,
}: {
  variant: WidgetVariant
}) => {
  const instanceId = useRef((widgetCounter += 1))
  const mountedRef = useRef(false)
  const renderTimerRef = useRef<number>()
  const currentJobRef = useRef(0)
  const renderingRef = useRef(false)
  const rerenderQueuedRef = useRef(false)
  const previewUrlRef = useRef("")
  const sdrPreviewUrlRef = useRef("")

  const [inputFile, setInputFile] = useState<File | null>(null)
  const [inputLabel, setInputLabel] = useState("Loading default image…")
  const [status, setStatus] = useState("Loading the HDR toolchain…")
  const [statusTone, setStatusTone] = useState<StatusTone>("neutral")
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(true)
  const [boostSlider, setBoostSlider] = useState(100)
  const [minBoostSlider, setMinBoostSlider] = useState(13)
  const [thresholdSlider, setThresholdSlider] = useState(50)
  const [previewUrl, setPreviewUrl] = useState("")
  const [sdrPreviewUrl, setSdrPreviewUrl] = useState("")

  const uploadInputId = `hdr-widget-upload-${instanceId.current}`
  const previewLabel = "HDR"
  const previewEmptyText = "The generated HDR preview appears here."
  const downloadFilename = useMemo(() => {
    const baseName = inputFile?.name.replace(/\.[^.]+$/, "") || "image"
    return `${baseName}-${variant === "ultra" ? "ultrahdr.jpg" : "hdr.png"}`
  }, [inputFile, variant])

  const boostValue = useMemo(
    () => formatFactor(sliderToBoost(boostSlider)),
    [boostSlider],
  )
  const minBoostValue = useMemo(
    () => formatFactor(sliderToMinContentBoost(minBoostSlider)),
    [minBoostSlider],
  )
  const thresholdValue = useMemo(
    () => formatThreshold(thresholdSlider),
    [thresholdSlider],
  )

  const replacePreviewUrl = (nextUrl: string) => {
    revokeUrl(previewUrlRef.current)
    previewUrlRef.current = nextUrl
    setPreviewUrl(nextUrl)
  }

  const replaceSdrPreviewUrl = (nextUrl: string) => {
    revokeUrl(sdrPreviewUrlRef.current)
    sdrPreviewUrlRef.current = nextUrl
    setSdrPreviewUrl(nextUrl)
  }

  useEffect(() => {
    mountedRef.current = true

    void getVips()
      .then(() => {
        if (!mountedRef.current) {
          return
        }

        setReady(true)
        setBusy(false)
        setStatus("HDR encoder ready. Loading the default cat image…")
        setStatusTone("success")

        return createDefaultFile().then((file) => {
          if (!mountedRef.current) {
            return
          }

          setInputFile(file)
          setInputLabel(`${file.name} · ${formatBytes(file.size)}`)
          setStatus("Image loaded. The preview regenerates automatically.")
          setStatusTone("neutral")
        })
      })
      .catch((error: Error) => {
        if (!mountedRef.current) {
          return
        }

        setReady(false)
        setBusy(false)
        setStatus(error.message || "Failed to load the HDR toolchain.")
        setStatusTone("error")
      })

    return () => {
      mountedRef.current = false
      window.clearTimeout(renderTimerRef.current)
      revokeUrl(previewUrlRef.current)
      revokeUrl(sdrPreviewUrlRef.current)
    }
  }, [])

  useEffect(() => {
    if (!ready || !inputFile) {
      return
    }

    window.clearTimeout(renderTimerRef.current)
    renderTimerRef.current = window.setTimeout(() => {
      const boost = sliderToBoost(boostSlider)
      const minContentBoost = sliderToMinContentBoost(minBoostSlider)
      const threshold = sliderToThreshold(thresholdSlider)

      const runRender = async () => {
        if (renderingRef.current) {
          rerenderQueuedRef.current = true
          return
        }

        renderingRef.current = true
        rerenderQueuedRef.current = false
        currentJobRef.current += 1

        const jobId = currentJobRef.current
        const resources: any[] = []
        const tempFiles: string[] = []
        let vips: VipsLike | null = null
        let nextPreviewUrl = ""
        let nextSdrPreviewUrl = ""

        if (mountedRef.current) {
          setBusy(true)
          setStatus("Generating preview…")
          setStatusTone("neutral")
        }

        try {
          await enqueueExclusiveRender(async () => {
            vips = await getVips()

            const inputBytes = new Uint8Array(await inputFile.arrayBuffer())
            const jobPathPrefix = `/widget-${instanceId.current}-job-${jobId}`
            const inputPath = `${jobPathPrefix}${toFsSafeExtension(inputFile.name)}`

            tempFiles.push(inputPath)
            vips.FS.writeFile(inputPath, inputBytes)

            const ultraHdrSource = maybeLoadUltraHdr(vips, inputPath, resources)
            const sourceImage =
              ultraHdrSource ?? track(resources, vips.Image.newFromFile(inputPath))
            const editableBase = ensureEditableBase(sourceImage, vips, resources)

            const outputs =
              variant === "ultra"
                ? await buildUltraHdrOutputs({
                    editableBase,
                    boost,
                    minContentBoost,
                    threshold,
                    jobPathPrefix,
                    resources,
                    tempFiles,
                    vips,
                  })
                : await buildNativeOutputs({
                    editableBase,
                    boost,
                    minContentBoost,
                    threshold,
                    jobPathPrefix,
                    resources,
                    tempFiles,
                    vips,
                  })

            nextPreviewUrl = URL.createObjectURL(
              new Blob([outputs.hdrBytes], {
                type: variant === "ultra" ? "image/jpeg" : "image/png",
              }),
            )
            nextSdrPreviewUrl = URL.createObjectURL(
              new Blob([outputs.sdrBytes], { type: "image/png" }),
            )
          })

          if (!mountedRef.current || jobId !== currentJobRef.current) {
            revokeUrl(nextPreviewUrl)
            revokeUrl(nextSdrPreviewUrl)
            return
          }

          replacePreviewUrl(nextPreviewUrl)
          replaceSdrPreviewUrl(nextSdrPreviewUrl)
          setStatus("")
          setStatusTone("neutral")
        } catch (error: any) {
          if (!mountedRef.current || jobId !== currentJobRef.current) {
            revokeUrl(nextPreviewUrl)
            revokeUrl(nextSdrPreviewUrl)
            return
          }

          revokeUrl(nextPreviewUrl)
          revokeUrl(nextSdrPreviewUrl)
          replacePreviewUrl("")
          replaceSdrPreviewUrl("")
          setStatus(error?.message || "HDR generation failed.")
          setStatusTone("error")
        } finally {
          resources.reverse().forEach(safeDispose)
          tempFiles.forEach((path) => safeUnlink(vips, path))
          renderingRef.current = false

          if (mountedRef.current && jobId === currentJobRef.current) {
            setBusy(false)
          }

          if (rerenderQueuedRef.current) {
            rerenderQueuedRef.current = false
            window.clearTimeout(renderTimerRef.current)
            renderTimerRef.current = window.setTimeout(() => {
              void runRender()
            }, 0)
          }
        }
      }

      void runRender()
    }, 120)

    return () => {
      window.clearTimeout(renderTimerRef.current)
    }
  }, [boostSlider, inputFile, minBoostSlider, ready, thresholdSlider, variant])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setInputFile(file)
    setInputLabel(`${file.name} · ${formatBytes(file.size)}`)
    setStatus("Image loaded. The preview regenerates automatically.")
    setStatusTone("neutral")
  }

  return (
    <div className="my-8 border-2 border-slate-900 bg-slate-100 p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="min-w-0">
          <label
            htmlFor={uploadInputId}
            className="block cursor-pointer border-2 border-dashed border-slate-400 bg-white p-4 transition-colors hover:border-slate-900"
          >
            <span className="block text-sm font-semibold text-slate-900">
              Upload image
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              {inputLabel}
            </span>
          </label>
          <input
            id={uploadInputId}
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={busy && !ready}
          />

          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                <label htmlFor={`${uploadInputId}-bright`} className="font-medium">
                  Make brights brighter
                </label>
                <output>{boostValue}</output>
              </div>
              <input
                id={`${uploadInputId}-bright`}
                className="w-full accent-orange-500"
                type="range"
                min="0"
                max="100"
                step="1"
                value={boostSlider}
                onChange={(event) => setBoostSlider(Number(event.target.value))}
                disabled={!ready || busy}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                <label htmlFor={`${uploadInputId}-dark`} className="font-medium">
                  Make darks darker
                </label>
                <output>{minBoostValue}</output>
              </div>
              <input
                id={`${uploadInputId}-dark`}
                className="w-full accent-orange-500"
                type="range"
                min="0"
                max="100"
                step="1"
                value={minBoostSlider}
                onChange={(event) => setMinBoostSlider(Number(event.target.value))}
                disabled={!ready || busy}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                <label htmlFor={`${uploadInputId}-threshold`} className="font-medium">
                  Highlight threshold
                </label>
                <output>{thresholdValue}</output>
              </div>
              <input
                id={`${uploadInputId}-threshold`}
                className="w-full accent-orange-500"
                type="range"
                min="0"
                max="100"
                step="1"
                value={thresholdSlider}
                onChange={(event) => setThresholdSlider(Number(event.target.value))}
                disabled={!ready || busy}
              />
            </div>
          </div>

          <p
            className={`mt-4 min-h-6 text-sm ${
              statusTone === "error"
                ? "text-red-700"
                : statusTone === "success"
                  ? "text-green-700"
                  : "text-slate-600"
            }`}
          >
            {status}
          </p>
        </div>

        <div className="min-w-0">
          <div className="grid gap-4 md:grid-cols-2">
            <PreviewCard
              title={previewLabel}
              src={previewUrl}
              alt={`${variant} hdr preview`}
              emptyText={previewEmptyText}
            />
            <PreviewCard
              title="SDR"
              src={sdrPreviewUrl}
              alt={`${variant} sdr preview`}
              emptyText="The SDR preview appears here."
            />
          </div>

          <div className="mt-4 flex justify-end">
            <a
              href={previewUrl || ""}
              download={downloadFilename}
              aria-disabled={previewUrl ? "false" : "true"}
              className={`inline-flex min-h-11 items-center justify-center border-2 border-slate-900 px-4 text-sm font-semibold no-underline ${
                previewUrl
                  ? "bg-orange-200 text-slate-900 hover:bg-orange-300"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
            >
              Download HDR image
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
