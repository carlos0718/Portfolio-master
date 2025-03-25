import React, {useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import {CgGitFork} from "react-icons/cg";
import pdf from "../Assets/../Assets/Carlos-Jesus-CV.pdf";
import {AiFillStar, AiOutlineHome, AiOutlineUser, AiOutlineDownload} from "react-icons/ai";

function NavBar() {
	const [expand, updateExpanded] = useState(false);
	const [navColour, updateNavbar] = useState(false);

	function scrollHandler() {
		if (window.scrollY >= 20) {
			updateNavbar(true);
		} else {
			updateNavbar(false);
		}
	}

	window.addEventListener("scroll", scrollHandler);

	return (
		<Navbar expanded={expand} fixed='top' expand='md' className={navColour ? "sticky" : "navbar"}>
			<Container>
				<Navbar.Toggle
					aria-controls='responsive-navbar-nav'
					onClick={() => {
						updateExpanded(expand ? false : "expanded");
					}}
				>
					<span></span>
					<span></span>
					<span></span>
				</Navbar.Toggle>
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='ms-auto' defaultActiveKey='#home'>
						<Nav.Item>
							<Nav.Link as={Link} to='/' onClick={() => updateExpanded(false)}>
								<AiOutlineHome style={{marginBottom: "2px"}} /> Home
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link as={Link} to='/about' onClick={() => updateExpanded(false)}>
								<AiOutlineUser style={{marginBottom: "2px"}} /> About
							</Nav.Link>
						</Nav.Item>

						{/* 	<Nav.Item>
							<Nav.Link as={Link} to='/project' onClick={() => updateExpanded(false)}>
								<AiOutlineFundProjectionScreen style={{marginBottom: "2px"}} /> Projects
							</Nav.Link>
						</Nav.Item> */}

						<Nav.Item className='fork-btn'>
							<Button variant='primary' href={pdf} target='_blank' className='fork-btn-inner'>
								<AiOutlineDownload />
								Resume
							</Button>
						</Nav.Item>
						<Nav.Item className='fork-btn'>
							<Button
								href='https://github.com/carlos0718?tab=repositories&q=&type=&language=javascript'
								target='_blank'
								className='fork-btn-inner'
							>
								<CgGitFork style={{fontSize: "1.2em"}} /> <AiFillStar style={{fontSize: "1.1em"}} />
							</Button>
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavBar;
