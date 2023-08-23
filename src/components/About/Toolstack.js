import React from "react";
import { Col, Row } from "react-bootstrap";
import { GoMarkGithub, GoDatabase } from "react-icons/go";
import { RiGitlabFill } from "react-icons/ri";
import { SiVisualstudio, SiVisualstudiocode, SiPostman, SiHeroku, SiVercel } from "react-icons/si";

function Toolstack() {
  return (
		<Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
			<Col xs={4} md={2} className='tech-icons'>
				<SiVisualstudio />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiVisualstudiocode />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiPostman />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiVercel />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiHeroku />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<GoMarkGithub />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<RiGitlabFill />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<GoDatabase />
			</Col>
		</Row>
  );
}

export default Toolstack;
