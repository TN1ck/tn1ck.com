import type { NextPage } from "next"
import Head from "next/head"
import Container from "../components/container"

const LegalPage: NextPage = () => {
  return (
    <Container activeId="">
      <Head>
        <title>tn1ck.com | legal</title>
        <meta
          name="description"
          content="Imprint and privacy policy of tn1ck.com"
        />
      </Head>

      <div className="blog mt-16">
        <h1>Imprint & Privacy Policy</h1>
        <p className="text-sm text-slate-600">Last updated: April 5, 2026</p>

        <h2>Imprint</h2>
        <p>
          Information pursuant to Section 5 DDG and controller within the
          meaning of Art. 4(7) GDPR:
        </p>
        <address className="not-italic">
          Tom Nick
          <br />
          Oudenarder Str. 24
          <br />
          13347 Berlin
          <br />
          Germany
        </address>
        <p>
          E-Mail:{" "}
          <a className="link" href="mailto:tomwanick@gmail.com">
            tomwanick@gmail.com
          </a>
        </p>
        <p>
          This website is a private personal website. It does not provide
          commercial services or journalistic-editorial content.
        </p>

        <h2>Privacy Policy</h2>
        <p>
          The protection of personal data is important to me. Personal data is
          processed on this website only to the extent necessary for operating
          the site, providing it technically, and handling communication by
          email.
        </p>

        <h2>Hosting and Technical Provision</h2>
        <p>
          This website is provided via Cloudflare Pages. When you access the
          website, technically necessary connection data may be processed, in
          particular IP address, date and time, requested content, browser
          information, and protocol data. This processing is carried out to
          ensure the secure and stable delivery of the website.
        </p>
        <p>
          The legal basis is Art. 6(1)(f) GDPR. The legitimate interest lies in
          the secure provision and technical operation of this website.
        </p>

        <h2>Cloudflare Web Analytics</h2>
        <p>
          Cloudflare Web Analytics is currently integrated on the production
          site of tn1ck.com. This loads a script from Cloudflare that collects
          pseudonymous usage and performance data in order to measure usage and
          website performance.
        </p>
        <p>
          According to Cloudflare, this script does not use cookies and does
          not access localStorage or sessionStorage. In a recent check of the
          production site, no cookies were set for either tn1ck.com or
          cloudflareinsights.com.
        </p>
        <p>
          The legal basis is Art. 6(1)(f) GDPR. The legitimate interest lies in
          aggregated traffic measurement and technical optimization of this
          website.
        </p>

        <h2>Contact by Email</h2>
        <p>
          If you contact me by email, I process the information you provide
          solely for the purpose of handling your request and any follow-up
          questions.
        </p>
        <p>
          The legal basis is Art. 6(1)(b) GDPR insofar as your request is
          related to a contract or pre-contractual measures; otherwise the legal
          basis is Art. 6(1)(f) GDPR.
        </p>

        <h2>Your Rights</h2>
        <p>
          Under the applicable legal provisions, you have the right to access,
          rectification, erasure, restriction of processing, data portability,
          and to object to the processing of your personal data.
        </p>
        <p>
          You also have the right to lodge a complaint with a data protection
          supervisory authority.
        </p>

        <h2>External Links</h2>
        <p>
          This website contains links to external websites, for example GitHub
          or LinkedIn. Their respective operators are solely responsible for the
          content of and data processing on those linked websites.
        </p>
      </div>
    </Container>
  )
}

export default LegalPage
