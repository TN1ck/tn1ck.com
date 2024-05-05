import type { NextPage } from "next"
import Container from "../components/container"
import ProjectComponent from "../components/project"

const Projects: NextPage = () => {
  return (
    <Container activeId="projects">
      <h2 className="text-3xl mb-4">Personal Projects</h2>
      <div className="grid gap-8">
        <ProjectComponent
          project={{
            title: "sudoku.tn1ck.com",
            year: "2022",
            author: "Tom Nick",
            video: "/projects/sudoku.webm",
            preview: "/projects/sudoku.png",
          }}
        >
          <p>
            <a className="link" href="https://sudoku.tn1ck.com">
              sudoku.tn1ck.com
            </a>{" "}
            is full featured sudoku app with a decently polished web UI. It has
            support for notes, hints, keyboard shortcuts, a timer that stops
            when the window loses focus, 100 sudokus for each of the
            difficulties and first class citizen support for desktop (mobile or
            mouse) and mobile. I started this project out of frustration for the
            available web options back then (2017), this has since then greatly
            improved. The project is{" "}
            <a className="link" href="https://github.com/TN1ck/super-sudoku">
              open source on Github
            </a>
            .
          </p>
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "mastersfordesigners.com",
            year: "2019",
            author: "Tom Nick & Stephanie Brenner",
            video: "/projects/mastersfordesigners.mp4",
            preview: "/projects/mastersfordesigners.png",
          }}
        >
          <p>
            <a className="link" href="https://mastersfordesigners.com">
              mastersfordesigners.com
            </a>{" "}
            is a project by Stefanie Brenner and me which aims to simplify the
            finding and choosing of design masters in germany. It has a very
            advanced filtering feature, a bookmark functionality and a very nice
            glossary.
          </p>
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "anagrams.io",
            year: "2017",
            author: "Tom Nick",
            video: "/projects/anagrams.io.mp4",
            preview: "/projects/anagrams.io.png",
          }}
        >
          <p>
            With{" "}
            <a className="link" href="https://anagrams.io">
              anagrams.io
            </a>{" "}
            we tried to create the best anagram generator in the world. The
            project started because we once searched for anagrams and all
            generators were not sufficient enough. The biggest challenge here
            was to combine the immense search space of an anagram generator with
            a nice and fast UI. Using Mobx, webworkers and React this goal was
            achieved.
          </p>
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "Pokémoncries.com",
            year: "2017",
            author: "Tom Nick",
            video: "/projects/pokemoncries.mp4",
            preview: "/projects/pokemoncries.png",
          }}
        >
          <a className="link" href="https://pokemoncries.com">
            Pokémoncries
          </a>{" "}
          is a small little game, where you have to recognize a Pokémon with its
          GameBoy sound. I originally created it as a gift, but then we polished
          it a bit and released it. It was initially released on{" "}
          <a className="link" href="https://reddit.com/r/pokemon">
            reddit.com/r/pokemon
          </a>{" "}
          and on the german games site{" "}
          <a
            className="link"
            href="https://www.gamepro.de/artikel/pokemon-cries-testet-euer-wissen-erkennt-ihr-die-game-boy-sounds-aller-pokemon,3327842.html"
          >
            GamePro
          </a>
          . The YouTuber aDrive then created a video called{" "}
          <a
            className="link"
            href="https://www.youtube.com/watch?v=x2Oy495gBGQ"
          >
            {"Pokemon Cry Challenge"}
          </a>{" "}
          where he played the game, afterwards a lot of other YouTubers followed
          suit and also did the Pokémon Cry Challenge. It is really nice to see
          how much people seem to enjoy this small little game and how it went
          viral in a small circle of Pokémon players.
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "Pixel OCD",
            year: "2017",
            author: "Tom Nick",
            video: "/projects/pixel-ocd.mp4",
            preview: "/projects/pixel-ocd.png",
          }}
        >
          <p>
            In{" "}
            <a className="link" href="https://tn1ck.github.io/pixel-ocd/">
              Pixel OCD
            </a>{" "}
            you have to find the <em>wrong</em> pixel. When clicked the canvas
            will change to its color. It is surprisingly meditative.
          </p>
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "BrightnessChanger",
            year: "2015",
            author: "Tom Nick",
            video: "/projects/brightnesschanger.mp4",
            preview: "/projects/brightnesschanger.png",
          }}
        >
          <p>
            I wrote BrightnessChanger to change the brightness of my external
            display. I often like to work with a reduced brightness, but
            sometimes I have to turn it up when it is really bright outside. It
            was my first Swift/C project for macOs. Despite being a protoype, I
            still use it often und it works flawlessly. It is using the{" "}
            <a
              className="link"
              href="https://de.wikipedia.org/wiki/Display_Data_Channel"
            >
              DDC-Protocol
            </a>{" "}
            to change the attributes of the display. A lot of displays support
            this.
          </p>
          <p>
            <a
              className="link"
              href="https://github.com/TN1ck/BrightnessChanger/blob/master/BrightnessChanger.zip?raw=true"
            >
              Download it here
            </a>
            .
          </p>
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "ArUco print",
            year: "2015",
            author: "Tom Nick",
            video: "/projects/aruco-print.mp4",
            preview: "/projects/aruco-print.png",
          }}
        >
          <a className="link" href="http://tn1ck.github.io/aruco-print/">
            ArUco Print
          </a>{" "}
          is a small app to create ArUco markers. I needed to print a lot of
          them for a robotics project, and there was not a resource available to
          print specific markers and a lot of them, so I created this small
          page.
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "Bachelor Thesis",
            year: "2015",
            author: "Tom Nick",
            video: "/projects/bachelor-thesis.mp4",
            preview: "/projects/bachelor-thesis.png",
          }}
        >
          I wrote my bachelor thesis for the DAI Laboratory. It is used there as
          a social search engine. One can query their search engine and
          rate/save the results. The actions were gamified, so the users were
          more motivated to actually rate the results. Using websockets the
          actions immediately affected the global leaderboard and score, so the
          application could be used to shown on an office screen. The layout
          engine of the application was written by me, as well as all other
          things. The technologies used were exclusively lower level things like
          react, reflux, lodash.
          <a className="link" href="https://bachelor-tom-nick.herokuapp.com">
            I host a semi working version with a reddit backend here.
          </a>
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "Numbers Game",
            year: "2015",
            author: "Tom Nick",
            video: "/projects/numbers-game.mp4",
            preview: "/projects/numbers-game.png",
          }}
        >
          <a className="link" href="https://tn1ck.github.io/numbers-game/">
            Numbers Game
          </a>{" "}
          is a game that was normally played in the classroom. It is a tough
          game, which you can actually loose when you found a loop. I computed
          the minimal solution once, read it{" "}
          <a className="link" href="https://tn1ck.com/blog/numbers-game">
            here
          </a>
          .
        </ProjectComponent>
        <ProjectComponent
          project={{
            title: "Sketches",
            year: "2015",
            author: "Tom Nick",
            video: "/projects/sketches.mp4",
            preview: "/projects/sketches.png",
          }}
        >
          <a className="link" href="http://tn1ck.github.io/sketches/app/">
            Sketches
          </a>{" "}
          is a site where I wanted to share my sketches made with{" "}
          <a className="link" href="https://p5js.org/">
            p5.js
          </a>
          , the JavaScript version of Processing. I actually wanted to make one
          sketch per week, but this did not really work out. The coolest sketch
          is probably the tree generator, as the trees look really realistic.
        </ProjectComponent>
      </div>
    </Container>
  )
}

export default Projects
