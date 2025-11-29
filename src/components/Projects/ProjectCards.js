import React from 'react';
import {Badge, Button, Card} from 'react-bootstrap';
import {BsGithub} from 'react-icons/bs';
import {CgWebsite} from 'react-icons/cg';

function ProjectCard(props) {
	// Determinar si mostrar imagen o iframe
	const hasValidDemo = props.demoLink && props.demoLink !== props.ghLink && !props.demoLink.includes('github.com');

	// Función para obtener el color del badge según el tipo de proyecto
	const getBadgeVariant = (type) => {
		switch (type) {
			case 'frontend':
				return 'info';
			case 'backend':
				return 'success';
			case 'fullstack':
				return 'warning';
			default:
				return 'secondary';
		}
	};

	return (
		<Card className='project-card-view'>
			{hasValidDemo ? (
				<div className='preview-container' style={{position: 'relative', paddingTop: '56.25%'}}>
					<iframe
						src={props.demoLink}
						title={props.title}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							border: 'none',
							borderRadius: '8px 8px 0 0'
						}}
						loading='lazy'
					/>
				</div>
			) : (
				<Card.Img variant='top' src={props.imgPath} alt={props.title} style={{height: '250px', objectFit: 'cover'}} />
			)}
			<Card.Body>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
					<Card.Title style={{marginBottom: 0}}>{props.title}</Card.Title>
					{props.projectType && (
						<Badge bg={getBadgeVariant(props.projectType)} style={{textTransform: 'capitalize'}}>
							{props.projectType}
						</Badge>
					)}
				</div>
				<small style={{color: '#6c757d', display: 'block', marginBottom: '10px'}}>Creado el {props.createdAt}</small>
				<Card.Text style={{textAlign: 'justify'}}>{props.description}</Card.Text>
				{'\n'}
				{'\n'}
				{/* Mostrar los lenguajes si existen */}
				{props.languages && Object.keys(props.languages).length > 0 && (
					<div className='languages-container'>
						{Object.entries(props.languages).map(([language, bytes]) => (
							<span
								key={language}
								style={{
									color: 'white',
									fontWeight: 'bold',
									padding: '2px 8px',
									borderRadius: '12px',
									marginRight: '5px',
									fontSize: '0.8em'
								}}
							>
								{language}
							</span>
						))}
					</div>
				)}
				<Button variant='primary' href={props.ghLink} target='_blank'>
					<BsGithub /> &nbsp;
					{props.isBlog ? 'Blog' : 'GitHub'}
				</Button>
				{'\n'}
				{'\n'}

				{/* If the component contains Demo link and if it's not a Blog then, it will render the below component  */}
				{!props.isBlog && props.demoLink && props.demoLink !== props.ghLink && (
					<Button variant='primary' href={props.demoLink} target='_blank' style={{marginLeft: '10px'}}>
						<CgWebsite /> &nbsp;
						{'Demo'}
					</Button>
				)}
			</Card.Body>
		</Card>
	);
}

export default ProjectCard;
