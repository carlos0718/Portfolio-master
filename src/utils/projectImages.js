// Importar todas las imágenes disponibles
import chatify from '../Assets/Projects/chatify.png';
import blog from '../Assets/Projects/blog.png';
import codeEditor from '../Assets/Projects/codeEditor.png';
import emotion from '../Assets/Projects/emotion.png';
import leaf from '../Assets/Projects/leaf.png';
import suicide from '../Assets/Projects/suicide.png';

// Mapa de imágenes por nombre de proyecto o palabras clave
const projectImagesMap = {
	// E-commerce
	'nucba-e-commerce-js-html-css': blog,
	ecommerce: blog,
	store: blog,
	shop: blog,
	tienda: blog,

	// Frontend projects
	'propuesta-ignovatech': codeEditor,
	frontend: codeEditor,
	react: codeEditor,
	angular: codeEditor,
	vue: codeEditor,

	// Sistema Alarma Médica
	sistemaalarmamédica: emotion,
	'sistema-alarma-medica': emotion,
	medica: emotion,
	medical: emotion,
	health: emotion,
	salud: emotion,

	// Sistema Móvil
	sistemamovil: leaf,
	mobile: leaf,
	movil: leaf,
	app: leaf,

	// Sistema Web
	sistemamedicoweb: suicide,
	web: suicide,
	website: suicide,

	// Default
	default: chatify
};

/**
 * Obtiene la imagen apropiada para un proyecto basándose en su nombre y lenguajes
 * @param {string} projectName - Nombre del proyecto
 * @param {object} languages - Objeto con los lenguajes del proyecto
 * @returns {string} - Ruta de la imagen a usar
 */
export const getProjectImage = (projectName, languages = {}) => {
	// Normalizar el nombre del proyecto
	const normalizedName = projectName.toLowerCase().replace(/[_\s-]/g, '');

	// Buscar coincidencia exacta con el nombre del proyecto
	for (const [key, image] of Object.entries(projectImagesMap)) {
		const normalizedKey = key.toLowerCase().replace(/[_\s-]/g, '');
		if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
			return image;
		}
	}

	// Buscar por palabras clave en el nombre
	const projectNameLower = projectName.toLowerCase();
	if (projectNameLower.includes('ecommerce') || projectNameLower.includes('store') || projectNameLower.includes('shop')) {
		return projectImagesMap.ecommerce;
	}
	if (projectNameLower.includes('medic') || projectNameLower.includes('health') || projectNameLower.includes('salud')) {
		return projectImagesMap.medica;
	}
	if (projectNameLower.includes('mobile') || projectNameLower.includes('movil') || projectNameLower.includes('app')) {
		return projectImagesMap.mobile;
	}

	// Buscar por lenguajes predominantes
	const languagesList = Object.keys(languages);
	if (languagesList.includes('JavaScript') || languagesList.includes('TypeScript')) {
		return codeEditor;
	}
	if (languagesList.includes('HTML') || languagesList.includes('CSS')) {
		return blog;
	}

	// Retornar imagen por defecto
	return projectImagesMap.default;
};

/**
 * Determina si un proyecto es frontend basándose en sus lenguajes
 * @param {object} languages - Objeto con los lenguajes del proyecto
 * @returns {boolean} - true si es un proyecto frontend
 */
export const isFrontendProject = (languages = {}) => {
	const frontendLanguages = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Vue', 'React'];
	const languagesList = Object.keys(languages);

	// Verificar si tiene lenguajes frontend
	const hasFrontendLanguages = languagesList.some((lang) => frontendLanguages.includes(lang));

	// Verificar que no sea principalmente backend
	const backendLanguages = ['Python', 'Java', 'C#', 'Ruby', 'PHP', 'Go', 'Rust'];
	const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
	const backendBytes = Object.entries(languages)
		.filter(([lang]) => backendLanguages.includes(lang))
		.reduce((sum, [, bytes]) => sum + bytes, 0);

	const backendPercentage = totalBytes > 0 ? (backendBytes / totalBytes) * 100 : 0;

	// Es frontend si tiene lenguajes frontend y el backend no es más del 50%
	return hasFrontendLanguages && backendPercentage < 50;
};

const projectUtils = {getProjectImage, isFrontendProject};
export default projectUtils;
