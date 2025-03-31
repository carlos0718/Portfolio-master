import {GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;

const s3Client = new S3Client({
	region: REGION,
	credentials: {
		accessKeyId: ACCESS_KEY,
		secretAccessKey: SECRET_KEY,
	},
});

/**
 * Lista objetos del bucket
 * @return {Promise<Array>} Lista de objetos encontrados
 */
export async function listFile() {
	try {
		const command = new ListObjectsV2Command({
			Bucket: BUCKET_NAME,
		});

		const response = await s3Client.send(command);
		return response.Contents || [];
	} catch (error) {
		console.error("Error al listar objetos", error);
		throw error;
	}
}

/**
 * Descarga un archivo del bucket
 * @param {String} filename Nombre del archivo
 * @return {string>} URL de descarga
 */

export async function downloadFile(filename) {
	try {
		const params = {
			Bucket: BUCKET_NAME,
			Key: filename,
		};

		const command = new GetObjectCommand(params);
		const response = await s3Client.send(command);

		const bodyBytes = await response.Body.transformToByteArray();
		const body = new Uint8Array(bodyBytes).buffer;
		const blob = new Blob([body], {type: "application/pdf"});
		const blobUrl = URL.createObjectURL(blob);
		return blobUrl;
	} catch (error) {
		console.error("Error al descargar archivo", error);
		throw error;
	}
}

/**
 * Descarga (lee) un archivo de S3 y retorna un Blob URL para mostrarlo.
 * @param {File} file archivo a subir
 * @param {string} filename nombre con el que se guardará el archivo
 * @return {Promise} Respuesta de la subida
 */
export async function uploadFile(file, filename) {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = new Uint8Array(arrayBuffer);
		const params = {
			Bucket: BUCKET_NAME,
			Key: filename,
			Body: buffer,
		};
		const command = new PutObjectCommand(params);
		const response = await s3Client.send(command);
		console.log("Archivo subido", response);
		return response;
	} catch (error) {
		console.error("Error al subir archivo", error);
		throw error;
	}
}
