import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {AiFillGithub} from "react-icons/ai";
import {FaLinkedinIn, FaWhatsappSquare} from "react-icons/fa";

function Footer() {
	let date = new Date();
	let year = date.getFullYear();
	return (
		<Container fluid className='footer'>
			<Row>
				<Col md='4' className='footer-copywright'>
					<h3>Carlos Alfredo Jesús Sipirán</h3>
				</Col>
				<Col md='4' className='footer-copywright'>
					<h3>C . J © {year}</h3>
				</Col>
				<Col md='4' className='footer-body'>
					<ul className='footer-icons'>
						<li className='social-icons'>
							<a href='https://github.com/carlos0718' style={{color: "white"}} target='_blank' rel='noopener noreferrer'>
								<AiFillGithub />
							</a>
						</li>
						<li className='social-icons'>
							<a
								href='https://www.linkedin.com/in/carlos-jesus-dev/'
								style={{color: "white"}}
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaLinkedinIn />
							</a>
						</li>
						<li className='social-icons'>
							<a href='https://wa.link/cl2vzy' target='_blank' rel='noreferrer' style={{color: "white"}}>
								<FaWhatsappSquare />
							</a>
						</li>
					</ul>
				</Col>
			</Row>
		</Container>
	);
}

export default Footer;
