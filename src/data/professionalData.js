export const professionalData = {
	personal: {
		name: 'Carlos Jesús',
		age: new Date().getFullYear() - 1990, // Dynamic calculation
		location: 'Buenos Aires, Argentina',
		title: 'Full Stack Developer & AI Engineer',
		yearsOfExperience: new Date().getFullYear() - 2020, // Dynamic calculation
		linkedin: 'https://www.linkedin.com/in/carlos-jesus-dev/',
		github: 'https://github.com/carlos0718',
		whatsapp: '+5491162677682',
		email: 'cajs0718@gmail.com'
	},

	education: {
		degree: 'University Technical Degree in Programming',
		institution: 'UTN-FRGP Buenos Aires, Argentina',
		status: 'Graduate',
		period: 'March 2019 - December 2023'
	},

	experience: [
		{
			company: 'ISTEA Ed IT',
			role: 'Software Development Mentor',
			period: 'May 2024 - Present',
			location: 'Buenos Aires, Argentina',
			description:
				'Teaching and mentoring 25+ students in HTML, CSS, JavaScript, and Bootstrap. Promoting AI coding assistants adoption and web accessibility best practices.',
			technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Lighthouse', 'AI Tools'],
			achievements: [
				'Achieved average project score of 90% with positive student reviews',
				'Elevated accessibility compliance scores by 85% (WCAG 2.1 AA standards)',
				'Enhanced student productivity through AI tools adoption'
			]
		},
		{
			company: 'Globons - The Digital Innovation Company',
			role: 'Full Stack Developer',
			period: 'March 2024 - Present',
			location: 'Buenos Aires, Argentina',
			project: 'PSA Project',
			description:
				'Implementing product grids and location-based features using JavaScript, jQuery, Bootstrap, and Google Maps API. Working with .NET Core 8, Blazor, and SQL Server.',
			technologies: ['.NET Core 8', 'Blazor', 'JavaScript', 'jQuery', 'Bootstrap', 'SQL Server', 'Docker', 'GitLab'],
			achievements: [
				'Optimized app performance by 30%',
				'Increased user engagement with local businesses by 40%',
				'Accelerated delivery by 40% with improved testing workflow',
				'Reduced feature delivery time by 25% using AI-driven tools'
			]
		},
		{
			company: 'Globons - The Digital Innovation Company',
			role: 'Full Stack Developer',
			period: 'January 2022 - February 2024',
			location: 'Buenos Aires, Argentina',
			project: 'Javit Project',
			description:
				'Developed PDF invoice consolidation API and interactive invoice listing tool. Implemented microservices architecture with .NET Core and Node.js.',
			technologies: ['.NET Core 4', 'Node.js', 'React', 'MUI', 'SQL Server', 'Docker', 'Formik', 'Yup'],
			achievements: [
				'Reduced audit time by 50%',
				'Improved invoice processing workflow by 25% company-wide',
				'Achieved 99.9% system uptime for financial operations'
			]
		},
		{
			company: 'Marfrig Food',
			role: 'Full Stack Developer',
			period: 'May 2023 - October 2023',
			location: 'Buenos Aires, Argentina',
			description: 'Engineered full-stack CMS for beef product lifecycle tracking with RESTful APIs and responsive UIs.',
			technologies: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Redux', 'React Bootstrap'],
			achievements: [
				'Slashed supply chain bottlenecks by 25%',
				'Reduced inventory discrepancies by 30%',
				'Enhanced data retrieval speed by 25%'
			]
		},
		{
			company: 'Rockstar Solutions',
			role: 'Full Stack Developer',
			period: 'May 2021 - December 2021',
			location: 'Buenos Aires, Argentina',
			description: 'Developed CMS modules using Angular 11 and .NET Core with SQL Server database design.',
			technologies: ['Angular 11', 'Angular Material', 'TypeScript', '.NET Core', 'SQL Server'],
			achievements: ['Improved user experience by 20% with reactive forms', 'Reduced integration errors by 40%']
		},
		{
			company: 'Bief',
			role: 'Frontend Developer',
			period: 'December 2020 - July 2021',
			location: 'Buenos Aires, Argentina',
			description: 'Built and maintained admin panel for apparel e-commerce platform with React and Next.js.',
			technologies: ['React', 'Next.js', 'Storybook', 'Sass', 'Material UI', 'ESLint'],
			achievements: [
				'Reduced loading times by 25%',
				'Lowered bug rates by 40% applying design patterns',
				'Saved team 10 hours/week with consistent coding standards'
			]
		}
	],

	technicalSkills: {
		frontend: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Blazor'],
		backend: ['Node.js', '.NET Core', 'C#', 'Express', 'Python'],
		databases: ['SQL Server', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase'],
		cloud: ['AWS', 'Azure Container Apps', 'Google Cloud Platform', 'Docker', 'Vercel', 'Heroku'],
		aiTools: ['Claude AI', 'ChatGPT', 'GitHub Copilot', 'Cursor', 'Windsurf', 'Kiro AI', 'Gemini API', 'n8n Cloud'],
		tools: ['Git', 'GitHub', 'GitLab', 'VS Code', 'Visual Studio', 'Cursor', 'Windsurf', 'Jira', 'Postman', 'Figma', 'Storybook', 'ESLint'],
		stateManagement: ['Redux', 'Zustand', 'Context API'],
		styling: ['Bootstrap', 'Tailwind CSS', 'Material UI', 'Sass', 'Shadcn'],
		validation: ['Formik', 'Yup'],
		other: [
			'RESTful APIs',
			'Microservices',
			'Google Maps API',
			'Google OAuth',
			'Responsive Design (Mobile-First)',
			'Clean Architecture',
			'Design Patterns',
			'Kanban (Jira)',
			'Git Flow'
		]
	},

	salaryExpectations: {
		argentina: {
			amount: 2500,
			currency: 'USD',
			type: 'gross',
			notes: "Convert to ARS using 'dólar blue venta' exchange rate"
		},
		latam: {
			amount: 3500,
			currency: 'USD',
			type: 'gross'
		}
	},

	workPreferences: {
		modality: '100% remote preferred',
		maxHybrid: '1 day/week hybrid acceptable',
		targetRoles: ['Frontend Developer', 'Fullstack Developer', 'AI Engineer']
	},

	interests: ['Playing Games', 'Playing Futbol', 'Travelling', 'AI & Automation'],

	motto: 'Persist, insist until your dreams come true ✨',

	// ========================================
	// WORK HISTORY (Real from CVs)
	// ========================================

	workHistory: [
		{
			company: 'ISTEA Ed IT',
			role: 'Software Development Mentor',
			period: 'May 2024 - Present',
			location: 'Buenos Aires, Argentina',
			responsibilities: [
				'Mentored 25+ aspiring front-end developers in HTML, CSS, JavaScript, and Bootstrap',
				'Designed practical exercises including shopping cart with API consumption and localStorage',
				'Promoted adoption of AI coding assistants (Claude, Copilot) among students',
				'Championed accessibility improvements using Lighthouse tool'
			],
			achievements: [
				'Achieved average project score of 90% with positive student reviews',
				'Elevated accessibility compliance scores by 85% (WCAG 2.1 AA standards)',
				'Enhanced student productivity and code quality through AI tools adoption'
			]
		},
		{
			company: 'Globons - The Digital Innovation Company',
			role: 'Full Stack Developer',
			period: 'March 2024 - Present',
			location: 'Buenos Aires, Argentina (PSA Project)',
			responsibilities: [
				'Implemented product grids (stock, backordered, claimed) using JavaScript, jQuery, Bootstrap',
				'Integrated Google Maps API enabling location-based search functionalities',
				'Documented bugs, implemented fixes, and tested before merging branches',
				'Integrated responsive design frameworks for desktop and mobile'
			],
			achievements: [
				'Optimized app performance by 30%',
				'Increased user engagement with local businesses by 40%',
				'Accelerated delivery by 40% with improved testing workflow',
				'Utilized AI-driven tools (Claude, Cursor, Copilot) reducing feature delivery time by 25%'
			],
			technologies: ['.NET Core 8', 'EF Core', 'SQL Server', 'Blazor', 'JavaScript', 'jQuery', 'Bootstrap', 'Docker', 'GitLab']
		},
		{
			company: 'Globons - The Digital Innovation Company',
			role: 'Full Stack Developer',
			period: 'January 2022 - February 2024',
			location: 'Buenos Aires, Argentina (Javit Project)',
			responsibilities: [
				'Developed PDF invoice consolidation API (extract, consolidate 4 per page, generate unified PDF)',
				'Implemented secure and scalable endpoints in .NET Core 4 with microservices (Node.js)',
				'Launched interactive invoice listing tool with React and MUI',
				'Introduced Docker ensuring consistent environments'
			],
			achievements: [
				'Reduced audit time by 50%',
				'Improved invoice processing workflow by 25% company-wide',
				'Accelerated feature delivery by 25% with Docker',
				'Achieved 99.9% system uptime for financial operations'
			],
			technologies: ['.NET Core 4', 'EF Core', 'SQL Server', 'Node.js', 'Docker', 'React', 'MUI', 'Formik', 'Yup', 'GitHub']
		},
		{
			company: 'Marfrig Food',
			role: 'Full Stack Developer',
			period: 'May 2023 - October 2023',
			location: 'Buenos Aires, Argentina',
			responsibilities: [
				'Engineered full-stack CMS for beef product lifecycle tracking',
				'Developed RESTful API endpoints with Node.js and Express for inventory management',
				'Designed and optimized complex SQL queries across PostgreSQL tables',
				'Built responsive UIs with React.js, Redux, and React Bootstrap'
			],
			achievements: [
				'Slashed supply chain bottlenecks by 25%',
				'Reduced data duplication by 40%',
				'Achieved 30% reduction in inventory discrepancies',
				'Enhanced data retrieval speed by 25%',
				'Improved user interaction efficiency by 35%'
			],
			technologies: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Redux', 'React Bootstrap']
		},
		{
			company: 'Rockstar Solutions',
			role: 'Full Stack Developer',
			period: 'May 2021 - December 2021',
			location: 'Buenos Aires, Argentina',
			responsibilities: [
				'Developed CMS modules using Angular 11 and Angular Material',
				'Created backend services with .NET Core and EF Core for content management',
				'Designed SQL Server data layer with normalization and stored procedures',
				'Orchestrated cross-functional communication between frontend and backend teams'
			],
			achievements: [
				'Improved user experience by 20% with reactive forms and validation',
				'Reduced integration errors by 40%',
				'Accelerated project delivery with seamless React/.NET integration'
			],
			technologies: ['Angular 11', 'Angular Material', 'TypeScript', '.NET Core', 'EF Core', 'SQL Server', 'NetZero']
		},
		{
			company: 'Bief',
			role: 'Frontend Developer',
			period: 'December 2020 - July 2021',
			location: 'Buenos Aires, Argentina',
			responsibilities: [
				'Built and maintained admin panel for apparel e-commerce platform',
				'Developed and refactored UI components for product, order, and customer management',
				'Implemented responsive and scalable design',
				'Standardized coding conventions with ESLint'
			],
			achievements: [
				'Reduced loading times by 25%',
				'Lowered bug rates by 40% applying design patterns',
				'Saved team 10 hours/week with consistent coding standards',
				'Decreased development time by 20% with modular design'
			],
			technologies: ['React', 'Next.js', 'Storybook', 'Sass', 'Material UI', 'ESLint']
		}
	],

	// ========================================
	// CERTIFICATIONS (Real from CVs)
	// ========================================

	certifications: [
		{
			name: 'Web Design Bootcamp',
			issuer: 'NUCBA',
			date: 'August 2024 - September 2024',
			description: 'Minor in Web Apps Design'
		},
		{
			name: 'AWS Essential & Next.js',
			issuer: 'Coderhouse Bootcamp',
			date: 'March 2024 - July 2024',
			description: 'Cloud computing and modern React framework'
		},
		{
			name: 'Google Cloud Essential',
			issuer: 'UTN-FRGP',
			date: 'November 2023 - December 2023',
			description: 'Google Cloud Platform fundamentals'
		},
		{
			name: 'Fullstack JS Developer',
			issuer: 'CAC Bootcamp',
			date: 'April 2021 - August 2021',
			description: 'Minor in React.js, Node.js'
		},
		{
			name: 'Frontend Developer (JavaScript, ReactJS)',
			issuer: 'Coderhouse Bootcamp',
			date: 'December 2019 - May 2020',
			description: 'Minor in React.js'
		}
	],

	// ========================================
	// FEATURED PROJECTS (Real from AI CV)
	// ========================================

	featuredProjects: [
		{
			name: 'AI Automation Bot',
			description:
				'Automated data processing bot integrated with Telegram for real-time notifications and Google Sheets for cloud-based storage',
			technologies: ['n8n Cloud', 'Telegram Bot API', 'Google Sheets API'],
			role: 'Developer',
			impact: 'Automated repetitive data processing tasks, saving hours of manual work',
			period: 'January 2025 - Present'
		},
		{
			name: 'AI-Assisted Development Environment',
			description: 'Integrated multiple AI coding assistants across full-stack projects to improve development velocity',
			technologies: ['Claude', 'Cursor', 'Windsurf', 'GitHub Copilot', 'ChatGPT'],
			role: 'Developer & Researcher',
			impact: 'Reduced repetitive coding tasks and accelerated feature delivery by 25%',
			period: '2024 - Present'
		},
		{
			name: 'PDF Invoice Consolidation System',
			description: 'System to extract data from multiple invoices, consolidate up to 4 per page, and generate unified PDFs',
			technologies: ['.NET Core 4', 'Node.js', 'React', 'MUI', 'PDF manipulation libraries'],
			role: 'Lead Developer',
			impact: 'Reduced audit time by 50% and improved invoice processing workflow by 25%',
			period: '2022 - 2024'
		},
		{
			name: 'Beef Product Lifecycle CMS',
			description: 'Full-stack CMS application for real-time tracking of beef product lifecycle',
			technologies: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Redux'],
			role: 'Full Stack Developer',
			impact: 'Slashed supply chain bottlenecks by 25%, reduced inventory discrepancies by 30%',
			period: '2023'
		}
	],

	// ========================================
	// ADDITIONAL INFORMATION
	// ========================================

	languages: [
		{language: 'Spanish', level: 'Native'},
		{language: 'English', level: 'B1 (Intermediate) - Currently taking private lessons'}
	],

	softSkills: [
		'Team collaboration',
		'Problem solving',
		'Quick learner',
		'Effective communication',
		'Time management',
		'Mentoring and teaching',
		'Clean code advocate',
		'Continuous learning mindset',
		'Agile/Kanban methodologies'
	],

	// ========================================
	// HIGHLIGHTED ACHIEVEMENTS
	// ========================================

	highlights: [
		'Mentored 25+ developers with 90% average project scores',
		'Reduced audit time by 50% with automated invoice consolidation system',
		'Improved app performance by 30-40% across multiple projects',
		'Integrated AI tools reducing feature delivery time by 25%',
		'Achieved 85% accessibility compliance improvement (WCAG 2.1 AA)',
		'Built applications serving thousands of users with 99.9% uptime',
		'Reduced integration errors by 40% with improved Git Flow practices',
		'Saved development teams 10+ hours/week with standardized practices'
	],

	// ========================================
	// AI & AUTOMATION EXPERTISE
	// ========================================

	aiExpertise: {
		tools: ['Claude AI', 'Claude code', 'ChatGPT', 'GitHub Copilot', 'Cursor', 'Windsurf', 'Kiro AI', 'Gemini API', 'n8n Cloud'],
		frameworks: ['Gemini API', 'n8n Cloud'],
		experience:
			'Actively researching and implementing AI-powered automation to accelerate development cycles and create intelligent applications. Specialized in integrating AI coding assistants to enhance productivity and code quality.'
	},

	// ========================================
	// DEVELOPMENT PRINCIPLES
	// ========================================

	principles: [
		'OOP (Object-Oriented Programming)',
		'SOLID principles',
		"DRY (Don't Repeat Yourself)",
		'KISS (Keep It Simple, Stupid)',
		'Design Patterns',
		'Clean Architecture',
		'Modular Architecture',
		'RESTful API design',
		'Responsive Design (Mobile-First)',
		'Accessibility (WCAG 2.1 AA)'
	]
};
