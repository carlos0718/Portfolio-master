import React from "react";
import Card from "react-bootstrap/Card";
import {ImPointRight} from "react-icons/im";

function AboutCard() {
	return (
		<Card className='quote-card-view'>
			<Card.Body>
				<blockquote className='blockquote mb-0'>
					<p style={{textAlign: "justify", lineHeight: "45px"}}>
						Hi Everyone, I am <span className='purple'>Carlos Jesús </span>
						from <span className='purple'> Buenos Aires, Argentina.</span>
						<br />I am a graduate in <span className='purple'>Programming and Systems Technology </span>
						from UTN FRGP Buenos Aires, Argentina.
						<br />
						<br />
						Apart from coding, some other activities that I love to do!
					</p>
					<ul style={{lineHeight: "45px"}}>
						<li className='about-activity'>
							<ImPointRight /> Playing Games
						</li>
						<li className='about-activity'>
							<ImPointRight /> Playing Futbol
						</li>
						<li className='about-activity'>
							<ImPointRight /> Travelling
						</li>
					</ul>

					<p style={{color: "rgb(155 126 172)", letterSpacing: "2px"}}>"Persist, insist until your dreams come true ✨" </p>
					<footer className='blockquote-footer' style={{letterSpacing: "2px"}}>
						Carlos Jesús
					</footer>
				</blockquote>
			</Card.Body>
		</Card>
	);
}

export default AboutCard;
