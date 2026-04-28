import type { NextPage, Metadata } from "next"
import Link from "next/link"
import Container from "../components/container"
import Head from "next/head"
import { Card } from "../components/card"

const WorkSection = ({
  time,
  title,
  description,
}: {
  time: string
  title: string
  description: React.ReactNode
}) => (
  <Card
    title={
      <div>
        <strong
          className="block"
          dangerouslySetInnerHTML={{ __html: title }}
        ></strong>
        <time className="block text-xs font-normal">{time}</time>
      </div>
    }
  >
    <div className="mt-2">{description}</div>
  </Card>
)

export const metadata: Metadata = {
  title: "Tn1ck.com - Personal Website of Tom Nick",
  description:
    "Personal website of Tom Nick. Mostly about technology and personal projects.",
}

const workData = [
  {
    time: "Mid 2021 - Now",
    title: "VP of Engineering @ re:cap",
    description: (
      <>
        <a className="link" href="https://re-cap.com">
          re:cap
        </a>{" "}
        provides companies with non dilutive funding as well as best in class
        financial tools. Built a contract trading platform that ingests open
        banking, subscription, and accounting data, enriches it with ML/AI,
        and rates funding-seeking companies. Worked closely with product and
        underwriting and led a team of 10 engineers.
      </>
    ),
  },
  {
    time: "Mid 2019 - Mid 2021",
    title: "Software Engineer @ Google / YouTube",
    description: (
      <>
        Worked on YouTube Shopping, enabling creators to sell products
        as an additional revenue stream. Built creator-facing tooling for
        product tagging, payout onboarding, and review pipelines, launched live
        stream product promotions that contributed to YouTube Shopping&apos;s
        highest-grossing day.
      </>
    ),
  },
  {
    time: "Mid 2017 - Mid 2019",
    title: "Head of Software Engineering @ Separa / KPV Lab",
    description: (
      <>
        <a
          className="link"
          href="https://www.linkedin.com/company/sapera-studios"
        >
          Sapera
        </a>{" "}
        (before Infographics Group / KPV Lab) was a venture capital funded
        agency for infographics. We were building a tool to enable creatives to
        build web native stories. The tool ended up being something like Flash,
        but based on Three.js and heavily optimized for phones. The software
        still exists at{" "}
        <a className="link" href="https://business.scrolly.com/">
          scrlly.com
        </a>
        .
      </>
    ),
  },
  {
    time: "Early 2015 - Mid 2017",
    title: "Senior Frontend Engineer @ LIQID Investments GmbH",
    description: (
      <>
        <a className="link" href="https://www.liqid.de">
          LIQID
        </a>{" "}
        is a robo advisor that offers affluent investors in Germany a fully
        digital wealth management service. Only eight months after market
        launch, LIQID reached 100 million euro in assets under management and
        was named Germany’s best late stage FinTech startup. As of today, LIQID
        is among the four largest and most successful robo advisors in Europe.
      </>
    ),
  },
  {
    time: "2013 - 2014",
    title: "Working Student @ 42reports",
    description: (
      <>
        The startup 42reports gave brick and mortar stores realtime analytics
        using wifi fingerprinting. 42reports provided devices that were easy to
        setup, a realtime dashboard and the ability to track complete shopping
        malls using a mesh of routers. 42reports was acquired by{" "}
        <a
          className="link"
          rel="noreferrer"
          target="_blank"
          href="https://www.dilax.com/"
        >
          Dilax
        </a>
        .
      </>
    ),
  },
]

const Home: NextPage = () => {
  return (
    <Container activeId="about">
      <div className="flex gap-4 sm:gap-8 sm:items-center mt-16">
        <Head>
          <title>tn1ck.com | about</title>
          <meta
            name="description"
            content="Tom Nick's personal website and blog"
          />
        </Head>
        {/* <img
          src="/tom.jpg"
          alt="An image of Tom Nick"
          className="rounded-full sm:w-48 sm:h-48 w-16 h-16"
        /> */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{"Hi, I'm Tom"}</h2>
          <p>
            {
              "I'm passionate about technology and love to create products. I work occasionally on personal "
            }
            <Link href="/projects" className="link">
              projects
            </Link>
            , many of which are already launched. I believe in self-improvement
            and always try to get better at my skills and learn new ones.
          </p>
          <div className="mt-4">
            <p>Feel free to reach out:</p>
            <ul className="mt-2 space-y-1">
              <li>
                Email:{" "}
                <a className="link" href="mailto:tomwanick@gmail.com">
                  tomwanick@gmail.com
                </a>
              </li>
              <li>
                LinkedIn:{" "}
                <a
                  className="link"
                  href="https://www.linkedin.com/in/tom-nick/"
                >
                  @tom-nick
                </a>
              </li>
              <li>
                GitHub:{" "}
                <a className="link" href="https://github.com/Tn1ck">
                  @Tn1ck
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col relative bg-slate-50 border-2 border-slate-900 p-6 py- mt-16">
        <div className="absolute -top-6 left-4 bg-slate-50 p-2 font-black">
          Work
        </div>
        <div className="grid gap-4">
          {workData.map((work, index) => (
            <WorkSection
              key={index}
              time={work.time}
              title={work.title}
              description={work.description}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col relative bg-slate-50 border-2 border-slate-900 p-6 py-8 mt-16">
        <div className="absolute -top-6 left-4 bg-slate-50 p-2 font-black">
          Education
        </div>
        <div className="grid gap-4">
          <WorkSection
            time="2011 - 2015"
            title="Bachelor of Science in Computer Science @ TU Berlin"
            description="In university my focus revolved mostly around Machine Learning, AI, Robotics and Application Development. My thesis can be found under Projects."
          />
        </div>
      </div>
    </Container>
  )
}

export default Home
