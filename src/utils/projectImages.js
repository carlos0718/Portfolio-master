// Importar todas las imágenes disponibles

import blog from '../Assets/Projects/blog.png';
import chatify from '../Assets/Projects/chatify.png';
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
 * Clasificación de lenguajes por tipo
 */
const FRONTEND_LANGUAGES = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'SASS', 'Less', 'Vue', 'Svelte'];
const BACKEND_LANGUAGES = ['Python', 'Java', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'Kotlin', 'Swift', 'C++', 'C', 'Dart'];

/**
 * Calcula los porcentajes de frontend y backend de un proyecto
 * @param {object} languages - Objeto con los lenguajes del proyecto
 * @returns {object} - {frontendPercentage, backendPercentage, totalBytes}
 */
const calculateLanguagePercentages = (languages = {}) => {
	const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

	if (totalBytes === 0) return {frontendPercentage: 0, backendPercentage: 0, totalBytes: 0};

	const frontendBytes = Object.entries(languages)
		.filter(([lang]) => FRONTEND_LANGUAGES.includes(lang))
		.reduce((sum, [, bytes]) => sum + bytes, 0);

	const backendBytes = Object.entries(languages)
		.filter(([lang]) => BACKEND_LANGUAGES.includes(lang))
		.reduce((sum, [, bytes]) => sum + bytes, 0);

	return {
		frontendPercentage: (frontendBytes / totalBytes) * 100,
		backendPercentage: (backendBytes / totalBytes) * 100,
		totalBytes
	};
};

/**
 * Determina si un proyecto es frontend basándose en sus lenguajes
 * @param {object} languages - Objeto con los lenguajes del proyecto
 * @returns {boolean} - true si es un proyecto frontend
 */
export const isFrontendProject = (languages = {}) => {
	const {backendPercentage} = calculateLanguagePercentages(languages);
	const languagesList = Object.keys(languages);

	// Verificar si tiene lenguajes frontend
	const hasFrontendLanguages = languagesList.some((lang) => FRONTEND_LANGUAGES.includes(lang));

	// Es frontend si tiene lenguajes frontend y el backend no supera el 30%
	return hasFrontendLanguages && backendPercentage < 30;
};

/**
 * Determina si un proyecto es backend basándose en sus lenguajes
 * @param {object} languages - Objeto con los lenguajes del proyecto
 * @returns {boolean} - true si es un proyecto backend
 */
export const isBackendProject = (languages = {}) => {
	const {backendPercentage} = calculateLanguagePercentages(languages);
	const languagesList = Object.keys(languages);

	// Verificar si tiene lenguajes backend
	const hasBackendLanguages = languagesList.some((lang) => BACKEND_LANGUAGES.includes(lang));

	// Es backend si tiene lenguajes backend predominantes
	return hasBackendLanguages && backendPercentage > 50;
};

/**
 * Determina si un proyecto es fullstack basándose en sus lenguajes
 * @param {object} languages - Objeto con los lenguajes del proyecto
 * @returns {boolean} - true si es un proyecto fullstack
 */
export const isFullstackProject = (languages = {}) => {
	const {frontendPercentage, backendPercentage} = calculateLanguagePercentages(languages);
	const languagesList = Object.keys(languages);

	// Verificar si tiene tanto frontend como backend
	const hasFrontendLanguages = languagesList.some((lang) => FRONTEND_LANGUAGES.includes(lang));
	const hasBackendLanguages = languagesList.some((lang) => BACKEND_LANGUAGES.includes(lang));

	// Es fullstack si tiene ambos tipos de lenguajes y ambos superan el 20%
	return hasFrontendLanguages && hasBackendLanguages && frontendPercentage >= 20 && backendPercentage >= 20;
};

/**
 * Obtiene el tipo de proyecto (frontend, backend, fullstack)
 * @param {object} languages - Objeto con los lenguajes del proyecto
 * @returns {string} - 'fullstack', 'frontend', 'backend', o 'other'
 */
export const getProjectType = (languages = {}) => {
	if (isFullstackProject(languages)) return 'fullstack';
	if (isFrontendProject(languages)) return 'frontend';
	if (isBackendProject(languages)) return 'backend';
	return 'other';
};

/**
 * Filtra proyectos por tipo
 * @param {Array} projects - Array de proyectos
 * @param {string} type - 'frontend', 'backend', 'fullstack', o 'all'
 * @returns {Array} - Proyectos filtrados
 */
export const filterProjectsByType = (projects, type = 'all') => {
	if (type === 'all') return projects;

	return projects.filter((project) => {
		const projectType = getProjectType(project.languages);
		return projectType === type;
	});
};

const projectUtils = {
	getProjectImage,
	isFrontendProject,
	isBackendProject,
	isFullstackProject,
	getProjectType,
	filterProjectsByType
};
export default projectUtils;
