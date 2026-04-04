/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import type { NextPage } from "next"
import Container from "../../components/container"
import { BlogContent } from "../../components/blog"
import { Footnote } from "../../components/footnote"
import { HDRImageWidget } from "../../components/hdr-image-widget"

export const metadata = {
  title: "(Ab)use HDR images for marketing",
  description:
    "How HDR images can make logos and highlights appear unnaturally bright, and how to create them yourself.",
  date: "2026-04-04",
  slug: "abuse-hdr-images-for-marketing",
}

const Placeholder = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`my-8 border-2 border-dashed border-slate-400 bg-slate-100 p-4 text-sm text-slate-700 ${className}`}
    >
      {children}
    </div>
  )
}

const HDRComparisonImages = () => {
  const images = [
    {
      src: "/hdr-images/cat-normal.jpg",
      alt: "Cat image in normal color space",
      label: "Normal",
    },
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

const AbuseHDRImagesForMarketingBlog: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
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
          and tried to screenshot it, to no avail, the effect was not captured <Footnote>Turns out, you just have to enable a setting on the iPhone for this: Go to Screen Capture and set the Format to "HDR"</Footnote>.
          What was going on? Am I tripping? I won't link to the exact page I
          saw, <a href="https://www.linkedin.com/company/extra-bright-images">but I created my own page with an extra bright picture</a>. If your device passed the previous HDR
          image check, the company's logo should be abnormally bright. Works especially good on a recent Macbook Pro.
        </p>

        <p>
          So what's going on? The image is an HDR image. This is not to be
          confused with the classic HDR tone mapping where, for example, you
          took three photos with different exposures, merged them, and created
          some artistically valuable or horrifying image. The HDR here refers
          to the newer display technology, which is capable of displaying colors
          outside of the classical 00 - FF range by using the dynamic
          brightness of the display to make certain parts extra bright or dark.
        </p>

        <p>
          To properly see HDR images, you first and foremost need a display
          that has this capability, and then a software stack that can use it.
          My iPhone with Safari checked both of these boxes, enabling me to see
          this.
        </p>

        <p>
          So while this technology is really cool and useful for games, videos,
          and looking at your own images, this use is firmly in abusive
          territory. I don't think it will take long until the major sites
          disable this behavior for images uploaded to their pages, or try to
          monetize it. But until then, let's have some fun and use the effect
          for ourselves. Try it out here (it's completely client side):
        </p>

        <HDRImageWidget variant="ultra" />

        <p>
          I also made it into a standalone website for easier usage, as there
          was nothing like it yet: <a target="_blank" rel="noopener noreferrer" href="https://extrabrightimages.com">extrabrightimages.com</a>.
        </p>

        <p>
          But how does this actually work?{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://gregbenzphotography.com/hdr/"
          >
            Greg Benz has a really great overview about all this
          </a>
          , so definitely check out his resources for a much more detailed
          breakdown.
        </p>

        <p>
          There are several ways to create these images. The "best" is creating
          an{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Ultra_HDR"
          >
            Ultra HDR
          </a>{" "}
          image, which is an extension of the JPEG file format. It consists of
          three things:
        </p>

        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>The original JPEG</li>
          <li>
            A gain image, which is a black and white image (mask) that says
            which parts should be made brighter / darker. White will make
            something bright, black darker, and gray won't change anything.
          </li>
          <li>
            Metadata that says how strong the effect should be. For example, if
            a spot is white in the gain map, how bright should it be shown? If
            you set this value to the brightness of the literal sun, you might
            be disappointed about the actual brightness. Your display has a
            technical upper limit on how bright it can get. The important unit
            here is "nits". The more nits your display has, the brighter it can
            get. But this means there is no real max value here, future
            displays will get brighter and brighter and you cannot fully
            control how an HDR image will look. Depending on the display's
            brightness, it will differ.
          </li>
        </ul>

        <p>
          It's pretty neat as it is backwards compatible and you can control
          how the image should look for non-HDR displays.
        </p>

        <p>
          The actual heavy lifting is done by libraries that use this data to
          create the actual images. I used{" "}
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
          But this is actually not what I used for the image for LinkedIn,
          because Ultra HDR images sadly do not work there. Which is a shame,
          as they are so much simpler to create, backwards compatible, and
          offer complete freedom over the final look.
        </p>

        <p>
          The other way to create an HDR image is to use an HDR color profile.
          The only one I found that's properly supported is{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Rec._2100"
          >
            Rec.2100 PQ
          </a>
          . The PQ part is what makes this into an HDR image. The bigger color
          space or 10-12 bit colors just make it look better. You can even make
          8 bit JPEGs into HDR images. But as they only have 255 values for
          each pixel per channel, you won't be able to create good gradients
          with that though, but good enough for e.g. a black and white logo. The only difficulty is correctly mapping an existing
          image into the new color space. Thankfully I found a project by shigedangao on
          GitHub that does exactly this and it worked perfectly:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/shigedangao/lymui"
          >
            https://github.com/shigedangao/lymui
          </a>
          .
        </p>

        <p>So here is the same applet for this approach. You will notice that this image is not as backwards compatible, but at least we can now grab peoples attention on LinkedIn now without what building this website taught me about B2B sass.</p>

        <HDRImageWidget variant="native" />

        <p>That is all, have fun with your extra bright images.</p>

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
          found{" "}
          <a href="/wasm-vips/THIRD-PARTY-NOTICES.md">here</a>.
        </div>
      </BlogContent>
    </Container>
  )
}

export default AbuseHDRImagesForMarketingBlog
