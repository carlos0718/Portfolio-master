# Projects Components

Esta carpeta contiene los componentes relacionados con la sección de proyectos del portfolio.

## Estructura de Componentes

### `Projects.js`
Componente principal que gestiona la sección de proyectos.
- Usa el hook `useProjects` para cargar los repositorios pineados
- Renderiza el contenedor principal y delega la lógica del carrusel a `ProjectCarousel`
- Asegura que la sección tenga altura mínima para empujar el footer hacia abajo

### `ProjectCarousel.js`
Componente que maneja el carrusel de proyectos.
- Controla la navegación entre proyectos (botones prev/next)
- Gestiona las animaciones con Framer Motion
- Usa variantes de animación suavizadas (stiffness: 80, damping: 20)
- Delega el renderizado del slide actual a `ProjectSlide`
- Delega los dots de paginación a `CarouselDots`

### `ProjectSlide.js`
Componente que renderiza la información de un proyecto individual.
- Muestra imagen, título, fecha, descripción
- Muestra badge con el lenguaje principal
- Botón de GitHub con link al repositorio
- Estilos inline para mejor encapsulación

### `CarouselDots.js`
Componente que renderiza los indicadores de paginación.
- Dots interactivos para navegar entre proyectos
- Animación hover con Framer Motion
- Accesibilidad con aria-labels

## Hook Personalizado

### `useProjects` (en `/src/hooks/useProjects.js`)
Hook personalizado que encapsula la lógica de carga de proyectos.
- Obtiene repositorios pineados de GitHub usando GraphQL
- Transforma los datos al formato esperado
- Retorna `{projects, loading}`

## Características

### 🎨 Código Limpio
- ✅ Código modularizado y limpio
- ✅ Separación de responsabilidades
- ✅ Hook personalizado para lógica de negocio
- ✅ Constantes de estilo para mejor mantenibilidad
- ✅ Footer siempre visible al final de la página
- ✅ Accesibilidad (aria-labels)

### ✨ Animaciones con Framer Motion

**Entrada suave del contenido:**
- Título, fecha, descripción y badge aparecen secuencialmente
- Delay progresivo de 0.1s entre cada elemento
- Animación de fade + slide desde abajo (y: 20)
- Duración: 0.6s con ease: 'easeOut'

**Transiciones de slide:**
- Cambio de proyecto con escala (0.8 → 1)
- Fade in/out suave (opacity: 0 → 1)
- Spring physics: stiffness 80, damping 20
- Duración: 0.6s con easeInOut

**Efecto zoom en imágenes:**
- Hover en imagen: scale 1 → 1.1
- Contenedor: scale 1 → 1.05
- Transición suave de 0.4-0.5s

**Botones interactivos:**
- Navegación: scale 1.15 al hover, 0.9 al tap
- Cambio de fondo al hover
- Dots: scale 1.3 al hover, 0.9 al tap
- Badge de lenguaje: scale 1.05 al hover
- Botón GitHub: scale 1.03 al hover, 0.98 al tap

### 🎯 Funcionalidad Swiper

**Navegación completa:**
- ✅ Botones izquierda/derecha con animaciones
- ✅ Drag horizontal para cambiar proyecto (swipe gesture)
- ✅ Detección de velocidad de swipe
- ✅ Threshold de confianza: 10,000
- ✅ Cursor cambia a grab/grabbing

**Autoplay inteligente:**
- ✅ Cambio automático cada 5 segundos
- ✅ Se pausa al interactuar (click, swipe, dots)
- ✅ Se reanuda automáticamente después de 10 segundos
- ✅ No interfiere con la navegación manual

**Indicadores interactivos:**
- ✅ Dots con animación spring physics
- ✅ Click en dot para navegación directa
- ✅ Ancho dinámico (32px activo, 12px inactivo)
- ✅ Hover con feedback visual

**Transiciones fluidas:**
- ✅ AnimatePresence con mode='wait'
- ✅ Sin solapamientos entre slides
- ✅ Spring physics para naturalidad
- ✅ Drag elástico (dragElastic: 1)
- ✅ Overflow hidden para evitar saltos visuales
