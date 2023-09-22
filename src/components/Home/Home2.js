import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import myImg from "../../Assets/avatar.svg";

function Home2() {
	return (
		<Container fluid className='home-about-section' id='about'>
			<Container>
				<Row>
					<Col md={8} className='home-about-description'>
						<h1 style={{ fontSize: "2.6em" }}>
							LET ME <span className='purple'> INTRODUCE </span> MYSELF
						</h1>
						<p className='home-about-body'>
							I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️
							<br />
							<br />I am proficient in classic technologies like
							<i>
								<b className='purple'>
									{" "}
									C#, ASP.NET, .Net Core, Javascript, React Js, HTML 5, CSS 3, Api Context, Redux, NodeJs, Axios, Express, MSSQL
									SERVER, PostgreSQL, GIT HUB, GIT LAB, SourceTree{" "}
								</b>
							</i>
							<br />
							<br />
							My field of Interest's are building new &nbsp;
							<i>
								<b className='purple'>Data analysis with Python and Excel </b> and also in areas related to{" "}
								<b className='purple'>backend development with Node js and frameworks.</b>
							</i>
							<br />
							<br />
							Whenever possible, I also apply my passion for developing products with{" "}
							<b className='purple'>React js y .NET Core</b> and
							<i>
								<b className='purple'> Modern Javascript Library and Frameworks.</b>
							</i>
						</p>
					</Col>
					<Col md={4} className='myAvtar'>
						<Tilt>
							<img src={myImg} className='img-fluid' alt='avatar' />
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
								<a
									href='https://github.com/carlos0718'
									target='_blank'
									rel='noreferrer'
									className='icon-colour  home-social-icons'
								>
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
						</ul>
					</Col>
				</Row>
			</Container>
		</Container>
	);
}
export default Home2;
