import React, {useState, useRef, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {AiOutlineDownload} from 'react-icons/ai';
import {Link} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import confetti from 'canvas-confetti';

import {downloadFile, listFile} from '../aws-s3/awsS3';

function NavBar() {
	const [expand, updateExpanded] = useState(false);
	const [navColour, updateNavbar] = useState(false);
	const [cvFiles, setCvFiles] = useState([
		{label: 'Full Stack Developer Resume', fileName: 'carlos_jesus_resume_fs.pdf', key: 'carlos_jesus_resume_fs.pdf'},
		{label: 'Software Engineer Resume', fileName: 'Carlos_Jesus_Software_Engineer.pdf', key: 'Carlos_Jesus_Software_Engineer.pdf'},
		{label: 'Frontend Developer Resume', fileName: 'Carlos-Jesus-resume-frontend.pdf', key: 'Carlos-Jesus-resume-frontend.pdf'}
	]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	React.useEffect(() => {
		// Cargar archivos PDF desde S3
		if (process.env.REACT_APP_AWS_REGION) {
			loadCVFiles();
		}
	}, []);

	// Cerrar dropdown al hacer click fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const loadCVFiles = async () => {
		try {
			const files = await listFile();
			// Filtrar solo archivos PDF
			const pdfFiles = files.filter((file) => file.Key.toLowerCase().endsWith('.pdf'));

			// Convertir a formato para el dropdown
			const cvOptions = pdfFiles.map((file) => {
				const fileName = file.Key;
				// Extraer nombre legible del archivo
				const label = fileName
					.replace('.pdf', '')
					.replace(/-/g, ' ')
					.replace(/_/g, ' ')
					.split('/')
					.pop(); // Por si hay carpetas

				return {
					label: label,
					fileName: fileName,
					key: file.Key
				};
			});

			setCvFiles(cvOptions);
		} catch (error) {
			console.error('Error al cargar archivos desde S3', error);
			// Si falla, usar archivos locales por defecto
			setCvFiles([
				{label: 'Full Stack Developer Resume', fileName: 'carlos_jesus_resume_fs.pdf', key: 'carlos_jesus_resume_fs.pdf'},
				{label: 'Software Engineer Resume', fileName: 'Carlos_Jesus_Software_Engineer.pdf', key: 'Carlos_Jesus_Software_Engineer.pdf'},
				{label: 'Frontend Developer Resume', fileName: 'Carlos-Jesus-resume-frontend.pdf', key: 'Carlos-Jesus-resume-frontend.pdf'}
			]);
		}
	};

	function scrollHandler() {
		if (window.scrollY >= 20) {
			updateNavbar(true);
		} else {
			updateNavbar(false);
		}
	}

	window.addEventListener('scroll', scrollHandler);

	// Variantes de animación para el dropdown
	const dropdownVariants = {
		hidden: {
			opacity: 0,
			scale: 0.95,
			y: -10,
			transition: {
				duration: 0.2
			}
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				duration: 0.3,
				staggerChildren: 0.1,
				delayChildren: 0.1
			}
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			y: -10,
			transition: {
				duration: 0.2
			}
		}
	};

	const itemVariants = {
		hidden: {
			opacity: 0,
			x: -20
		},
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 24
			}
		}
	};

	const handleClickDownload = async (cvFile) => {
		try {
			setIsDropdownOpen(false);

			// Lanzar confetti con colores variados que cubre todo el viewport
			const duration = 3 * 1000;
			const animationEnd = Date.now() + duration;
			const defaults = {
				startVelocity: 30,
				spread: 360,
				ticks: 60,
				zIndex: 9999
			};

			function randomInRange(min, max) {
				return Math.random() * (max - min) + min;
			}

			const interval = setInterval(function () {
				const timeLeft = animationEnd - Date.now();

				if (timeLeft <= 0) {
					return clearInterval(interval);
				}

				const particleCount = 50 * (timeLeft / duration);

				// Desde la izquierda
				confetti({
					...defaults,
					particleCount,
					origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}
				});

				// Desde el centro
				confetti({
					...defaults,
					particleCount,
					origin: {x: randomInRange(0.4, 0.6), y: Math.random() - 0.2}
				});

				// Desde la derecha
				confetti({
					...defaults,
					particleCount,
					origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}
				});
			}, 250);

			// Si AWS está configurado, descargar desde S3
			if (process.env.REACT_APP_AWS_REGION && cvFile.key) {
				const blobUrl = await downloadFile(cvFile.key);
				const link = document.createElement('a');
				link.href = blobUrl;
				link.setAttribute('target', '_blank');
				link.setAttribute('rel', 'noopener noreferrer');
				link.download = cvFile.fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(blobUrl); // Limpiar URL
			} else {
				// Fallback: usar archivo local
				const link = document.createElement('a');
				link.href = `/${cvFile.fileName}`;
				link.setAttribute('target', '_blank');
				link.setAttribute('rel', 'noopener noreferrer');
				link.download = cvFile.fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		} catch (error) {
			console.error('Error descargando archivo:', error);
			// Fallback: intentar abrir el CV local
			window.open(`/${cvFile.fileName}`, '_blank');
		}
	};

	return (
		<Navbar expanded={expand} fixed='top' expand='md' className={navColour ? 'sticky' : 'navbar'}>
			<Container fluid className='navbar-container'>
				<Navbar.Brand as={Link} to='/' className='navbar-brand-custom'>
					<div className='brand-logo'>
						<div className='brand-icon'>CJ</div>
						<span className='brand-text'>carlos.dev</span>
					</div>
				</Navbar.Brand>
				<Navbar.Toggle
					aria-controls='responsive-navbar-nav'
					onClick={() => {
						updateExpanded(expand ? false : 'expanded');
					}}
				>
					<span></span>
					<span></span>
					<span></span>
				</Navbar.Toggle>
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='mx-auto navbar-nav-center' defaultActiveKey='#home'>
						<Nav.Item>
							<Nav.Link as={Link} to='/' onClick={() => updateExpanded(false)}>
								Home
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link as={Link} to='/project' onClick={() => updateExpanded(false)}>
								Projects
							</Nav.Link>
						</Nav.Item>

						{/* <Nav.Item>
							<Nav.Link as={Link} to='/about' onClick={() => updateExpanded(false)}>
								Sobre mí
							</Nav.Link>
						</Nav.Item>
 */}
						{/* <Nav.Item>
							<Nav.Link href='#contact' onClick={() => updateExpanded(false)}>
								Contacto
							</Nav.Link>
						</Nav.Item> */}
					</Nav>
					<div className='navbar-buttons'>
						<div className='cv-dropdown-container' ref={dropdownRef} style={{position: 'relative'}}>
							<motion.div
								whileHover={{
									y: [0, -8, 0],
									transition: {
										duration: 0.6,
										repeat: Infinity,
										repeatType: 'loop',
										ease: 'easeInOut'
									}
								}}
								whileTap={{scale: 0.95}}
							>
								<Button
									variant='outline-light'
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className='btn-download-cv'
									style={{position: 'relative'}}
								>
									<AiOutlineDownload style={{marginRight: '8px'}} />
									Download CV
								</Button>
							</motion.div>

							<AnimatePresence>
								{isDropdownOpen && (
									<motion.div
										className='cv-dropdown-menu'
										variants={dropdownVariants}
										initial='hidden'
										animate='visible'
										exit='exit'
										style={{
											position: 'absolute',
											top: 'calc(100% + 8px)',
											left: 0,
											background: 'rgba(20, 20, 30, 0.95)',
											backdropFilter: 'blur(10px)',
											border: '1px solid rgba(168, 85, 247, 0.3)',
											borderRadius: '12px',
											padding: '8px',
											minWidth: '200px',
											zIndex: 1000,
											boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2)'
										}}
									>
										{cvFiles.map((cvFile, index) => (
											<motion.button
												key={index}
												variants={itemVariants}
												onClick={() => handleClickDownload(cvFile)}
												className='cv-dropdown-item'
												whileHover={{
													x: 4,
													backgroundColor: 'rgba(168, 85, 247, 0.1)',
													transition: {duration: 0.2}
												}}
												style={{
													width: '100%',
													padding: '12px 16px',
													background: 'transparent',
													border: 'none',
													color: '#fff',
													textAlign: 'left',
													cursor: 'pointer',
													borderRadius: '8px',
													fontSize: '14px',
													fontWeight: '500',
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
													transition: 'all 0.2s ease'
												}}
											>
												<AiOutlineDownload size={16} style={{color: '#a855f7'}} />
												{cvFile.label}
											</motion.button>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<Button href='https://wa.me/+5491167896758' target='_blank' className='btn-contact-me'>
							Contact Me
						</Button>
					</div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavBar;
