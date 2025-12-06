import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {RiGitlabFill} from 'react-icons/ri';
import {SiGithub, SiJira, SiVisualstudio, SiVisualstudiocode, SiPostman, SiHeroku, SiVercel, SiFigma} from 'react-icons/si';

function Toolstack() {
	return (
		<Row style={{justifyContent: 'center', paddingBottom: '50px'}}>
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
				<SiGithub />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<RiGitlabFill />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiJira />
			</Col>
			<Col xs={4} md={2} className='tech-icons'>
				<SiFigma />
			</Col>
		</Row>
	);
}

export default Toolstack;
