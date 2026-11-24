# Certificados Adjuntos (`public/certificates/`)

Para mostrar la imagen o el PDF real de cualquiera de tus certificados en la sección **Certificados (`/certificates`)**:

1. Copiá el archivo (`.png`, `.jpg`, `.webp` o `.pdf`) dentro de esta carpeta (`public/certificates/`).
   - Ejemplo: `public/certificates/aws-nextjs-coderhouse.png` o `public/certificates/taller-ia.pdf`.
2. Abrí `src/data/certificatesData.js`:
   - Para un certificado ya listado, cambiá `file: null` por `file: '/certificates/nombre-del-archivo.png'`.
   - Para sumar nuevos cursos, talleres o bootcamps, agregá un objeto nuevo al array `certificatesData`.
3. Opcionalmente completá `credentialUrl` con el enlace público de verificación (Coursera, Coderhouse, Credly, LinkedIn, etc.).

Tanto la galería `/certificates` (con visor Split-Panel, zoom y navegación por teclado) como el **Chatbot IA** se actualizan automáticamente.
