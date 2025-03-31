import React from "react";
import {Col, Row} from "react-bootstrap";
import {DiJavascript1, DiReact, DiNodejs, DiPython, DiGit} from "react-icons/di";
import {FaAws, FaDocker} from "react-icons/fa";
import {SiRedis, SiDotnet, SiFirebase, SiNextdotjs, SiCsharp, SiMicrosoftsqlserver} from "react-icons/si";

function Techstack() {
	return (
		<Row style={{justifyContent: "center", paddingBottom: "50px"}}>
			<Col xs={4} md={2} className='tech-icons'>
				<SiCsharp />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiDotnet />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<DiJavascript1 />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<DiReact />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiNextdotjs />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<DiNodejs />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<DiPython />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<DiGit />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiMicrosoftsqlserver />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiFirebase />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<FaAws />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<FaDocker />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiRedis />
			</Col>
		</Row>
	);
}

export default Techstack;
