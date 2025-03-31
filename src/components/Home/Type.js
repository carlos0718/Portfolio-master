import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
	let date = new Date();
	let year = date.getFullYear() - 2021;
	return (
		<Typewriter
			options={{
				strings: [
					`Full Stack Developer with +${year} years of experience`,
					"Tutor in Bootcamp CoderHouse",
					"Mentor Web Developer in ISTEA Institute",
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
