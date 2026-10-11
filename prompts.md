
# Rediseño completo del sitio web de Monts-Chalet

## Contexto

Rediseña y reconstruye el sitio web https://www.monts-chalet.ch/ : un apartamento de alquiler vacacional en un chalet en Les Diablerets (Alpes Vaudoises, Suiza). El sitio actual está hecho en Quarto, es funcional pero plano: poca jerarquía visual, los precios y el calendario están escondidos en una subpágina, no hay un llamado a la acción claro y el contacto es solo un mailto.

**Objetivo principal:** convertir visitantes en solicitudes de reserva. Debe transmitir calma, calidez alpina, autenticidad y confianza, con una sensación premium pero no ostentosa.

## Uso obligatorio de la skill UI UX Pro Max

Tienes instalada la skill `ui-ux-pro-max`. Úsala antes de escribir código:

1. Genera y guarda el design system:
   `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "alpine chalet holiday rental mountain hotel" --design-system --persist -p "Monts-Chalet"`
2. Crea overrides por página con `--page` para: `home`, `apartment`, `les-diablerets`, `gallery`, `contact`.
3. Si lo necesitas, consulta dominios concretos (`--domain typography` con "elegant serif warm", `--domain ux` para formularios y galerías, `--stack html-tailwind`).
4. Antes de construir cada página, lee `design-system/monts-chalet/MASTER.md` y su override en `pages/`.
5. Respeta los anti-patrones que indique la skill y completa su checklist pre-entrega al final.

Dirección estética orientativa (la skill tiene la última palabra): paleta inspirada en madera, piedra, nieve y bosque (blancos cálidos, grises piedra, verde abeto o azul glaciar, un acento cálido para los CTA). Tipografía serif elegante para títulos y sans-serif limpia para el texto. Las fotos grandes son las protagonistas. Evita degradados morados, neón, emojis como iconos y animaciones bruscas.

## Stack y requisitos técnicos

- HTML + Tailwind estático (sitio sencillo, fácil de alojar). Si prefieres Astro, que el resultado sea igualmente estático.
- Bilingüe **inglés / francés** con selector de idioma visible; ambas versiones completas. Las URLs deben ser coherentes (`/en/...`, `/fr/...`) y usar `hreflang`.
- Responsive y mobile-first (375, 768, 1024, 1440 px).
- Accesibilidad WCAG AA: contraste, foco visible, textos alt descriptivos, `prefers-reduced-motion`.
- Rendimiento: imágenes en WebP/AVIF con `srcset`, lazy loading y dimensiones definidas.
- SEO: títulos y meta descripciones por página e idioma, Open Graph, datos estructurados schema.org `LodgingBusiness` / `VacationRental` (dirección, geo, precios, capacidad, sin mascotas).

## Estructura propuesta

**Navegación fija:** Logo · The Apartment · Les Diablerets · Gallery · Contact · selector EN/FR · botón CTA "Check availability".

### 1. Home

- Hero a pantalla completa con la vista del glaciar o el chalet en invierno, un titular emotivo, el subtítulo "Les Diablerets · Alpes Vaudoises · up to 5 guests" y un CTA principal.
- Bloque de datos rápidos con iconos SVG: 5 personas, 2 dormitorios, 1 baño, terraza grande, parking interior, cerca de pistas y tiendas.
- Introducción al chalet (texto de abajo).
- Avance de la galería en mosaico o bento.
- Tarjetas "Invierno / Verano" que enlazan a Les Diablerets.
- Resumen de tarifas con CTA.
- Mapa y contacto.

### 2. The Apartment

Descripción, distribución con iconos, equipamiento, servicios incluidos y opcionales, tabla de tarifas clara, condiciones de alquiler, calendario de disponibilidad integrado y CTA de solicitud.

### 3. Les Diablerets

Secciones "The Village" y "The Glacier" con fotos, actividades separadas por invierno y verano, y enlaces externos.

### 4. Gallery

Cuadrícula responsive con lightbox accesible (teclado, swipe en móvil, botón de cierre), filtrable por Chalet / Interior / Vistas / Invierno / Verano.

### 5. Contact

Formulario de solicitud de reserva con campos de fechas de llegada y salida, número de huéspedes, nombre, email, teléfono (opcional), idioma preferido y mensaje. Validación clara y accesible. Envío con Formspree o similar; deja el endpoint como variable configurable y usa mailto como alternativa. Incluye también email, dirección, coordenadas GPS y mapa.

**Footer:** dirección, email, enlaces, selector de idioma, © Monts-Chalet.

## Contenido real (úsalo tal cual; mejora la redacción sin cambiar los hechos)

### Home

Located in the heart of the Alpes Vaudoises in the village of Les Diablerets, Monts-Chalet has a full-of-light panoramic view of the Diablerets glacier, the Meilleret ski sector and the famous Tour d'Aï and Tour de Mayen.
The chalet offers tranquility and comfort and is easy to access. It includes one indoor parking lot and outside parking spaces. It is close to the village, the slopes and the ski lifts. Local shops are within walking distance.

### The Apartment – descripción

Located on the lower (ground) floor of the chalet, the apartment accommodates up to 5 people:

- 1 spacious living room with sitting area, dining area (large table) and modern, fully equipped open kitchen
- 1 bedroom with a double bed
- 1 bedroom with bunk beds for 3 persons
- 1 bathroom with bathtub and double washbasin
- 1 separate toilet
- 1 laundry room with washing machine and dryer
- 1 large terrace
- 1 ski room with boot dryer; sledges, snowshoes and poles available free of charge
- 1 indoor parking slot + outside parking spaces
  Sheets and household linen are provided.

### Alquiler y tarifas

- Weekly rental, Saturday to Saturday, for Christmas, New Year and peak season.
- Minimum 3 nights in mid-peak season; minimum 2 nights in off-peak season.
- Other specific requests: contact the owners.

| Period                       | Weekly rate |
| ---------------------------- | ----------- |
| Christmas or New Year's week | CHF 3,200   |
| Peak season week             | CHF 2,400   |
| Mid-peak season week         | CHF 2,000   |
| Off-peak season week         | CHF 1,600   |

- Included: all utilities, bed and bath linens, and end-of-stay cleaning (a surcharge may apply in case of excessive use).
- Optional services on request: catering, laundry and daily cleaning, ski and ski-pass delivery to the chalet, daily newspapers, childcare.
- Pets are not allowed.
- Deposit: CHF 500.
- Las fechas exactas de cada temporada no están definidas: deja un marcador visible `[DEFINIR FECHAS DE TEMPORADA]` para que el propietario lo complete.

### Calendario de disponibilidad (Google Calendar, embébelo responsive)

https://calendar.google.com/calendar/embed?height=300&wkst=7&bgcolor=%23ffffff&ctz=Europe/Zurich&src=MmxpbjBjOXJwYmxkODFqZjQ4a3JvdW41bHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23272e38&showPrint=0&showTz=0&showCalendars=0&showTitle=0&showNav=1&showDate=1&showTabs=0&hl=en
(Usa `hl=fr` en la versión francesa.)

### Les Diablerets – The Village

Nestled at 1,200 m in the heart of the Alpes Vaudoises, Les Diablerets is an authentic mountain village at the foot of an imposing mountain range topped with a majestic glacier. Built entirely of chalets, it has kept its heritage while developing. In winter and summer the main village road is pedestrian, so visitors can enjoy its typical atmosphere in peace, and walkers can stroll along the river. A conference centre in the middle of the village hosts large events such as the Alpine film festival (FIFAD), as well as groups and conferences.
More info: https://www.alpesvaudoises.ch/en/Z76/les-diablerets/diablerets

### Les Diablerets – The Glacier (Glacier 3000)

- Activities all year round, combinable with the rest of the resort.
- Winter: skiing guaranteed from November to May, the famous black run "Combe d'Audon" and the Snow Park.
- Summer: the Alpine Coaster (one of the highest rail bobsled runs in Europe), snow bus rides, dog-sled excursions, and several Via Ferrata routes from the Col du Pillon.
- Peak Walk: the world's first suspension bridge linking two peaks, over 100 m long, with views of more than 24 summits above 4,000 m; open to all glacier visitors year-round.
  More info: https://www.glacier3000.ch/en

### Contacto y ubicación

- Email: info@monts-chalet.ch (asunto por defecto: "Monts-Chalet Rental Request")
- Dirección: Chemin de la Vuargnaz 5, 1865 Les Diablerets, Switzerland
- GPS: 46°21'19.3"N 7°09'25.6"E — https://goo.gl/maps/wEYqzg5NV5A2
- Google Maps embed: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2753.705356280251!2d7.154655813178799!3d46.35539187098203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478eeb6ea8cef65f%3A0x3bfe50039275c58d!2sMonts-Chalet!5e0!3m2!1sen!2sch!4v1752047709316!5m2!1sen!2sch

### Imágenes existentes (reutilízalas)

- Logo: https://www.monts-chalet.ch/images/logoWithName.png
- https://www.monts-chalet.ch/images/gallery/index/01_chalet_summer.jpg
- https://www.monts-chalet.ch/images/gallery/index/02_chalet_winter.jpg
- https://www.monts-chalet.ch/images/gallery/index/03_chalet_winter with garage.jpg
- https://www.monts-chalet.ch/images/gallery/index/04_living room view from kitchen.jpg
- https://www.monts-chalet.ch/images/gallery/index/05_kitchen view south.jpg
- https://www.monts-chalet.ch/images/gallery/index/06_living room with kitchen in background.jpg
- https://www.monts-chalet.ch/images/gallery/index/07_terrasse.jpg
- https://www.monts-chalet.ch/images/gallery/index/08_view on glacier from meilleret.jpg
- Las demás fotos están en https://www.monts-chalet.ch/gallery.html. Si faltan fotos de dormitorios, baño, ski room o terraza, deja marcadores de imagen claramente etiquetados.

## Reglas importantes

- **No inventes nada:** ni reseñas, ni testimonios, ni puntuaciones, ni metros cuadrados, ni wifi, ni equipamiento que no esté listado arriba. Si un patrón de diseño pide prueba social, deja una sección vacía marcada `[AÑADIR RESEÑAS REALES]`, o sustitúyela por datos verificables (ubicación, vistas, cercanía a las pistas).
- Mantén exactos los precios, condiciones y datos de contacto.
- La traducción al francés debe ser natural y nativa, no literal.
- El CTA "Check availability / Voir les disponibilités" debe estar visible en todo momento: en el header y como barra fija en móvil.

## Entregables

1. La carpeta `design-system/monts-chalet/` generada por la skill.
2. El sitio completo en EN y FR, listo para desplegar.
3. Un README breve que explique cómo cambiar precios, fechas de temporada, el endpoint del formulario y las fotos.
4. El checklist pre-entrega de UI UX Pro Max completado, con notas sobre cualquier punto pendiente.
