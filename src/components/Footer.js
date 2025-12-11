import React from 'react';
import {Container} from 'react-bootstrap';
import {FaGithub, FaLinkedinIn, FaWhatsapp, FaHeart} from 'react-icons/fa';
import {motion} from 'framer-motion';

function Footer() {
	let date = new Date();
	let year = date.getFullYear();

	return (
		<footer className='footer'>
			<Container>
				<div className='footer-content'>
					{/* Left Section - Name */}
					<div className='footer-brand'>
						<h3 className='footer-name'>Carlos Jesús</h3>
						<p className='footer-subtitle'>Full Stack Developer</p>
					</div>

					{/* Center Section - Copyright */}
					<div className='footer-copyright'>
						<p className='footer-year'>© {year} Carlos Jesús. Todos los derechos reservados.</p>
					</div>

					{/* Right Section - Social Links */}
					<div className='footer-social'>
						<p className='footer-social-label'>Conecta conmigo</p>
						<div className='footer-social-links'>
							<motion.a
								href='https://github.com/carlos0718'
								target='_blank'
								rel='noopener noreferrer'
								className='footer-social-link'
								whileHover={{
									y: -3,
									rotate: 5
								}}
								transition={{type: 'spring', stiffness: 400}}
								aria-label='GitHub'
							>
								<FaGithub />
							</motion.a>
							<motion.a
								href='https://www.linkedin.com/in/carlos-jesus-dev/'
								target='_blank'
								rel='noopener noreferrer'
								className='footer-social-link'
								whileHover={{
									y: -3,
									rotate: 5
								}}
								transition={{type: 'spring', stiffness: 400}}
								aria-label='LinkedIn'
							>
								<FaLinkedinIn />
							</motion.a>
							<motion.a
								href='https://wa.link/cl2vzy'
								target='_blank'
								rel='noopener noreferrer'
								className='footer-social-link footer-social-link-whatsapp'
								whileHover={{
									y: -3,
									rotate: 5
								}}
								transition={{type: 'spring', stiffness: 400}}
								aria-label='WhatsApp'
							>
								<FaWhatsapp />
							</motion.a>
						</div>
					</div>
				</div>
			</Container>
		</footer>
	);
}

export default Footer;
