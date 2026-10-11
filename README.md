# Monts-Chalet · sitio web

Sitio estático bilingüe (inglés / francés) para el apartamento de Monts-Chalet en Les Diablerets.
HTML + Tailwind CSS, sin servidor ni base de datos: la carpeta `dist/` se puede subir a cualquier alojamiento.

## Uso rápido

Requiere Node.js 20 o superior.

```bash
npm install        # una sola vez
npm run build      # genera dist/
npm run preview    # abre http://localhost:4173
```

Para publicar, sube el contenido de `dist/` a la raíz del dominio. Las rutas son absolutas (`/en/…`, `/images/…`),
así que el sitio debe servirse desde la raíz, no desde una subcarpeta ni abriendo los archivos con doble clic.

Después de cualquier cambio: `npm run build` y vuelve a subir `dist/`.

## Dónde se cambia cada cosa

| Qué | Archivo |
|-----|---------|
| Precios, fechas de temporada, fianza, endpoint del formulario, reseñas, email, dirección, calendario, mapa | [site.config.mjs](site.config.mjs) |
| Textos en inglés y francés | [src/content.mjs](src/content.mjs) |
| Lista de fotos, textos alternativos y filtros de la galería | [src/gallery.mjs](src/gallery.mjs) |
| Colores y tipografías | [tailwind.config.js](tailwind.config.js) y [src/styles.css](src/styles.css) |
| Estructura de las páginas | [scripts/build.mjs](scripts/build.mjs) |

### Precios

En `site.config.mjs`, lista `rates`: cambia `price` (en CHF, sin separadores). La fianza es `deposit`.
El «desde CHF …» de la barra móvil se calcula solo con el precio más bajo.

### Fechas de temporada

En la misma lista `rates`, sustituye `dates: null` por el texto en cada idioma:

```js
{ id: 'peak', price: 2400, dates: { en: '6 Feb – 6 Mar', fr: '6 févr. – 6 mars' } },
```

Mientras una fecha esté en `null` se muestra el marcador `[DATES DE SAISON À DÉFINIR]` en francés y `[SEASON DATES TO BE DEFINED]` en inglés.

### Endpoint del formulario

Crea un formulario en [Formspree](https://formspree.io) (o un servicio compatible que acepte un POST de formulario)
y pega su dirección:

```js
formEndpoint: 'https://formspree.io/f/tu-codigo',
```

Con el campo vacío, el formulario abre el programa de correo del visitante con la solicitud ya escrita
para `info@monts-chalet.ch` (asunto «Monts-Chalet Rental Request»).

### Reseñas

La Home muestra las reseñas de la lista `reviews` y, encima, la nota global de Google (`googleRating`).
Ambas están copiadas a mano de la ficha de Google Maps: no se actualizan solas. Cuando cambien la nota o el
número de reseñas, edita `value` y `count`; con `googleRating: null` se oculta esa línea.

Añade solo reseñas reales, con el formato de las que ya hay (`lang` es el idioma en que escribió el huésped;
el otro idioma se muestra como traducción):

```js
reviews: [{ author: 'Nombre', rating: 5, lang: 'en', quote: { en: '…', fr: '…' } }],
```

### Marcadores visibles

El marcador de fechas de temporada se ve en la web mientras falten esos datos (y `[AÑADIR RESEÑAS REALES]` si se vacía la lista de reseñas).
Para ocultarlos sin rellenarlos, pon `showPlaceholders: false`.

### Fotos

1. Copia la foto original (JPEG, cuanto más grande mejor) en `src/images/original/`.
2. Añade o edita su entrada en `src/gallery.mjs`: `file`, `slug`, `tags` y el texto alternativo en los dos idiomas.
3. Ejecuta `npm run images` y después `npm run build`.

`npm run images` genera las versiones AVIF y WebP en `public/images/` y no repite las que ya existen.
Si sustituyes una foto manteniendo el mismo `slug`, usa `npm run images -- --force`.

Las fotos fijas de cada página (hero, tarjetas, cabeceras) se eligen por `slug` dentro de `scripts/build.mjs`;
la foto del hero es `chalet-winter`.

## Estructura

```
site.config.mjs          datos del negocio
src/content.mjs          textos EN / FR y rutas
src/gallery.mjs          catálogo de fotos
src/styles.css           estilos (Tailwind)
src/js/site.js           menú, galería, formulario
src/images/original/     fotos originales
public/images/           fotos optimizadas (generadas)
scripts/                 build, imágenes y servidor de prueba
design-system/           design system de UI UX Pro Max y checklist
dist/                    sitio generado (no se edita a mano)
```

## Notas

- El logotipo usa el símbolo de las montañas del logo original, recoloreado en verde (cabecera) y blanco (pie);
  el nombre «Monts-Chalet» va como texto. El original sigue en `src/images/original/logoWithName.png`.
- Las tipografías (Playfair Display y Karla) se sirven desde el propio sitio, sin llamadas a Google Fonts.
- El calendario y el mapa son iframes de Google y cargan contenido de Google al llegar a ellos.
- La raíz `/` redirige a `/fr/` si el navegador está en francés y a `/en/` en los demás casos.
- Pendientes y resultado de las pruebas: [design-system/monts-chalet/PRE-DELIVERY-CHECKLIST.md](design-system/monts-chalet/PRE-DELIVERY-CHECKLIST.md).
