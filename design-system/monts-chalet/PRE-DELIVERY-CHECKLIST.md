# Checklist pre-entrega · UI UX Pro Max

Sitio: Monts-Chalet (EN + FR, 10 páginas) · Fecha: 2026-10-11

Cómo se comprobó: build local servido con `npm run preview` y revisado en Microsoft Edge sin interfaz (headless)
a 375, 768, 1024 y 1440 px. Tres tipos de prueba: medidas automáticas de maquetación, axe-core 4 (reglas WCAG 2.0/2.1/2.2 A y AA
más buenas prácticas) y un recorrido de interacción por teclado. Además, revisión visual de capturas.

## Checklist del design system (MASTER.md)

| # | Punto | Estado | Evidencia / notas |
|---|-------|--------|-------------------|
| 1 | Sin emojis como iconos | ✅ | Todos los iconos son SVG en línea. |
| 2 | Iconos de un único set | ✅ | Lucide (`lucide-static`), trazo 1,5 px. |
| 3 | `cursor: pointer` en todo lo clicable | ✅ | Botones, enlaces, chips de filtro, selector de idioma y menú; miniaturas con `zoom-in`. |
| 4 | Hover con transición suave (150–300 ms) | ✅ | Cambios de color a 200 ms. El zoom de las fotos dura 500 ms a propósito (movimiento lento, sin desplazar la maquetación). |
| 5 | Contraste de texto ≥ 4,5:1 | ✅ | axe-core: 0 incidencias de contraste en las 10 páginas. Ratios en MASTER.md. Ver nota A. |
| 6 | Foco visible por teclado | ✅ | Contorno de 3 px verde abeto (blanco sobre fondos oscuros) con `:focus-visible`. |
| 7 | `prefers-reduced-motion` respetado | ✅ | Sin revelado al hacer scroll, sin scroll suave y sin zoom en hover. |
| 8 | Responsive 375 / 768 / 1024 / 1440 | ✅ | Sin desbordes ni imágenes rotas en las 40 combinaciones página × ancho. |
| 9 | Nada oculto tras barras fijas | ✅ | `padding` superior igual a la cabecera, inferior igual a la barra CTA móvil, y `scroll-padding-top` para las anclas. |
| 10 | Sin scroll horizontal en móvil | ✅ | Medido a 375 px en las 10 páginas. La cabecera también cabe a 360 px. |

## Anti-patrones del design system

| Anti-patrón | Estado | Notas |
|-------------|--------|-------|
| Fotos pobres | ✅ | 31 fotos reales del sitio actual, en AVIF + WebP con `srcset` y JPEG de reserva. |
| Reserva compleja | ✅ | Un formulario de una pantalla con 5 campos obligatorios. |
| Hover que desplaza la maquetación | ✅ | Solo cambios de color; el zoom de foto va recortado dentro de su marco. |
| Cambios de estado instantáneos | ✅ | — |
| Reseñas, medidas o equipamiento inventados | ✅ | No hay ninguno. Las reseñas son las de la ficha de Google Maps, con autor y enlace a la fuente. |
| Degradados morados, neón, animaciones bruscas | ✅ | Solo velos oscuros neutros bajo el texto blanco sobre foto. |

## Requisitos del encargo

| Requisito | Estado | Notas |
|-----------|--------|-------|
| EN y FR completos, `/en/…` y `/fr/…`, `hreflang` | ✅ | 5 páginas por idioma, slugs franceses (`/fr/appartement/`, `/fr/galerie/`), `x-default` → EN, `sitemap.xml` con alternates. |
| CTA siempre visible | ✅ | En la cabecera fija desde 640 px; barra fija inferior por debajo de 640 px. |
| Accesibilidad WCAG AA | ✅ con reservas | axe-core: 0 incidencias. Ver nota B. |
| Lightbox accesible | ✅ | Probado: abrir con Enter, flechas, Escape, el foco vuelve a la miniatura; botones visibles; swipe en táctil. |
| Formulario con validación accesible | ✅ | Probado: resumen de errores enfocable con enlaces, errores por campo, fechas incoherentes, estado de envío y de éxito, alternativa mailto. |
| Imágenes WebP/AVIF, `srcset`, lazy, dimensiones | ✅ | Todas con `width`/`height`; solo la primera imagen de cada página carga sin lazy. |
| SEO: título, descripción, Open Graph, schema.org | ✅ con reservas | JSON-LD `LodgingBusiness` + `VacationRental` en Home y Apartment. Ver nota C. |
| Contenido exacto | ✅ | Precios, condiciones, fianza, dirección, GPS y email copiados del encargo. |

## Pendiente del propietario

1. **Fechas de temporada**: rellenar `dates` en `site.config.mjs`. Hoy se ve `[DATES DE SAISON À DÉFINIR]` (FR) o `[SEASON DATES TO BE DEFINED]` (EN) en las dos tablas de tarifas.
2. **Reseñas**: la Home muestra tres reseñas copiadas de la ficha de Google Maps (leída el 2026-10-11) y la nota global 4,7 sobre 16 reseñas. La nota y el número no se actualizan solos: hay que cambiarlos en `googleRating` de `site.config.mjs`. Las versiones en francés son traducciones y van etiquetadas como tales; conviene confirmar en la ficha que los originales están en inglés.
3. **Endpoint del formulario**: `formEndpoint` está vacío, así que el formulario abre el correo del visitante (mailto). El envío por endpoint se probó contra un servidor simulado, no contra Formspree real.
4. Antes de publicar con algún marcador sin resolver, poner `showPlaceholders: false` para ocultarlos.

## Notas y límites de la verificación

- **A · Contraste sobre fotos.** axe-core no puede medir texto sobre imagen. El texto blanco del hero y de las tarjetas Invierno/Verano va sobre un velo oscuro; se revisó a ojo en capturas, no con medidor.
- **B · Accesibilidad.** No se probó con lector de pantalla real (NVDA, VoiceOver) ni en dispositivos físicos. Los iframes de Google (calendario y mapa) son contenido de terceros y quedan fuera del análisis.
- **C · Datos estructurados.** El JSON-LD es válido como JSON y usa propiedades de schema.org, pero no se pasó por la prueba de resultados enriquecidos de Google. Google exige para `VacationRental` datos que el encargo no aporta (por ejemplo identificador del anuncio y valoraciones), así que no cabe esperar resultado enriquecido.
- **Calendario y mapa.** Las URLs responden (HTTP 200 el calendario), pero en el navegador sin interfaz los iframes salen en blanco en las capturas. Conviene mirarlos una vez en un navegador normal.
- **Enlace de turismo.** `alpesvaudoises.ch` devuelve 403 a las comprobaciones automáticas, así que no se pudo verificar; se usa la URL exacta del encargo en ambos idiomas. `glacier3000.ch/en` y `/fr` responden 200.
- **Rendimiento.** No se ejecutó Lighthouse. Pesos medidos: CSS 33 KB, JS 10 KB, foto del hero 11–212 KB en AVIF según el ancho.
- **Francés.** Redactado para sonar natural (con usos suizos como «place de parc» y «CHF 1’600»), sin revisión de una persona nativa.
- **Checklist `pro-rules.md` de la skill.** Está pensado para apps nativas (iOS, Android, React Native, Flutter) y no aplica a este sitio web.
