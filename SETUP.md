# Configuración del Portfolio

## Variables de Entorno

Para que tu portfolio funcione correctamente, necesitas configurar las siguientes variables de entorno:

1. Crea un archivo `.env` en la raíz del proyecto (copia `env.example`)
2. Configura las siguientes variables:

### GitHub Token

Para obtener tus repositorios de GitHub necesitas un token personal:

1. Ve a **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Haz clic en **"Generate new token (classic)"**
3. Dale un nombre descriptivo (ej: "Portfolio Token")
4. Selecciona los siguientes permisos:
   - `repo` (acceso completo a repositorios)
   - `read:user` (información del usuario)
5. Genera el token y cópialo
6. Pégalo en tu archivo `.env`:

```env
REACT_APP_GITHUB_USERNAME=carlos0718
REACT_APP_GITHUB_TOKEN=tu_token_aqui
```

### AWS S3 (Opcional)

Si quieres usar AWS S3 para almacenar archivos:

```env
REACT_APP_AWS_ACCESS_KEY_ID=tuAccessKey
REACT_APP_AWS_SECRET_ACCESS_KEY=tuSecretKey
REACT_APP_AWS_REGION=us-east-1
REACT_APP_S3_BUCKET_NAME=nombre-de-tu-bucket
```

## Características Implementadas

### Sistema de Imágenes Automático

El portfolio ahora:

1. **Asigna imágenes automáticamente** a cada proyecto según:
   - Nombre del proyecto
   - Lenguajes de programación utilizados
   - Palabras clave identificadas

2. **Filtra proyectos frontend** automáticamente:
   - Muestra solo proyectos con JavaScript, TypeScript, HTML, CSS, etc.
   - Excluye proyectos principalmente backend
   - Excluye repositorios forked

3. **Ordena proyectos por relevancia**:
   - Los proyectos con mayor porcentaje de JavaScript aparecen primero
   - Ideal para mostrar tu mejor trabajo frontend

4. **Manejo inteligente de previsualizaciones**:
   - Muestra iframe si el proyecto tiene un demo link válido
   - Muestra imagen estática si no hay demo disponible
   - Botón Demo solo aparece cuando hay un link válido diferente del repositorio

## Agregar Nuevas Imágenes

Para agregar imágenes personalizadas para proyectos específicos:

1. Agrega la imagen en `src/Assets/Projects/`
2. Importa la imagen en `src/utils/projectImages.js`
3. Actualiza el `projectImagesMap` con el nombre de tu proyecto

Ejemplo:

```javascript
import miProyecto from '../Assets/Projects/mi-proyecto.png';

const projectImagesMap = {
  'mi-proyecto-nombre': miProyecto,
  // ... resto de proyectos
};
```

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Crear archivo .env desde el ejemplo
cp env.example .env

# Editar .env con tus credenciales
# ... edita el archivo .env

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

## Solución de Problemas

### No se muestran los proyectos

1. Verifica que `REACT_APP_GITHUB_USERNAME` esté correcto
2. Verifica que `REACT_APP_GITHUB_TOKEN` sea válido
3. Abre la consola del navegador para ver errores

### Las imágenes no se cargan

1. Verifica que las imágenes existan en `src/Assets/Projects/`
2. Asegúrate de que los imports en `projectImages.js` sean correctos
3. Limpia la caché del navegador

### Errores de compilación

```bash
# Limpia la caché de node_modules
rm -rf node_modules package-lock.json
npm install
```

## Tecnologías Utilizadas

- React 17
- React Bootstrap
- Axios
- GitHub API
- AWS S3 (opcional)
