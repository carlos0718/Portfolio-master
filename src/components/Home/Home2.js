import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {AiFillGithub} from 'react-icons/ai';
import {FaLinkedinIn, FaWhatsapp} from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';

import {fetchGitHubProfile} from '../../config/github';

function Home2() {
	const [profileImage, setProfileImage] = useState(null);

	useEffect(() => {
		const getProfileImage = async () => {
			const imageUrl = await fetchGitHubProfile();
			setProfileImage(imageUrl);
		};
		getProfileImage();
	}, []);

	return (
		<Container fluid className='home-about-section' id='about'>
			<Container>
				<Row>
					<Col md={8} className='home-about-description'>
						<h1 style={{fontSize: '2.6em'}}>
							LET ME <span className='purple'> INTRODUCE </span> MYSELF
						</h1>
						<p className='home-about-body'>
							I fell in love with programming,{' '}
							<b className='purple'>in 2018 in the faculty of Computer Engineering at the University Buenos Aires </b>.<br /> Then{' '}
							<b className='purple'>in 2019 I continued my studies at University Technological National of Argentina</b> . <br />
							At the end of 2020 <b className='purple'>I had my first job as a full stack developer</b> and since then I have not
							stopped and at least I have learned something, I think...😅
							<br />
							{/*<br />I am proficient in classic technologies like
							<i>
								<b className='purple'>
									{" "}
									C#, ASP.NET, .Net Core, Javascript, React Js, NextJs, HTML 5, CSS 3, Api Context, Redux, Zustand, Redis, NodeJs,
									Axios, Express, MSSQL SERVER, PostgreSQL, GIT HUB, GIT LAB, Docker, AWS, SourceTree, Agile Methodology{" "}
								</b>
							</i> */}
							{/*<br />
							<br />
							 My field of Interest's are building new &nbsp;
							<i>
								<b className='purple'>Data analysis with Python and Excel </b> and also in areas related to{" "}
								<b className='purple'>backend development with Node js and frameworks.</b>
							</i> */}
							{/* <br />
							<br />
							Whenever possible, I also apply my passion for developing products with <b className='purple'>React js y .NET Core</b> and
							<i>
								<b className='purple'> Modern libraries and frameworks with Javascript and C# </b>
							</i>*/}
						</p>
					</Col>
					<Col md={4} className='myAvtar'>
						<Tilt>
							{profileImage ? (
								<img src={profileImage} className='img-fluid' alt='avatar' />
							) : (
								<div className='loading-avatar'>Loading...</div>
							)}
						</Tilt>
					</Col>
				</Row>
				<Row>
					<Col md={12} className='home-about-social'>
						<h1>FIND ME ON</h1>
						<p>
							Feel free to <span className='purple'>connect </span>with me
						</p>
						<ul className='home-about-social-links'>
							<li className='social-icons'>
								<a href='https://github.com/carlos0718' target='_blank' rel='noreferrer' className='icon-colour  home-social-icons'>
									<AiFillGithub />
								</a>
							</li>
							<li className='social-icons'>
								<a
									href='https://www.linkedin.com/in/carlos-jesus-dev/'
									target='_blank'
									rel='noreferrer'
									className='icon-colour  home-social-icons'
								>
									<FaLinkedinIn />
								</a>
							</li>
							<li className='social-icons'>
								<a href='https://wa.link/cl2vzy' target='_blank' rel='noreferrer' className='icon-colour  home-social-icons'>
									<FaWhatsapp />
								</a>
							</li>
						</ul>
					</Col>
				</Row>
			</Container>
		</Container>
	);
}
export default Home2;
