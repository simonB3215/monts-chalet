// Generates the static site into dist/ (EN + FR) from site.config.mjs, src/content.mjs and src/gallery.mjs.
import { mkdir, writeFile, readFile, rm, cp } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../site.config.mjs';
import { content, routes } from '../src/content.mjs';
import { photos } from '../src/gallery.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(await readFile(path.join(root, 'src/images/manifest.json'), 'utf8'));
const LANGS = ['en', 'fr'];
const PAGES = ['home', 'apartment', 'village', 'gallery', 'contact'];
const bySlug = Object.fromEntries(photos.map((p) => [p.slug, p]));
const c = config.contact;

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (lang, page, hash = '') => `/${lang}/${routes[page][lang]}${hash}`;
const abs = (p) => config.siteUrl + p;
const minPrice = Math.min(...config.rates.map((r) => r.price));
const mailto = `mailto:${c.email}?subject=${encodeURIComponent(c.emailSubject)}`;

const iconCache = {};
function icon(name, cls = 'h-6 w-6') {
  iconCache[name] ??= readFileSync(path.join(root, 'node_modules/lucide-static/icons', `${name}.svg`), 'utf8')
    .replace(/<!--[\s\S]*?-->/, '')
    .match(/<svg[\s\S]*?>([\s\S]*)<\/svg>/)[1]
    .replace(/\s+/g, ' ')
    .trim();
  return `<svg class="${cls} shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconCache[name]}</svg>`;
}

const srcset = (slug, ext) => manifest[slug].widths.map((w) => `/images/${slug}-${w}.${ext} ${w}w`).join(', ');
function pic(slug, lang, { sizes = '100vw', cls = '', eager = false, alt } = {}) {
  const m = manifest[slug];
  if (!m) throw new Error(`Unknown photo "${slug}". Run "npm run images".`);
  const text = alt ?? bySlug[slug].alt[lang];
  return `<picture>
    <source type="image/avif" srcset="${srcset(slug, 'avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${srcset(slug, 'webp')}" sizes="${sizes}">
    <img src="/images/${slug}-${m.fallback}.jpg" alt="${esc(text)}" width="${m.width}" height="${m.height}" class="${cls}" ${eager ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'}>
  </picture>`;
}

const ext = (t, href, label) =>
  `<a class="link inline-flex min-h-[44px] items-center gap-2" href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}${icon('external-link', 'h-4 w-4')}<span class="sr-only">(${esc(t.external)})</span></a>`;
const arrowLink = (href, label, cls = '') => `<a class="link inline-flex min-h-[44px] items-center gap-2 ${cls}" href="${href}">${esc(label)}${icon('arrow-right', 'h-4 w-4')}</a>`;
const checkList = (items) =>
  `<ul class="space-y-3">${items.map((i) => `<li class="flex gap-3">${icon('check', 'mt-1 h-5 w-5 text-fir')}<span>${esc(i)}</span></li>`).join('')}</ul>`;
const marker = (text) => `<span class="marker">${esc(text)}</span>`;

// ---------- shared blocks ----------
function ratesTable(t, lang) {
  const showDates = config.showPlaceholders || config.rates.some((r) => r.dates);
  const rows = config.rates
    .map((r) => {
      const dates = r.dates ? esc(r.dates[lang] ?? r.dates) : config.showPlaceholders ? marker(t.marker.dates) : '—';
      return `<tr>
        <th scope="row" data-label="${esc(t.rates.colPeriod)}">${esc(t.rates.periods[r.id])}</th>
        ${showDates ? `<td data-label="${esc(t.rates.colDates)}">${dates}</td>` : ''}
        <td class="rate" data-label="${esc(t.rates.colRate)}">${esc(t.money(r.price))}</td>
      </tr>`;
    })
    .join('');
  return `<table class="rates">
    <caption class="sr-only">${esc(t.rates.lead)}</caption>
    <thead><tr><th scope="col">${esc(t.rates.colPeriod)}</th>${showDates ? `<th scope="col">${esc(t.rates.colDates)}</th>` : ''}<th scope="col" class="rate">${esc(t.rates.colRate)}</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function mapBlock(t) {
  return `<div class="overflow-hidden rounded-xl border border-line bg-sand">
    <iframe src="${esc(c.mapsEmbed)}" title="${esc(t.contact.mapTitle)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen class="block h-[340px] w-full md:h-[440px]" style="border:0"></iframe>
  </div>`;
}

function contactDetails(t, lang) {
  return `<dl class="space-y-6">
    <div><dt class="flex items-center gap-3 font-bold">${icon('mail', 'h-6 w-6 text-fir')}${esc(t.contact.emailLabel)}</dt><dd class="mt-1 pl-9"><a class="link" href="${mailto}">${c.email}</a></dd></div>
    <div><dt class="flex items-center gap-3 font-bold">${icon('map-pin', 'h-6 w-6 text-fir')}${esc(t.contact.addressLabel)}</dt><dd class="mt-1 pl-9"><address class="not-italic">Monts-Chalet<br>${esc(c.street)}<br>${c.postalCode} ${esc(c.locality)}<br>${esc(c.country[lang])}</address></dd></div>
    <div><dt class="flex items-center gap-3 font-bold">${icon('navigation', 'h-6 w-6 text-fir')}${esc(t.contact.gpsLabel)}</dt><dd class="mt-1 pl-9">${esc(c.gps)}<br>${ext(t, c.mapsLink, t.contact.mapLink)}</dd></div>
  </dl>`;
}

function pageHeader(t, p, slug, lang) {
  return `<section class="bg-sand">
    <div class="container-x grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <p class="eyebrow">${esc(p.eyebrow)}</p>
        <h1 class="h1 mt-4">${esc(p.h1)}</h1>
        <p class="lead mt-6">${esc(p.lead)}</p>
      </div>
      ${slug ? pic(slug, lang, { sizes: '(min-width: 1024px) 560px, 100vw', cls: 'aspect-[4/3] w-full rounded-xl object-cover shadow-lg', eager: true }) : ''}
    </div>
  </section>`;
}

function ctaBand(t, lang, title, text) {
  return `<section class="on-dark bg-fir text-white">
    <div class="container-x flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
      <div><h2 class="h2 text-white">${esc(title)}</h2><p class="mt-4 max-w-xl text-lg text-white/90">${esc(text)}</p></div>
      <a class="btn btn-primary shrink-0" href="${url(lang, 'apartment', '#availability')}">${icon('calendar-days', 'h-5 w-5')}${esc(t.cta)}</a>
    </div>
  </section>`;
}

// ---------- pages ----------
function home(t, lang) {
  const p = t.home;
  const bento = ['living-room', 'terrace-massif-view', 'double-bedroom', 'dining-kitchen', 'chalet-summer'];
  const seasonCard = (s, slug, hash) => `<a href="${url(lang, 'village', hash)}" class="group relative block overflow-hidden rounded-xl" data-reveal>
      ${pic(slug, lang, { sizes: '(min-width: 768px) 50vw, 100vw', cls: 'aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100' })}
      <div class="scrim absolute inset-0"></div>
      <div class="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
        <h3 class="h3 text-white">${esc(s.title)}</h3>
        <p class="mt-2 max-w-md text-white/95">${esc(s.text)}</p>
        <span class="mt-4 inline-flex items-center gap-2 font-semibold underline decoration-white/70 underline-offset-4">${esc(s.link)}${icon('arrow-right', 'h-4 w-4')}</span>
      </div>
    </a>`;

  return `
  <section class="on-dark relative flex min-h-[calc(100svh-9rem)] items-end sm:min-h-[calc(100svh-4rem)] lg:min-h-[calc(100svh-5rem)]">
    ${pic('chalet-winter', lang, { sizes: '100vw', cls: 'absolute inset-0 h-full w-full object-cover object-[62%_center]', eager: true })}
    <div class="scrim-hero absolute inset-0"></div>
    <div class="container-x relative w-full pb-12 pt-40 text-white md:pb-20">
      <h1 class="h-hero max-w-4xl">${esc(p.h1)}</h1>
      <p class="mt-5 text-lg font-medium tracking-wide text-white md:text-xl">${esc(p.sub)}</p>
      <div class="mt-8 flex flex-col gap-4 sm:flex-row">
        <a class="btn btn-primary" href="${url(lang, 'apartment', '#availability')}">${icon('calendar-days', 'h-5 w-5')}${esc(t.cta)}</a>
        <a class="btn btn-light" href="${url(lang, 'apartment')}">${esc(p.secondary)}</a>
      </div>
    </div>
  </section>

  <section aria-label="${esc(p.factsLabel)}" class="border-b border-line bg-white">
    <ul class="container-x grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-3 lg:grid-cols-6">
      ${t.facts.map(([i, label]) => `<li class="flex flex-col items-center gap-3 text-center">${icon(i, 'h-8 w-8 text-fir')}<span class="font-medium leading-snug">${esc(label)}</span></li>`).join('')}
    </ul>
  </section>

  <section class="section">
    <div class="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div data-reveal>
        <p class="eyebrow">${esc(p.introEyebrow)}</p>
        <h2 class="h2 mt-4">${esc(p.introTitle)}</h2>
        <div class="prose-copy mt-6">${p.intro.map((x) => `<p>${esc(x)}</p>`).join('')}</div>
        <p class="mt-8">${arrowLink(url(lang, 'apartment'), p.introLink)}</p>
      </div>
      <div data-reveal>${pic('living-room-kitchen', lang, { sizes: '(min-width: 1024px) 560px, 100vw', cls: 'aspect-[4/3] w-full rounded-xl object-cover shadow-lg' })}</div>
    </div>
  </section>

  <section class="section bg-sand">
    <div class="container-x">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div><p class="eyebrow">${esc(p.galleryEyebrow)}</p><h2 class="h2 mt-4">${esc(p.galleryTitle)}</h2></div>
        ${arrowLink(url(lang, 'gallery'), p.galleryLink)}
      </div>
      <div class="bento mt-10" data-reveal>
        ${bento.map((s, i) => `<a href="${url(lang, 'gallery')}" class="group block overflow-hidden rounded-xl ${i === 0 ? 'bento-main' : ''}">${pic(s, lang, { sizes: i === 0 ? '(min-width: 1024px) 600px, 100vw' : '(min-width: 1024px) 300px, 50vw', cls: 'h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100' })}</a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-x">
      <p class="eyebrow">${esc(p.seasonsEyebrow)}</p>
      <h2 class="h2 mt-4">${esc(p.seasonsTitle)}</h2>
      <div class="mt-10 grid gap-6 md:grid-cols-2">
        ${seasonCard(p.winter, 'glacier-view', '#winter')}
        ${seasonCard(p.summer, 'bench-panorama', '#summer')}
      </div>
    </div>
  </section>

  <section class="section bg-sand">
    <div class="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
      <div data-reveal>
        <p class="eyebrow">${esc(p.ratesEyebrow)}</p>
        <h2 class="h2 mt-4">${esc(p.ratesTitle)}</h2>
        <p class="lead mt-6">${esc(t.rates.lead)}</p>
        <div class="mt-8">${checkList(t.rates.included)}</div>
        <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a class="btn btn-primary" href="${url(lang, 'apartment', '#availability')}">${icon('calendar-days', 'h-5 w-5')}${esc(t.cta)}</a>
          ${arrowLink(url(lang, 'apartment', '#rates'), t.rates.seeAll)}
        </div>
      </div>
      <div class="card self-start p-2 sm:p-6" data-reveal>${ratesTable(t, lang)}</div>
    </div>
  </section>

  ${reviews(t, lang)}

  <section class="section">
    <div class="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <div>
        <p class="eyebrow">${esc(p.findEyebrow)}</p>
        <h2 class="h2 mt-4">${esc(p.findTitle)}</h2>
        <p class="lead mt-6">${esc(p.findText)}</p>
        <div class="mt-8">${contactDetails(t, lang)}</div>
        <a class="btn btn-secondary mt-10" href="${url(lang, 'contact')}">${esc(t.ctaRequest)}</a>
      </div>
      ${mapBlock(t)}
    </div>
  </section>`;
}

function reviews(t, lang) {
  if (config.reviews.length) {
    const g = config.googleRating;
    const stars = (n) =>
      `<span class="flex gap-1 text-ember" role="img" aria-label="${esc(t.reviews.stars(n))}">${Array.from({ length: 5 }, (_, i) => icon('star', `h-5 w-5 ${i < n ? 'fill-current' : 'opacity-30'}`)).join('')}</span>`;
    return `<section class="section border-t border-line bg-white"><div class="container-x">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 class="h2">${esc(t.home.reviewsTitle)}</h2>
          ${g ? `<p class="lead mt-4">${esc(t.reviews.summary(g.value.toLocaleString(lang === 'fr' ? 'fr-CH' : 'en-US'), g.count))}</p>` : ''}
        </div>
        ${g ? ext(t, g.url, t.reviews.link) : ''}
      </div>
      <div class="mt-10 grid gap-6 lg:grid-cols-3">${config.reviews
        .map((r) => {
          const translated = lang !== r.lang && typeof r.quote === 'object';
          return `<figure class="card flex flex-col p-8" data-reveal>
            ${r.rating ? stars(r.rating) : ''}
            <blockquote class="mt-5 grow leading-relaxed"><p>${esc(r.quote[lang] ?? r.quote)}</p></blockquote>
            <figcaption class="mt-6 border-t border-line pt-5"><span class="block font-bold">${esc(r.author)}</span><span class="block text-[15px] text-stone">${esc(t.reviews.source)}${translated ? ` · ${esc(t.reviews.translated)}` : ''}</span></figcaption>
          </figure>`;
        })
        .join('')}</div>
    </div></section>`;
  }
  if (!config.showPlaceholders) return '';
  return `<section class="section border-t border-line bg-white"><div class="container-x">
    <h2 class="h2">${esc(t.home.reviewsTitle)}</h2>
    <div class="mt-8 rounded-xl border-2 border-dashed border-ember/60 p-10 text-center">${marker(t.marker.reviews)}</div>
  </div></section>`;
}

function apartment(t, lang) {
  const p = t.apartment;
  const strip = ['dining-kitchen', 'double-bedroom', 'bunk-room', 'bathroom'];
  return `
  ${pageHeader(t, p, 'living-room', lang)}

  <section class="section">
    <div class="container-x">
      <h2 class="h2">${esc(p.layoutTitle)}</h2>
      <ul class="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        ${p.layout.map(([i, title, text]) => `<li class="flex gap-4">${icon(i, 'mt-1 h-7 w-7 text-fir')}<div><h3 class="text-lg font-semibold">${esc(title)}</h3>${text ? `<p class="mt-1 text-stone">${esc(text)}</p>` : ''}</div></li>`).join('')}
      </ul>
      <p class="mt-10 flex items-center gap-3 rounded-lg bg-sand px-5 py-4 font-medium">${icon('check', 'h-5 w-5 text-fir')}${esc(p.linen)}</p>
      <div class="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4" data-reveal>
        ${strip.map((s) => `<a class="group block overflow-hidden rounded-xl" href="${url(lang, 'gallery')}">${pic(s, lang, { sizes: '(min-width: 1024px) 280px, 50vw', cls: 'aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100' })}</a>`).join('')}
      </div>
      <p class="mt-6">${arrowLink(url(lang, 'gallery'), p.photosLink)}</p>
    </div>
  </section>

  <section class="section bg-sand">
    <div class="container-x">
      <h2 class="h2">${esc(p.servicesTitle)}</h2>
      <div class="mt-10 grid gap-6 lg:grid-cols-3">
        <div class="card p-8"><h3 class="h3">${esc(t.rates.includedTitle)}</h3><div class="mt-6">${checkList(t.rates.included)}</div></div>
        <div class="card p-8"><h3 class="h3">${esc(t.rates.optionalTitle)}</h3>
          <ul class="mt-6 space-y-3">${t.rates.optional.map(([i, label]) => `<li class="flex gap-3">${icon(i, 'mt-0.5 h-5 w-5 text-fir')}<span>${esc(label)}</span></li>`).join('')}</ul>
        </div>
        <div class="card p-8"><h3 class="h3">${esc(t.rates.goodTitle)}</h3>
          <ul class="mt-6 space-y-3">
            <li class="flex gap-3">${icon('paw-print', 'mt-0.5 h-5 w-5 text-fir')}<span>${esc(t.rates.pets)}</span></li>
            <li class="flex gap-3">${icon('banknote', 'mt-0.5 h-5 w-5 text-fir')}<span>${esc(t.rates.deposit(t.money(config.deposit)))}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="rates" class="section">
    <div class="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      <div>
        <h2 class="h2">${esc(t.rates.title)}</h2>
        <p class="lead mt-6">${esc(t.rates.lead)}</p>
        <div class="card mt-8 p-2 sm:p-6">${ratesTable(t, lang)}</div>
      </div>
      <div class="lg:pt-4">
        <h3 class="h3">${esc(t.rates.conditionsTitle)}</h3>
        <div class="mt-6">${checkList(t.rates.conditions)}</div>
      </div>
    </div>
  </section>

  <section id="availability" class="section bg-sand">
    <div class="container-x">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <p class="eyebrow">${esc(p.availabilityEyebrow)}</p>
          <h2 class="h2 mt-4">${esc(p.availabilityTitle)}</h2>
          <p class="lead mt-6">${esc(p.availabilityText)}</p>
        </div>
        <a class="btn btn-primary" href="${url(lang, 'contact')}">${esc(t.ctaRequest)}</a>
      </div>
      <div class="mt-10 overflow-hidden rounded-xl border border-line bg-white">
        <iframe src="${esc(config.calendarEmbed.replace('{hl}', lang))}" title="${esc(p.calendarTitle)}" loading="lazy" class="block h-[460px] w-full md:h-[600px]" style="border:0"></iframe>
      </div>
      <p class="mt-4">${ext(t, config.calendarEmbed.replace('{hl}', lang), p.calendarLink)}</p>
    </div>
  </section>`;
}

function village(t, lang) {
  const p = t.village;
  const list = (items) => `<ul class="mt-6 space-y-3">${items.map((i) => `<li class="flex gap-3">${icon('check', 'mt-1 h-5 w-5 text-fir')}<span>${esc(i)}</span></li>`).join('')}</ul>`;
  return `
  ${pageHeader(t, p, 'terrace-valley-view', lang)}

  <section id="village" class="section">
    <div class="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div data-reveal>${pic('chalet-summer', lang, { sizes: '(min-width: 1024px) 560px, 100vw', cls: 'aspect-[4/3] w-full rounded-xl object-cover shadow-lg' })}</div>
      <div data-reveal>
        <h2 class="h2">${esc(p.villageTitle)}</h2>
        <div class="prose-copy mt-6">${p.villageText.map((x) => `<p>${esc(x)}</p>`).join('')}</div>
        <p class="mt-8">${ext(t, config.links.village, p.villageLink)}</p>
      </div>
    </div>
  </section>

  <section id="glacier" class="section bg-sand">
    <div class="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div data-reveal>
        <p class="eyebrow">${esc(p.glacierSub)}</p>
        <h2 class="h2 mt-4">${esc(p.glacierTitle)}</h2>
        <p class="lead mt-6">${esc(p.glacierText)}</p>
        <div class="card mt-8 p-6 sm:p-8">
          <h3 class="h3">${esc(p.peakTitle)}</h3>
          <p class="mt-3">${esc(p.peakText)}</p>
        </div>
        <p class="mt-8">${ext(t, config.links.glacier[lang], p.glacierLink)}</p>
      </div>
      <div data-reveal>${pic('glacier-view', lang, { sizes: '(min-width: 1024px) 560px, 100vw', cls: 'aspect-[4/3] w-full rounded-xl object-cover shadow-lg' })}</div>
    </div>
  </section>

  <section class="section">
    <div class="container-x">
      <h2 class="h2">${esc(p.activitiesTitle)}</h2>
      <div class="mt-10 grid gap-6 lg:grid-cols-3">
        <div id="winter" class="card p-8">${icon('snowflake', 'h-8 w-8 text-fir')}<h3 class="h3 mt-4">${esc(p.winterTitle)}</h3>${list(p.winter)}</div>
        <div id="summer" class="card p-8">${icon('sun', 'h-8 w-8 text-fir')}<h3 class="h3 mt-4">${esc(p.summerTitle)}</h3>${list(p.summer)}</div>
        <div class="card bg-sand p-8">${icon('map-pin', 'h-8 w-8 text-fir')}<h3 class="h3 mt-4">${esc(p.fromChaletTitle)}</h3>${list(p.fromChalet)}</div>
      </div>
      <h2 class="h3 mt-16">${esc(p.linksTitle)}</h2>
      <ul class="mt-6 space-y-3">
        <li>${ext(t, config.links.village, p.links.village)}</li>
        <li>${ext(t, config.links.glacier[lang], p.links.glacier)}</li>
      </ul>
    </div>
  </section>

  ${ctaBand(t, lang, p.ctaTitle, p.ctaText)}`;
}

function gallery(t, lang) {
  const p = t.gallery;
  const filters = Object.entries(p.filters)
    .map(([k, label]) => `<button type="button" class="chip" data-filter="${k}" aria-pressed="${k === 'all'}">${esc(label)}</button>`)
    .join('');
  const items = photos
    .map((ph, i) => {
      const m = manifest[ph.slug];
      const big = m.widths[m.widths.length - 1];
      return `<a href="/images/${ph.slug}-${big}.webp" class="gallery-item group" data-tags="${ph.tags.join(' ')}" data-slug="${ph.slug}" data-widths="${m.widths.join(',')}" data-w="${m.width}" data-h="${m.height}">
        ${pic(ph.slug, lang, { sizes: '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw', cls: 'w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100', eager: i < 2 })}
      </a>`;
    })
    .join('');
  return `
  <section class="bg-sand">
    <div class="container-x py-12 md:py-16">
      <p class="eyebrow">${esc(p.eyebrow)}</p>
      <h1 class="h1 mt-4">${esc(p.h1)}</h1>
      <p class="lead mt-6">${esc(p.lead)}</p>
    </div>
  </section>
  <section class="section !pt-10">
    <div class="container-x">
      <div role="group" aria-label="${esc(p.filterLabel)}" class="flex flex-wrap gap-3">${filters}</div>
      <p id="gallery-count" class="sr-only" role="status" aria-live="polite"></p>
      <div id="gallery-grid" class="gallery-grid mt-8">${items}</div>
    </div>
  </section>

  <dialog id="lightbox" class="lightbox" aria-label="${esc(p.lightbox.label)}">
    <div class="lightbox-inner on-dark">
      <button type="button" class="lightbox-btn lightbox-close" data-lb="close" aria-label="${esc(p.lightbox.close)}">${icon('x', 'h-6 w-6')}</button>
      <button type="button" class="lightbox-btn lightbox-prev" data-lb="prev" aria-label="${esc(p.lightbox.prev)}">${icon('chevron-left', 'h-7 w-7')}</button>
      <figure class="lightbox-figure">
        <img id="lightbox-img" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" sizes="100vw">
        <figcaption><span id="lightbox-caption"></span><span id="lightbox-position" class="lightbox-position" aria-live="polite"></span></figcaption>
      </figure>
      <button type="button" class="lightbox-btn lightbox-next" data-lb="next" aria-label="${esc(p.lightbox.next)}">${icon('chevron-right', 'h-7 w-7')}</button>
    </div>
  </dialog>

  ${ctaBand(t, lang, t.village.ctaTitle, t.village.ctaText)}`;
}

function contact(t, lang) {
  const p = t.contact;
  const f = p.f;
  const req = '<span class="text-ember" aria-hidden="true"> *</span>';
  const opt = `<span class="font-normal text-stone"> (${esc(f.optional)})</span>`;
  const err = (id) => `<p class="field-error" id="${id}-error" hidden></p>`;
  const action = config.formEndpoint || mailto;
  return `
  <section class="bg-sand">
    <div class="container-x py-12 md:py-16">
      <p class="eyebrow">${esc(p.eyebrow)}</p>
      <h1 class="h1 mt-4">${esc(p.h1)}</h1>
      <p class="lead mt-6 max-w-2xl">${esc(p.lead)}</p>
    </div>
  </section>

  <section class="section !pt-12">
    <div class="container-x grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <div>
        <h2 class="h2">${esc(p.formTitle)}</h2>
        <p class="mt-4 text-stone">${esc(p.required)}</p>
        <p class="mt-2 text-stone">${esc(p.calendarHint)} <a class="link" href="${url(lang, 'apartment', '#availability')}">${esc(p.calendarLink)}</a>.</p>

        <form id="booking-form" class="mt-8" action="${esc(action)}" method="post" ${config.formEndpoint ? '' : 'enctype="text/plain"'} novalidate data-endpoint="${esc(config.formEndpoint)}">
          <div id="form-errors" class="form-summary" tabindex="-1" hidden></div>
          <input type="hidden" name="_subject" value="${esc(c.emailSubject)}">
          <input type="hidden" name="site_language" value="${lang}">
          <p class="hidden" aria-hidden="true"><label>Leave this field empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>

          <div class="grid gap-6 sm:grid-cols-2">
            <div><label class="label" for="arrival">${esc(f.arrival)}${req}</label><input class="input" type="date" id="arrival" name="arrival" required aria-describedby="arrival-error">${err('arrival')}</div>
            <div><label class="label" for="departure">${esc(f.departure)}${req}</label><input class="input" type="date" id="departure" name="departure" required aria-describedby="departure-error">${err('departure')}</div>
            <div><label class="label" for="guests">${esc(f.guests)}${req}</label>
              <select class="input" id="guests" name="guests" required aria-describedby="guests-error">
                <option value="">${esc(f.guestsPlaceholder)}</option>
                ${Array.from({ length: config.maxGuests }, (_, i) => `<option>${i + 1}</option>`).join('')}
              </select>${err('guests')}</div>
            <div><label class="label" for="language">${esc(f.language)}</label>
              <select class="input" id="language" name="preferred_language">
                <option${lang === 'en' ? ' selected' : ''}>English</option>
                <option${lang === 'fr' ? ' selected' : ''}>Français</option>
              </select></div>
            <div class="sm:col-span-2"><label class="label" for="name">${esc(f.name)}${req}</label><input class="input" type="text" id="name" name="name" autocomplete="name" required aria-describedby="name-error">${err('name')}</div>
            <div><label class="label" for="email">${esc(f.email)}${req}</label><input class="input" type="email" id="email" name="email" autocomplete="email" inputmode="email" required aria-describedby="email-error">${err('email')}</div>
            <div><label class="label" for="phone">${esc(f.phone)}${opt}</label><input class="input" type="tel" id="phone" name="phone" autocomplete="tel" inputmode="tel"></div>
            <div class="sm:col-span-2"><label class="label" for="message">${esc(f.message)}${opt}</label><textarea class="input" id="message" name="message" rows="5" aria-describedby="message-hint"></textarea><p class="mt-2 text-sm text-stone" id="message-hint">${esc(f.messageHint)}</p></div>
          </div>

          <button type="submit" class="btn btn-primary mt-8 w-full sm:w-auto" id="booking-submit">${esc(f.submit)}</button>
          <div id="form-status" class="form-status" role="status" aria-live="polite" tabindex="-1" hidden></div>
          <div id="form-fallback" class="form-fallback" hidden></div>
        </form>
      </div>

      <aside class="card self-start p-8">
        <h2 class="h3">${esc(p.detailsTitle)}</h2>
        <div class="mt-6">${contactDetails(t, lang)}</div>
      </aside>
    </div>
    <div class="container-x mt-16">${mapBlock(t)}</div>
  </section>`;
}

const render = { home, apartment, village, gallery, contact };

// ---------- layout ----------
function jsonLd(t, lang) {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'VacationRental'],
    '@id': abs('/#monts-chalet'),
    name: 'Monts-Chalet',
    description: t.home.description,
    url: abs(url(lang, 'home')),
    image: ['chalet-winter', 'living-room', 'double-bedroom', 'terrace-valley-view'].map((s) => abs(`/images/${s}-960.jpg`)),
    email: c.email,
    address: { '@type': 'PostalAddress', streetAddress: c.street, postalCode: c.postalCode, addressLocality: c.locality, addressRegion: c.region, addressCountry: c.countryCode },
    geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
    hasMap: c.mapsLink,
    petsAllowed: false,
    currenciesAccepted: 'CHF',
    priceRange: `CHF ${minPrice}–${Math.max(...config.rates.map((r) => r.price))} / ${lang === 'fr' ? 'semaine' : 'week'}`,
    numberOfRooms: 2,
    amenityFeature: [
      ['Terrace', true], ['Indoor parking', true], ['Outdoor parking', true], ['Fully equipped kitchen', true], ['Washing machine', true], ['Dryer', true],
      ['Ski room with boot dryer', true], ['Bed and bath linen', true], ['Pets allowed', false],
    ].map(([name, value]) => ({ '@type': 'LocationFeatureSpecification', name, value })),
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'Apartment',
      occupancy: { '@type': 'QuantitativeValue', maxValue: config.maxGuests },
      numberOfBedrooms: 2,
      numberOfBathroomsTotal: 1,
      petsAllowed: false,
      bed: [
        { '@type': 'BedDetails', typeOfBed: 'Double bed', numberOfBeds: 1 },
        { '@type': 'BedDetails', typeOfBed: 'Bunk bed (sleeps 3)', numberOfBeds: 1 },
      ],
    },
    makesOffer: config.rates.map((r) => ({
      '@type': 'Offer',
      name: t.rates.periods[r.id],
      priceSpecification: { '@type': 'UnitPriceSpecification', price: r.price, priceCurrency: 'CHF', unitCode: 'WEE' },
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function layout(lang, page, body) {
  const t = content[lang];
  const p = t[page];
  const other = lang === 'en' ? 'fr' : 'en';
  const navItems = ['apartment', 'village', 'gallery', 'contact'];
  const navLink = (k, cls) => `<a href="${url(lang, k)}" class="${cls}"${k === page ? ' aria-current="page"' : ''}>${esc(t.nav[k])}</a>`;
  const langSwitch = (cls = '') => `<div class="lang-switch ${cls}" role="group" aria-label="${esc(t.langLabel)}">
      ${LANGS.map((l) => `<a href="${url(l, page)}" lang="${l}" hreflang="${l}"${l === lang ? ' aria-current="true"' : ''}><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr-only">${content[l].langName}</span></a>`).join('')}
    </div>`;
  const logo = (variant) => `<img src="/images/logo-mark-${variant}.png" alt="" width="${manifest['logo-mark'].width}" height="${manifest['logo-mark'].height}" class="h-6 w-auto max-[359px]:hidden sm:h-8">`;
  const i18n = { gallery: { count: t.gallery.count, position: t.gallery.lightbox.position }, form: { ...t.contact.errors, success: t.contact.success, failure: t.contact.failure, mailtoNote: t.contact.mailtoNote, sending: t.contact.f.sending, body: t.mailBody, fb: t.contact.fallback }, email: c.email, subject: c.emailSubject };

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.description)}">
  <link rel="canonical" href="${abs(url(lang, page))}">
  ${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(url(l, page))}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${abs(url('en', page))}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Monts-Chalet">
  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${abs(url(lang, page))}">
  <meta property="og:image" content="${abs('/images/og-image.jpg')}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(bySlug['chalet-winter'].alt[lang])}">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:locale:alternate" content="${content[other].locale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#23412F">
  <link rel="icon" type="image/png" href="/images/favicon.png">
  <link rel="preload" href="/assets/fonts/karla-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/playfair-display-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  ${page === 'home' ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset('chalet-winter', 'avif')}" imagesizes="100vw">` : ''}
  <link rel="stylesheet" href="/assets/site.css">
  ${page === 'home' || page === 'apartment' ? jsonLd(t, lang) : ''}
</head>
<body>
  <a class="skip-link" href="#main">${esc(t.skip)}</a>

  <header class="site-header">
    <div class="container-x flex h-full items-center justify-between gap-4">
      <a href="${url(lang, 'home')}" class="flex min-h-[44px] items-center gap-2 sm:gap-3" aria-label="${esc(t.nav.home)}"${page === 'home' ? ' aria-current="page"' : ''}>
        ${logo('dark')}<span class="whitespace-nowrap font-display text-lg font-semibold text-fir sm:text-xl sm:tracking-wide">Monts-Chalet</span>
      </a>
      <nav aria-label="${esc(t.navLabel)}" class="hidden items-center gap-7 lg:flex">
        ${navItems.map((k) => navLink(k, 'nav-link')).join('\n        ')}
      </nav>
      <div class="flex items-center gap-2 sm:gap-3">
        ${langSwitch()}
        <a class="btn btn-primary btn-sm hidden sm:inline-flex" href="${url(lang, 'apartment', '#availability')}">${esc(t.cta)}</a>
        <button type="button" class="menu-btn lg:hidden" id="menu-btn" aria-expanded="false" aria-controls="mobile-nav">${icon('menu', 'h-6 w-6')}<span class="sr-only">${esc(t.menu)}</span></button>
      </div>
    </div>
    <nav id="mobile-nav" aria-label="${esc(t.navLabel)}" class="mobile-nav lg:hidden" hidden>
      <div class="container-x flex flex-col py-3">
        ${navItems.map((k) => navLink(k, 'mobile-nav-link')).join('\n        ')}
      </div>
    </nav>
  </header>

  <main id="main" tabindex="-1">${body}
  </main>

  <footer class="on-dark bg-bark text-white/90">
    <div class="container-x grid gap-12 py-16 md:grid-cols-3">
      <div>
        <div class="flex items-center gap-3">${logo('light')}<span class="font-display text-xl font-semibold tracking-wide text-white">Monts-Chalet</span></div>
        <p class="mt-5 max-w-xs">${esc(t.footer.tagline)}</p>
        ${langSwitch('lang-switch-dark mt-6')}
      </div>
      <nav aria-label="${esc(t.footer.explore)}">
        <h2 class="footer-title">${esc(t.footer.explore)}</h2>
        <ul class="mt-4 space-y-1">${navItems.map((k) => `<li><a class="footer-link" href="${url(lang, k)}">${esc(t.nav[k])}</a></li>`).join('')}</ul>
      </nav>
      <div>
        <h2 class="footer-title">${esc(t.footer.contact)}</h2>
        <address class="mt-4 not-italic leading-relaxed">${esc(c.street)}<br>${c.postalCode} ${esc(c.locality)}<br>${esc(c.country[lang])}</address>
        <p class="mt-2"><a class="footer-link" href="${mailto}">${c.email}</a></p>
      </div>
    </div>
    <div class="border-t border-white/15">
      <p class="container-x py-6 text-sm text-white/80">© ${new Date().getFullYear()} Monts-Chalet. ${esc(t.footer.rights)}</p>
    </div>
  </footer>

  <aside class="sticky-cta sm:hidden" aria-label="${esc(t.cta)}">
    <p class="text-sm font-medium leading-tight">${esc(t.fromPrice(t.money(minPrice)))}</p>
    <a class="btn btn-primary btn-sm shrink-0" href="${url(lang, 'apartment', '#availability')}">${esc(t.cta)}</a>
  </aside>

  <script type="application/json" id="i18n">${JSON.stringify(i18n).replace(/</g, '\\u003c')}</script>
  <script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

// ---------- write ----------
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets/fonts'), { recursive: true });
await cp(path.join(root, 'public'), dist, { recursive: true });
await cp(path.join(root, 'src/js/site.js'), path.join(dist, 'assets/site.js'));
for (const [pkg, files] of [
  ['karla', ['karla-latin-wght-normal', 'karla-latin-ext-wght-normal']],
  ['playfair-display', ['playfair-display-latin-wght-normal', 'playfair-display-latin-ext-wght-normal']],
]) {
  for (const f of files) await cp(path.join(root, `node_modules/@fontsource-variable/${pkg}/files/${f}.woff2`), path.join(dist, `assets/fonts/${f}.woff2`));
}

for (const lang of LANGS) {
  for (const page of PAGES) {
    const dir = path.join(dist, lang, routes[page][lang]);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), layout(lang, page, render[page](content[lang], lang)));
  }
}

// Root: send visitors to their language (French browsers → /fr/, everyone else → /en/).
await writeFile(
  path.join(dist, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Monts-Chalet · Les Diablerets</title>
  <link rel="canonical" href="${abs('/en/')}">
  ${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(`/${l}/`)}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${abs('/en/')}">
  <script>location.replace((navigator.language || '').toLowerCase().indexOf('fr') === 0 ? '/fr/' : '/en/');</script>
  <noscript><meta http-equiv="refresh" content="0; url=/en/"></noscript>
</head>
<body>
  <p><a href="/en/" lang="en">Monts-Chalet in English</a> · <a href="/fr/" lang="fr">Monts-Chalet en français</a></p>
</body>
</html>
`,
);

await writeFile(
  path.join(dist, '404.html'),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${esc(content.en.notFound.title)} · Monts-Chalet</title>
  <link rel="icon" type="image/png" href="/images/favicon.png">
  <link rel="stylesheet" href="/assets/site.css">
</head>
<body>
  <main class="container-x flex min-h-screen flex-col items-start justify-center gap-10 py-20">
    ${LANGS.map((l) => `<div lang="${l}"><h1 class="h2">${esc(content[l].notFound.title)}</h1><p class="lead mt-4">${esc(content[l].notFound.text)}</p><a class="btn btn-secondary mt-6" href="/${l}/">${esc(content[l].notFound.link)}</a></div>`).join('\n    ')}
  </main>
</body>
</html>
`,
);

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.flatMap((page) =>
  LANGS.map(
    (lang) => `  <url>
    <loc>${abs(url(lang, page))}</loc>
    <lastmod>${today}</lastmod>
${LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(url(l, page))}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(url('en', page))}"/>
  </url>`,
  ),
).join('\n')}
</urlset>
`,
);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);

console.log(`Built ${LANGS.length * PAGES.length} pages → dist/`);
