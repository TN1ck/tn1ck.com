/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import type { NextPage } from "next"
import Container from "../../components/container"
import { BlogContent } from "../../components/blog"
import { Footnote } from "../../components/footnote"
import { HDRImageWidget } from "../../components/hdr-image-widget"
import { getBlogMetadata } from "../../lib/blog-entries"

export const metadata = getBlogMetadata("abuse-hdr-images-for-marketing")

const HDRComparisonImages = () => {
  const images = [
    {
      src: "/hdr-images/cat-hdr.jpg",
      alt: "Cat image in HDR color space",
      label: "HDR",
    },
    {
      src: "/hdr-images/cat-ultrahdr.jpg",
      alt: "Cat image encoded as Ultra HDR",
      label: "Ultra HDR",
    },
    {
      src: "/hdr-images/cat-normal.jpg",
      alt: "Cat image in normal color space",
      label: "Normal",
    },
  ]

  return (
    <div className="my-8 grid grid-cols-3 gap-2 md:gap-4">
      {images.map((image) => (
        <figure key={image.src} className="m-0">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full border border-slate-300 bg-white"
          />
          <figcaption className="mt-2 text-center text-xs text-slate-600">
            {image.label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const OverviewItem = ({
  label,
  src,
  alt,
}: {
  label: string
  src: string
  alt: string
}) => {
  return (
    <figure className="m-0 w-28 shrink-0">
      <img
        src={src}
        alt={alt}
        className="w-full border-2 border-slate-900 bg-white"
      />
      <figcaption className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-slate-600">
        {label}
      </figcaption>
    </figure>
  )
}

const EquationMarker = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="flex h-28 shrink-0 items-center text-lg text-slate-500">
      {children}
    </span>
  )
}

const OverviewBlock = ({
  label,
  widthClass = "w-36",
  children,
}: {
  label: string
  widthClass?: string
  children: React.ReactNode
}) => {
  return (
    <figure className={`m-0 ${widthClass} shrink-0`}>
      <div className="flex h-28 items-center justify-center border-2 border-slate-900 bg-slate-50 p-3">
        {children}
      </div>
      <figcaption className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-slate-600">
        {label}
      </figcaption>
    </figure>
  )
}

const UltraHdrOverview = () => {
  return (
    <div className="my-8">
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max items-start justify-center gap-3">
          <OverviewItem
            label="sdr jpg"
            src="/hdr-images/cat-normal.jpg"
            alt="Standard dynamic range cat JPEG"
          />
          <EquationMarker>+</EquationMarker>
          <OverviewItem
            label="gain jpg"
            src="/hdr-images/cat-gain.jpg"
            alt="Gain map generated from the cat image"
          />
          <EquationMarker>+</EquationMarker>
          <OverviewBlock label="metadata">
            <pre className="overflow-x-auto text-[0.62rem] leading-5 text-slate-700">
              {`max-content-boost: 15x
min-content-boost: 0.9x
gamma: 1
hdr-capacity-max: 15x`}
            </pre>
          </OverviewBlock>
          <EquationMarker>=</EquationMarker>
          <OverviewItem
            label="ultra hdr"
            src="/hdr-images/cat-ultrahdr.jpg"
            alt="Ultra HDR cat JPEG"
          />
        </div>
      </div>
    </div>
  )
}

const NativeHdrOverview = () => {
  return (
    <div className="my-8">
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max items-start justify-center gap-3">
          <OverviewItem
            label="sdr jpg"
            src="/hdr-images/cat-normal.jpg"
            alt="Standard dynamic range cat JPEG"
          />
          <EquationMarker>+</EquationMarker>
          <OverviewBlock label="pq remap" widthClass="w-32">
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className="h-full w-full"
            >
              <defs>
                <linearGradient
                  id="pq-remap-gradient"
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="55%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <path d="M14 82H88" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M14 82V12" stroke="#cbd5e1" strokeWidth="2" />
              <path
                d="M18 78C34 78 50 74 62 60C72 48 78 32 84 18"
                fill="none"
                stroke="url(#pq-remap-gradient)"
                strokeLinecap="round"
                strokeWidth="6"
              />
              <circle cx="18" cy="78" r="4" fill="#94a3b8" />
              <circle cx="84" cy="18" r="4" fill="#ea580c" />
            </svg>
          </OverviewBlock>
          <EquationMarker>+</EquationMarker>
          <OverviewBlock label="rec.2100 pq">
            <pre className="overflow-x-auto text-[0.62rem] leading-5 text-slate-700">
              {`profile: Rec.2100
transfer: PQ
primaries: Rec.2020`}
            </pre>
          </OverviewBlock>
          <EquationMarker>=</EquationMarker>
          <OverviewItem
            label="hdr jpg"
            src="/hdr-images/cat-hdr.jpg"
            alt="Cat image with HDR color profile"
          />
        </div>
      </div>
    </div>
  )
}

const AbuseHDRImagesForMarketingBlog: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p className="text-sm italic text-slate-600">
          Previously published as "(Ab)use HDR images for marketing".
        </p>

        <p>
          <strong>Does one of these images look brighter to you?</strong> If
          not, try opening this on a recent iPhone (with battery saving
          disabled), a recent Pixel, or a recent Mac. Chrome / Safari are
          preferred. You can still continue to read, but sadly won't see the
          effect discussed here.
        </p>

        <HDRComparisonImages />

        <p>
          I was browsing LinkedIn to get my daily dose of motivational quotes
          and stumbled upon a promotion that instantly caught my attention, not
          because of its content, but because the white of the logo was brighter
          than anything else on my screen. I had never seen something like this
          and tried to screenshot it, to no avail, the effect was not captured{" "}
          <Footnote>
            Turns out, you just have to enable a setting on the iPhone for this:
            Go to Screen Capture and set the Format to "HDR"
          </Footnote>
          . What was going on? Am I tripping? I won't link to the exact page I
          saw,{" "}
          <a href="https://www.linkedin.com/company/extra-bright-images">
            but I created my own page with an extra bright picture
          </a>
          . If your device passed the previous HDR image check, the company's
          logo should be abnormally bright. Works especially well on a recent
          MacBook Pro.
        </p>

        <p>
          So what's going on? The image is an HDR image. This is not to be
          confused with the classic HDR tone mapping where, for example, you
          took three photos with different exposures, merged them, and created
          some artistically valuable or horrifying image. The HDR here refers
          to newer display technology that can show a much wider range of
          brightness than a normal SDR image. On supported screens, that means
          selected highlights can become physically brighter instead of just
          being mapped to the brightest SDR white.
        </p>

        <p>
          To properly see HDR images, you first and foremost need a display that
          has this capability, and then a software stack that can use it. My
          iPhone with Safari checked both of these boxes, enabling me to see
          this.
        </p>

        <p>
          So while this technology is really cool and useful for games, videos,
          and looking at your own images, this use is firmly in abusive
          territory. I don't think it will take long until the major sites
          disable this behavior for images uploaded to their pages, or try to
          monetize it. But until then, let's have some fun and use the effect
          for ourselves.
        </p>

        <p>
          Read on if you are curious how it works. Otherwise, you can jump
          straight to{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://extrabrightimages.com"
          >
            extrabrightimages.com
          </a>{" "}
          to create your own extra-bright images. It's completely client-side!
        </p>

        <p>
          For this project, I ended up with two practical ways to create an HDR
          image. One is a new format called "Ultra HDR", the other is using
          an HDR color profile. Let's see how they work:
        </p>
        <h2>Ultra HDR</h2>
        <p>
          An{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Ultra_HDR"
          >
            Ultra HDR
          </a>{" "}
          image is an extension of the JPEG file format. You can think of it
          like this:
        </p>

        <UltraHdrOverview />

        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>The original JPG</li>
          <li>
            A gain JPG, which is a black and white image (mask) that says which
            parts should be made brighter / darker. White will make something
            bright, black darker, and gray won't change anything.
          </li>
          <li>
            Metadata that says how strong the effect should be. For example, if
            a spot is white in the gain map, how bright should it be shown? If
            you set this value to the brightness of the literal sun, you might
            be disappointed about the actual brightness. Your display has a
            technical upper limit on how bright it can get. The important unit
            here is "nits". The more nits your display has, the brighter it can
            get. But this means there is no real max value here, future displays
            will get brighter and brighter and you cannot fully control how an
            HDR image will look. Depending on the display's brightness, it will
            differ.
          </li>
        </ul>

        <p>
          It's pretty neat because it is backwards-compatible, and you can
          control how the image should look on non-HDR displays. Here is a
          widget to create your own Ultra HDR images:
        </p>
        <HDRImageWidget variant="ultra" />

        <p>
          The actual heavy lifting is done by libraries that turn this source
          data into the final images. I used{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/kleisauke/wasm-vips"
          >
            https://github.com/kleisauke/wasm-vips
          </a>
          , which worked great and uses{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/google/libultrahdr"
          >
            https://github.com/google/libultrahdr
          </a>{" "}
          itself for this.
        </p>

        <p>
          But this is actually not what I used for the LinkedIn image, because
          in my tests LinkedIn did not preserve the HDR effect of Ultra HDR
          images. Which is a shame, because they are so much simpler to create,
          backwards-compatible, and offer complete freedom over the final look.
        </p>

        <h2>HDR color profile</h2>

        <p>
          The other way I used for this project is to use an HDR color profile.
          Of the HDR profiles I tested,{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Rec._2100"
          >
            Rec.2100 PQ
          </a>{" "}
          was the only one I found to be consistently supported. The PQ part is
          what makes this into an HDR image. The bigger color space or 10-12-bit
          colors just make it look better. You can even store HDR signaling in
          an 8-bit JPEG, although quality is limited. With only 256 values per
          channel, smooth gradients can break down more easily, so this works
          best for simple graphics such as black-and-white logos. The only
          difficulty is correctly mapping an existing image into the new color
          space. Thankfully I found a project by shigedangao on GitHub that
          does exactly this and it worked perfectly:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/shigedangao/lymui"
          >
            https://github.com/shigedangao/lymui
          </a>
          .
        </p>

        <NativeHdrOverview />

        <p>
          So here is the same applet for this approach. You will notice that it
          is not as backwards-compatible, but unlike Ultra HDR it is more
          likely to work in custom image uploads, like company logos on
          LinkedIn and other sites (I heard Instagram works too).
        </p>

        <HDRImageWidget variant="native" />

        <p>
          That is all, have fun with your extra bright images. If you want to
          read more about HDR images, highly recommend{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://gregbenzphotography.com/hdr/"
          >
            the website of Greg Benz
          </a>
          .
        </p>

        <div className="my-8 border-2 border-slate-900 bg-slate-100 p-4 text-sm leading-6 text-slate-700">
          <strong>Attribution / licenses:</strong> The widgets above are based
          on{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/kleisauke/wasm-vips"
          >
            wasm-vips by kleisauke
          </a>
          , which in turn exposes functionality from projects such as{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/libvips/libvips"
          >
            libvips
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/google/libultrahdr"
          >
            libultrahdr
          </a>
          . The native HDR path was also informed by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/shigedangao/lymui"
          >
            shigedangao/lymui
          </a>
          . The bundled third-party notices for the shipped WASM runtime can be
          found <a href="/wasm-vips/THIRD-PARTY-NOTICES.md">here</a>.
        </div>
      </BlogContent>
    </Container>
  )
}

export default AbuseHDRImagesForMarketingBlog
