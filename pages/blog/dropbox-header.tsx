import { NextPage, Metadata } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import Head from "next/head"

export const metadata = {
  title: "Recreating the New Dropbox Header Animation",
  description:
    "Dropbox just revamped their branding - and their website. The new header uses a cool clipping effect, which we’ll recreate.",
  date: "2017-11-20",
  slug: "dropbox-header",
}

const Dropbox: NextPage = () => {
  return (
    <Container activeId="blog">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <BlogContent metadata={metadata}>
        <p>
          Dropbox just revamped their branding - and their website. The new
          header uses a cool clipping effect, which we’ll recreate.
        </p>
        <p>
          If you haven’t checked out the new Dropbox landing page, do it and pay
          special attention to the header as it moves over the different colored
          sections. You can see the effect in the gif below.
        </p>
        <img
          src="/dropbox-header/dropbox-animation.gif"
          alt="The header effect Dropbox uses to highlight their new brand colors."
        />
        <p>
          The header effect Dropbox uses to highlight their new brand colors.
        </p>
        <p>
          So how is it done? It can’t be blend modes, as those only work in
          Chrome, but Safari works as well.
        </p>
        <p>
          When inspecting the DOM, one quickly notices that the header is inside
          every section - always with the correct colors for that section. It
          has <code>position: fixed</code>, so why isn’t it permanently visible
          and only relative to the parent section? CSS masks, which fortunately{" "}
          <a href="https://caniuse.com/#search=css%20masks">
            most browsers support
          </a>
          .
        </p>
        <img
          src="/dropbox-header/dropbox-dom.png"
          alt="The clip property, accompanied with absolute positioning, will clip containing fixed positioned elements."
        />
        The clip property, accompanied with absolute positioning, will clip
        containing fixed positioned elements.
        <p>So, to make it work, one needs:</p>
        <p>1. A relatively positioned section which will hold the content.</p>
        <CodeBlock language="css" className="-mx-8">{`
.section {
    position: relative;
}
`}</CodeBlock>
        <p>
          2. Inside it, an absolutely positioned container that spans the whole
          section and clips its content. When set to <code>auto</code>, it will
          automatically use 100%.
        </p>
        <CodeBlock language="css" className="-mx-8">
          {`
.section__absolute-container {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    clip: rect(auto, auto, auto, auto);
}
`}
        </CodeBlock>
        <p>
          3. Inside the absolutely positioned container, the fixed positioned
          element with a <code>transform</code> to make Safari happy.
        </p>
        <CodeBlock language="css" className="-mx-8">
          {`
.section__fixed-element {
    position: fixed;
    top: 0;
    left: 0;
    /* without a transform, Safari will have weird rendering bugs.
       transform: translate3D(0, 0, 0) and similar also work */
    transform: translateZ(0);
    will-change: transform;
}
`}
        </CodeBlock>
        <p>This would be valid HTML with these classes:</p>
        <CodeBlock language="xml" className="-mx-8">
          {`
<div class="section">
    <div class="section__absolute-container">
        <div class="section__fixed-element">
        </div>
    </div>
</div>
`}
        </CodeBlock>
        <p>
          <a href="http://jsfiddle.net/lmeurs/jf3t0fmf/">
            Here is a good JSFiddle that shows this technique.
          </a>
        </p>
        <h3 id="update">Update</h3>
        <p>
          <a href="https://www.reddit.com/r/web_design/comments/7ed42q/recreating_the_new_dropbox_header_animation/dq4do10/">
            /u/usmonov
          </a>{" "}
          mentioned on Reddit that the jQuery plugin{" "}
          <a href="http://aerolab.github.io/midnight.js/">Midnight.js</a>{" "}
          achieves the same effect in all browsers. It uses a combination of{" "}
          <code>overflow: hidden</code> and JavaScript applied transforms to
          achieve this. The transforms are applied using a{" "}
          <code>requestAnimationFrame</code>, so no active scroll listener -
          which is really good! Using CSS masks is still better, in my opinion,
          as it doesn’t need JavaScript running every 1/60s to work.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Dropbox
