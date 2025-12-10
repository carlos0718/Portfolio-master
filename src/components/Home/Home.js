import React, {useEffect, useState} from 'react';
import {Container, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {FaGithub, FaLinkedinIn, FaWhatsapp, FaArrowRight} from 'react-icons/fa';
import {
	SiReact,
	SiNodedotjs,
	SiDotnet,
	SiTypescript,
	SiNextdotjs,
	SiPostgresql,
	SiDocker,
	SiAmazonaws,
	SiVisualstudiocode,
	SiVisualstudio,
	SiOpenai
} from 'react-icons/si';
import {BsRobot} from 'react-icons/bs';
import {AiFillStar} from 'react-icons/ai';
import {VscGithubInverted} from 'react-icons/vsc';
import {motion} from 'framer-motion';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, FreeMode} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import Particle from '../Particle';
import Type from './Type';
import Github from '../About/Github';
import {fetchGitHubProfile, fetchGitHubRepoCount} from '../../config/github';

// Counter Animation Component - Loops infinitely with pause
function AnimatedCounter({value, duration = 2, pauseDuration = 5}) {
	const [displayValue, setDisplayValue] = useState(0);
	const nodeRef = React.useRef(null);

	useEffect(() => {
		if (value === 0) return;

		let animationFrame = null;
		let startTime = null;
		const totalCycleDuration = (duration + pauseDuration) * 1000;

		const step = (timestamp) => {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const cyclePosition = elapsed % totalCycleDuration;

			// If we're in the animation phase (not paused)
			if (cyclePosition < duration * 1000) {
				const progress = cyclePosition / (duration * 1000);

				// Easing function for smooth animation
				const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

				const currentValue = Math.round(easedProgress * value);
				setDisplayValue(currentValue);
			} else {
				// Pause phase - keep the final value
				setDisplayValue(value);
			}

			animationFrame = requestAnimationFrame(step);
		};

		animationFrame = requestAnimationFrame(step);

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	}, [value, duration, pauseDuration]);

	return <span ref={nodeRef}>{displayValue}</span>;
}

function Home() {
	const [profileImage, setProfileImage] = useState(null);
	const [repoCount, setRepoCount] = useState(0);

	useEffect(() => {
		const getProfileData = async () => {
			const imageUrl = await fetchGitHubProfile();
			const totalRepos = await fetchGitHubRepoCount();
			setProfileImage(imageUrl);
			setRepoCount(totalRepos || 20);
		};
		getProfileData();
	}, []);

	// Tech stack data with correct icons per Figma design
	const techStack = [
		{icon: SiReact, name: 'React', color: '#61DAFB'},
		{icon: SiNodedotjs, name: 'Node.js', color: '#339933'},
		{icon: SiNextdotjs, name: 'Next.js', color: '#FFFFFF'},
		{icon: SiDotnet, name: '.NET Core', color: '#512BD4'},
		{icon: SiTypescript, name: 'TypeScript', color: '#3178C6'},
		{icon: SiPostgresql, name: 'PostgreSQL', color: '#4169E1'},
		{icon: SiDocker, name: 'Docker', color: '#2496ED'},
		{icon: SiAmazonaws, name: 'AWS', color: '#FF9900'}
	];

	// AI/Dev Tools stack data
	const aiDevTools = [
		{icon: BsRobot, name: 'Claude Code', color: '#D97757'},
		{icon: SiVisualstudiocode, name: 'VS Code', color: '#007ACC'},
		{icon: VscGithubInverted, name: 'Copilot', color: '#ffffff'},
		{icon: SiOpenai, name: 'ChatGPT', color: '#10A37F'},
		{icon: AiFillStar, name: 'Gemini', color: '#8E75FF'},
		{icon: SiVisualstudio, name: 'Visual Studio', color: '#5C2D91'}
	];

	const date = new Date().getFullYear();
	const yearsOfExperience = date - 2020;
	return (
		<section>
			<Container fluid className='hero-section' id='home'>
				<Particle />
				<div className='gradient-blur gradient-blur-cyan'></div>
				<div className='gradient-blur gradient-blur-purple'></div>

				<Container className='hero-content'>
					<div className='hero-main-row'>
						{/* Left Section - Hero Content */}
						<div className='hero-text-section'>
							<div className='available-badge'>
								<span className='status-dot'></span>
								<span className='badge-text'>AVAILABLE FOR PROJECTS</span>
							</div>

							<div className='hero-title'>
								<h1 className='name-line-1'>CARLOS</h1>
								<h1 className='name-line-2'>JESÚS</h1>
							</div>

							<div className='hero-subtitle'>
								<h2>Full Stack Developer & AI Engineer</h2>
								<div className='hero-description'>
									<br />
									<Type />
								</div>
							</div>

							<div className='hero-buttons'>
								{/* Ver Proyectos Button with Framer Motion */}
								<motion.div
									whileHover={{
										scale: 1.05,
										boxShadow: '0 20px 40px rgba(168,85,247,0.5)'
									}}
									whileTap={{scale: 0.98}}
									transition={{duration: 0.2}}
								>
									<Link to='/project' style={{textDecoration: 'none'}}>
										<Button className='btn-ver-proyectos'>
											View Projects
											<FaArrowRight className='arrow-icon' />
										</Button>
									</Link>
								</motion.div>

								{/* GitHub Button with Framer Motion */}
								<motion.div
									whileHover={{
										scale: 1.02
									}}
									transition={{duration: 0.2}}
								>
									<Button className='btn-github' href='https://github.com/carlos0718' target='_blank'>
										<FaGithub className='github-icon' />
										GitHub
									</Button>
								</motion.div>
							</div>
						</div>

						{/* Right Section - Profile Card */}
						<div className='hero-profile-section'>
							<div className='profile-card'>
								<div className='profile-avatar'>
									{profileImage ? (
										<img src={profileImage} alt='Carlos Jesús' className='avatar-image' />
									) : (
										<div className='avatar-inner'>
											<span className='avatar-text'>CJ</span>
										</div>
									)}
								</div>
								<div className='profile-info'>
									<h3>Carlos Jesús</h3>
									<p>Buenos Aires, Argentina 🇦🇷</p>
								</div>
								<div className='social-links'>
									{/* Social Icons with Framer Motion */}
									<motion.a
										href='https://github.com/carlos0718'
										target='_blank'
										rel='noreferrer'
										className='social-link'
										whileHover={{
											y: -3,
											rotate: 5
										}}
										transition={{type: 'spring', stiffness: 400}}
									>
										<FaGithub />
									</motion.a>
									<motion.a
										href='https://www.linkedin.com/in/carlos0718'
										target='_blank'
										rel='noreferrer'
										className='social-link'
										whileHover={{
											y: -3,
											rotate: 5
										}}
										transition={{type: 'spring', stiffness: 400}}
									>
										<FaLinkedinIn />
									</motion.a>
									<motion.a
										href='https://wa.me/+5491167896758'
										target='_blank'
										rel='noreferrer'
										className='social-link social-link-whatsapp'
										whileHover={{
											y: -3,
											rotate: 5
										}}
										transition={{type: 'spring', stiffness: 400}}
									>
										<FaWhatsapp />
									</motion.a>
								</div>
							</div>

							<div className='stats-cards'>
								<div className='stat-card'>
									<h3>
										+<AnimatedCounter value={yearsOfExperience} duration={2} pauseDuration={3} />
									</h3>
									<p>Years Exp.</p>
								</div>
								<div className='stat-card stat-card-projects'>
									<h3>
										+<AnimatedCounter value={repoCount} duration={6} pauseDuration={3} />
									</h3>
									<p>Projects</p>
								</div>
							</div>
						</div>
					</div>

					{/* Tech Stack Section with Swiper */}
					<div className='tech-stack-section'>
						<div className='tech-stack-header'>
							{/* <p className='tech-stack-label'>STACK PRINCIPAL</p> */}
							<div className='swiper-indicator'>
								<span className='indicator-dot'></span>
								<span className='indicator-text'>STACK PRINCIPAL</span>
							</div>
						</div>

						<div className='tech-stack-swiper-container'>
							<Swiper
								modules={[Autoplay, FreeMode]}
								slidesPerView='auto'
								spaceBetween={16}
								loop={true}
								autoplay={{
									delay: 0,
									disableOnInteraction: false
								}}
								speed={5000}
								freeMode={true}
								grabCursor={true}
								className='tech-stack-swiper'
							>
								{techStack.map((tech, index) => (
									<SwiperSlide key={index} className='tech-swiper-slide'>
										<motion.div
											className='tech-item'
											whileHover={{
												y: -4,
												scale: 1.05,
												boxShadow: '0 8px 24px rgba(168,85,247,0.15)'
											}}
											transition={{
												type: 'spring',
												stiffness: 300,
												damping: 20
											}}
											style={{
												transformStyle: 'preserve-3d'
											}}
										>
											<motion.div
												whileHover={{
													rotateY: 360,
													z: 50,
													scale: 1.2
												}}
												transition={{
													rotateY: {duration: 0.6, ease: 'easeInOut'},
													z: {duration: 0.3},
													scale: {duration: 0.3}
												}}
												style={{
													display: 'inline-block',
													transformStyle: 'preserve-3d'
												}}
											>
												<tech.icon className='tech-icon' style={{color: tech.color}} />
											</motion.div>
											<span>{tech.name}</span>
										</motion.div>
									</SwiperSlide>
								))}
								{/* Duplicate slides for seamless loop */}
								{techStack.map((tech, index) => (
									<SwiperSlide key={`dup-${index}`} className='tech-swiper-slide'>
										<motion.div
											className='tech-item'
											whileHover={{
												y: -4,
												scale: 1.05,
												boxShadow: '0 8px 24px rgba(168,85,247,0.15)'
											}}
											transition={{
												type: 'spring',
												stiffness: 300,
												damping: 20
											}}
											style={{
												transformStyle: 'preserve-3d'
											}}
										>
											<motion.div
												whileHover={{
													rotateY: 360,
													z: 50,
													scale: 1.2
												}}
												transition={{
													rotateY: {duration: 0.6, ease: 'easeInOut'},
													z: {duration: 0.3},
													scale: {duration: 0.3}
												}}
												style={{
													display: 'inline-block',
													transformStyle: 'preserve-3d'
												}}
											>
												<tech.icon className='tech-icon' style={{color: tech.color}} />
											</motion.div>
											<span>{tech.name}</span>
										</motion.div>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>

					{/* AI/Dev Tools Section with Swiper */}
					<div className='tech-stack-section' style={{marginTop: '40px'}}>
						<div className='tech-stack-header'>
							<div className='swiper-indicator'>
								<span className='indicator-dot'></span>
								<span className='indicator-text'>HERRAMIENTAS IA & DEV</span>
							</div>
						</div>

						<div className='tech-stack-swiper-container'>
							<Swiper
								modules={[Autoplay, FreeMode]}
								slidesPerView='auto'
								spaceBetween={16}
								loop={true}
								autoplay={{
									delay: 0,
									disableOnInteraction: false
								}}
								speed={4500}
								freeMode={true}
								grabCursor={true}
								className='tech-stack-swiper'
								dir='rtl'
							>
								{aiDevTools.map((tool, index) => (
									<SwiperSlide key={index} className='tech-swiper-slide'>
										<motion.div
											className='tech-item'
											whileHover={{
												y: -4,
												scale: 1.05,
												boxShadow: '0 8px 24px rgba(168,85,247,0.15)'
											}}
											transition={{
												type: 'spring',
												stiffness: 300,
												damping: 20
											}}
											style={{
												transformStyle: 'preserve-3d'
											}}
										>
											<motion.div
												whileHover={{
													rotateY: 360,
													z: 50,
													scale: 1.2
												}}
												transition={{
													rotateY: {duration: 0.6, ease: 'easeInOut'},
													z: {duration: 0.3},
													scale: {duration: 0.3}
												}}
												style={{
													display: 'inline-block',
													transformStyle: 'preserve-3d'
												}}
											>
												<tool.icon className='tech-icon' style={{color: tool.color}} />
											</motion.div>
											<span>{tool.name}</span>
										</motion.div>
									</SwiperSlide>
								))}
								{/* Duplicate slides for seamless loop */}
								{aiDevTools.map((tool, index) => (
									<SwiperSlide key={`dup-${index}`} className='tech-swiper-slide'>
										<motion.div
											className='tech-item'
											whileHover={{
												y: -4,
												scale: 1.05,
												boxShadow: '0 8px 24px rgba(168,85,247,0.15)'
											}}
											transition={{
												type: 'spring',
												stiffness: 300,
												damping: 20
											}}
											style={{
												transformStyle: 'preserve-3d'
											}}
										>
											<motion.div
												whileHover={{
													rotateY: 360,
													z: 50,
													scale: 1.2
												}}
												transition={{
													rotateY: {duration: 0.6, ease: 'easeInOut'},
													z: {duration: 0.3},
													scale: {duration: 0.3}
												}}
												style={{
													display: 'inline-block',
													transformStyle: 'preserve-3d'
												}}
											>
												<tool.icon className='tech-icon' style={{color: tool.color}} />
											</motion.div>
											<span>{tool.name}</span>
										</motion.div>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>
				</Container>

				<Github />
			</Container>
		</section>
	);
}

export default Home;
