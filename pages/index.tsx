import type { NextPage } from "next"
import Link from "next/link"
import Container from "../components/container"

const Home: NextPage = () => {
  return (
    <Container activeId="about">
      <h2 className="text-3xl mb-4">{"Hi, I'm Tom"}</h2>
      <p className="leading-7">
        {
          "I'm a developer by heart and love to create products. I spend a lot of time apart from my job to work on personal "
        }
        <Link href="/projects" className="link">
          projects
        </Link>
        , many of which are already launched. I believe in self-improvement and
        always try to get better at my skills and learn new ones. {"I'm on "}
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
      <h2 id="work" className="page-break text-2xl mt-8 mb-4">
        Work
      </h2>
      <div className="grid gap-4">
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>Mid 2021 - Now</time>
            <strong>VP Engineering @ re:cap</strong>
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
            <time>Early 2018 - Mid 2019</time>
            <strong>Head of Software Engineering @ Infographics Group</strong>
          </div>
          The{" "}
          <a className="link" href="https://infographics.group">
            Infographics Group
          </a>{" "}
          is a venture capital funded agency for infographics. By combining the
          know how of infographics and tech, the Infographics Group creates next
          generation tools that help creatives create{" "}
          <a className="link" href="http://info.graphics">
            interactive stories the web
          </a>
          .
        </div>
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>Mid 2017 - Early 2018</time>
            <strong>Senior Software Engineer @ KPV Lab</strong>
          </div>
          <a className="link" href="http://kpv-lab.com/">
            KPV Lab
          </a>{" "}
          is a tech holding partnership founded 2015 in Berlin. It seeded
          multiple start-ups which are operating in stealth mode - as is the
          parent entity. Focus is on next-gen software, advanced
          user-interfaces, realtime interactive visual tools, creating entirely
          novel solutions, each unprecedented in their field.
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
        <div className="bg-white shadow-lg p-4 leading-7">
          <div className="mb-4 flex flex-row-reverse justify-between">
            <time>1998 - 2011</time>
            <strong>First & Secondary School</strong>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Home
