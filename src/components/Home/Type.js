import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
		<Typewriter
			options={{
				strings: [
					"Full Stack Developer",
					"Tutor in Bootcamp CoderHouse",
					"Javascript content creator in spanish at Coursera",
					"My hoobies is play game and watch movies",
					"And I love football ⚽ ⚽ ⚽",
				],
				autoStart: true,
				loop: true,
				deleteSpeed: 50,
			}}
		/>
  );
}

export default Type;
