import React from 'react';
import Typewriter from 'typewriter-effect';

function Type() {
	const date = new Date().getFullYear();
	const yearsOfExperience = date - 2020;
	return (
		<Typewriter
			options={{
				strings: [
					`I have more than +${yearsOfExperience} years of experience creating digital solutions and building scalable applications.`,
					'I work with React, Next.js, Node.js, and .NET to develop fast and modern web apps.',
					'I also use AI tools to automate tasks and improve development speed.',
					'I enjoy turning ideas into real products, focusing on clean code, good architecture, and simple user interfaces.',
					'I also teach and mentor students at ISTEA, sharing my knowledge and promoting constant learning.'
				],
				autoStart: true,
				loop: true,
				deleteSpeed: 60
			}}
		/>
	);
}

export default Type;
