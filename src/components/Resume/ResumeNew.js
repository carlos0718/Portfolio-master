import React from "react";
import {Container, Image, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/../Assets/Carlos-Jesus-CV.pdf";
import {AiOutlineDownload} from "react-icons/ai";

function ResumeNew() {
	return (
		<div>
			<Container fluid className='resume-section'>
				<Particle />
				<Row style={{justifyContent: "center", position: "relative"}}>
					<Button variant='primary' href={pdf} target='_blank' style={{maxWidth: "250px"}}>
						<AiOutlineDownload />
						&nbsp;Download CV
					</Button>
				</Row>

				<Row className='resume'>
					<Container className='imag-cv'>
						<Image src='./Carlos-Jesus-CV-en-2023.svg' fluid />
					</Container>
				</Row>

				<Row style={{justifyContent: "center", position: "relative"}}>
					<Button variant='primary' href={pdf} target='_blank' style={{maxWidth: "250px"}}>
						<AiOutlineDownload />
						&nbsp;Download CV
					</Button>
				</Row>
			</Container>
		</div>
	);
}

export default ResumeNew;
