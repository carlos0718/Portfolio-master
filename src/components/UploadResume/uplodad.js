import React, {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Container, Row, Col, Alert, Button} from "react-bootstrap";
import {uploadFile} from "../../aws-s3/awsS3";

const NAME_FILE = "resume_fullstack.pdf";

const PdfDropzone = () => {
	const [file, setFile] = useState(null);
	const [hasUpload, setHasUpload] = useState(false);

	const onDrop = useCallback((acceptedFiles) => {
		console.log("Archivos aceptados:", acceptedFiles);
		setFile(acceptedFiles[0]);
	}, []);

	const {getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept} = useDropzone({
		onDrop,
		// Asegura usar la sintaxis correcta para la versión de react-dropzone que tengas
		accept: {"application/pdf": []},
		multiple: false,
	});

	const handleUpload = async (file) => {
		try {
			await uploadFile(file, NAME_FILE);
			setHasUpload(true);
		} catch (error) {
			console.error("Error al subir archivo", error);
		}
	};

	return (
		<Container fluid className='upload-section'>
			<Container>
				{!hasUpload ? (
					file && (
						<Row style={{justifyContent: "center", padding: "10px"}}>
							<Col md={7}>
								<Alert variant='success'>Archivo seleccionado: {file.name}</Alert>
								{/* Aquí podrías agregar tu lógica para enviar el archivo al servidor */}
								<Button onClick={() => handleUpload(file)}>Subir archivo</Button>
							</Col>
						</Row>
					)
				) : (
					<Row style={{justifyContent: "center", padding: "10px"}}>
						<Col md={7}>
							<Alert variant='success'>Archivo subido correctamente</Alert>
						</Col>
					</Row>
				)}
				<Row style={{justifyContent: "center", padding: "10px"}}>
					<Col md={7}>
						<div
							{...getRootProps({className: "dropzone"})}
							style={{
								border: "2px dashed #aaa",
								borderRadius: "4px",
								padding: "40px",
								textAlign: "center",
								cursor: "pointer",
							}}
						>
							<input {...getInputProps()} />
							{isDragActive ? <p>Suelta tu archivo aquí...</p> : <p>Arrastra y suelta tu PDF aquí, o haz clic para seleccionarlo</p>}
							{isDragAccept && <p>Formato aceptado</p>}
							{isDragReject && <Alert variant='danger'>Formato no permitido. Solo se aceptan archivos PDF.</Alert>}
						</div>
					</Col>
				</Row>
			</Container>
		</Container>
	);
};

export default PdfDropzone;
