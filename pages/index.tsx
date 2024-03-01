import type { NextPage } from "next"
import Link from "next/link"
import Container from "../components/container"

const Home: NextPage = () => {
  return (
    <Container activeId="about">
      <div className="flex gap-4 sm:gap-8 sm:items-center">
        <img
          src="/tom.jpg"
          alt="An image of Tom Nick"
          className="rounded-full sm:w-48 sm:h-48 w-16 h-16"
        />
        <div>
          <h2 className="text-3xl mb-4">{"Hi, I'm Tom"}</h2>
          <p className="leading-7">
            {
              "I'm passionate about technology and love to create products. I work occasionally on personal "
            }
            <Link href="/projects" className="link">
              projects
            </Link>
            , many of which are already launched. I believe in self-improvement
            and always try to get better at my skills and learn new ones.{" "}
            {"I'm on "}
            <a className="link" href="https://github.com/tn1ck">
              Github
            </a>{" "}
            and{" "}
            <a
              className="link"
              href="https://www.linkedin.com/in/tom-nick-50515110b/"
            >
              LinkedIn
            </a>
            .
          </p>
        </div>
      </div>
      <h2 id="work" className="page-break text-2xl mt-8 mb-4">
        Work
      </h2>
      <div className="grid gap-4">
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>Mid 2021 - Now</time>
            <strong>VP of Engineering @ re:cap</strong>
          </div>
          {
            "We're building a funding marketplace for the subscription economy. With re:cap, companies can trade recurring revenue streams for upfront capital – no dilution, no debt, no hassle."
          }
        </div>
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>Mid 2019 - Mid 2021</time>
            <strong>Software Engineer @ Google / YouTube</strong>
          </div>
          {
            "Worked on bringing e-commerce features onto YouTube (ShopTube). Work included working on the whole YouTube stack and cross collaborating with several other teams."
          }
        </div>
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>Mid 2017 - Mid 2019</time>
            <strong>Head of Software Engineering @ Separa / KPV Lab</strong>
          </div>
          The{" "}
          <a
            className="link"
            href="https://www.linkedin.com/company/sapera-studios"
          >
            Sapera
          </a>{" "}
          (before Infographics Group / KPV Lab) was a venture capital funded
          agency for infographics. We were building a tool to enable creatives
          to build web native stories. The tool ended up being something like
          Flash, but based on Three.js and heavily optimized for phones. The
          software still exists at{" "}
          <a className="link" href="https://business.scrolly.com/">
            scrlly.com
          </a>
          .
        </div>
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>Early 2015 - Mid 2017</time>
            <strong>Senior Frontend Engineer @ LIQID Investments GmbH</strong>
          </div>
          <a className="link" href="https://www.liqid.de">
            LIQID
          </a>{" "}
          is a robo advisor that offers affluent investors in Germany a fully
          digital wealth management service. Only eight months after market
          launch, LIQID reached 100 million euro in assets under management and
          was named Germany’s best late stage FinTech startup. As of today,
          LIQID is among the four largest and most successful robo advisors in
          Europe.
        </div>
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>2013 - 2014</time>
            <strong>Working Student @ 42reports</strong>
          </div>
          The startup 42reports gave brick and mortar stores realtime analytics
          using wlan fingerprinting. 42reports provided devices that were easy
          to setup, a realtime dashboard and the ability to track complete
          shopping malls using a mesh of routers. 42reports was acquired by{" "}
          <a
            className="link"
            rel="noreferrer"
            target="_blank"
            href="https://www.dilax.com/"
          >
            Dilax
          </a>
          .
        </div>
      </div>
      <h2 id="education" className="text-2xl mt-8 mb-4">
        Education
      </h2>
      <div className="grid gap-4">
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>2011 - 2015</time>
            <strong>
              Bachelor of Science in Computer Science @
              <br />
              Technische Unversität Berlin
            </strong>
          </div>
          In university my focus revolved mostly around Machine Learning, AI,
          Robotics and Application Development. My thesis can be found under{" "}
          <Link href="/projects" className="link">
            Projects
          </Link>
          .
        </div>
        {/* Who cares? */}
        {/* <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>1998 - 2011</time>
            <strong>First & Secondary School</strong>
          </div>
        </div> */}
      </div>
    </Container>
  )
}

export default Home
