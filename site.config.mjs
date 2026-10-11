// Monts-Chalet — site settings.
// Edit this file, then run `npm run build`. See README.md.

export default {
  // Public address of the site, without a trailing slash (used for canonical, hreflang, Open Graph, sitemap).
  siteUrl: 'https://www.monts-chalet.ch',

  // Booking-request form. Paste a Formspree (or compatible) endpoint, e.g. 'https://formspree.io/f/abcdwxyz'.
  // While empty, the form opens the visitor's email app with the request pre-filled (mailto fallback).
  formEndpoint: '',

  // true  → visible owner markers are rendered ([DATES DE SAISON À DÉFINIR] / [SEASON DATES TO BE DEFINED], [AÑADIR RESEÑAS REALES]).
  // false → markers are hidden (the "Dates" column and the reviews section disappear while they are empty).
  showPlaceholders: true,

  contact: {
    email: 'info@monts-chalet.ch',
    emailSubject: 'Monts-Chalet Rental Request',
    street: 'Chemin de la Vuargnaz 5',
    postalCode: '1865',
    locality: 'Les Diablerets',
    region: 'VD',
    country: { en: 'Switzerland', fr: 'Suisse' },
    countryCode: 'CH',
    gps: `46°21'19.3"N 7°09'25.6"E`,
    lat: 46.355361,
    lng: 7.157111,
    mapsLink: 'https://goo.gl/maps/wEYqzg5NV5A2',
    mapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2753.705356280251!2d7.154655813178799!3d46.35539187098203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478eeb6ea8cef65f%3A0x3bfe50039275c58d!2sMonts-Chalet!5e0!3m2!1sen!2sch!4v1752047709316!5m2!1sen!2sch',
  },

  // Weekly rates in CHF. `dates` is free text per language, e.g. { en: '20 Dec – 3 Jan', fr: '20 déc. – 3 janv.' }.
  // Leave `dates: null` until the season dates are decided: the marker is shown instead.
  rates: [
    { id: 'festive', price: 3200, dates: null },
    { id: 'peak', price: 2400, dates: null },
    { id: 'mid', price: 2000, dates: null },
    { id: 'off', price: 1600, dates: null },
  ],
  deposit: 500,
  maxGuests: 5,

  // Real guest reviews only, copied from the Monts-Chalet listing on Google Maps (read on 2026-10-11).
  // `lang` is the language the guest wrote in; the other language is a translation and is labelled as such.
  // "…" marks where a longer review was shortened.
  reviews: [
    {
      author: 'Jim Rathman',
      rating: 5,
      lang: 'en',
      quote: {
        en: 'We stayed here as a couple from September 1 to 4, and truly enjoyed our time. The atmosphere was wonderfully peaceful, and the comfortable bed ensured a great night’s sleep. Having our car safely parked in a beautiful garage was a big plus and gave us peace of mind. …',
        fr: 'Nous avons séjourné ici en couple du 1er au 4 septembre et avons vraiment apprécié notre séjour. L’atmosphère était merveilleusement paisible et le lit confortable nous a assuré d’excellentes nuits. Pouvoir garer notre voiture en sécurité dans un beau garage était un vrai plus et nous a apporté une grande tranquillité d’esprit. …',
      },
    },
    {
      author: 'Justyna Nowakowska',
      rating: 5,
      lang: 'en',
      quote: {
        en: 'Monts-Chalet provides a one of a kind, exceptional accommodation in an extraordinary scenery. The chalet is spacious, clean and extremely well equipped. … The hosts are very welcoming and helped us selecting from the multiple activities available around in order to make our stay an unforgettable adventure. I definitely recommend this unique place!',
        fr: 'Monts-Chalet offre un hébergement exceptionnel, unique en son genre, dans un décor extraordinaire. Le chalet est spacieux, propre et extrêmement bien équipé. … Les hôtes sont très accueillants et nous ont aidés à choisir parmi les nombreuses activités proposées aux alentours pour faire de notre séjour une aventure inoubliable. Je recommande vivement ce lieu unique !',
      },
    },
    {
      author: 'Shosho',
      rating: 5,
      lang: 'en',
      quote: {
        en: 'A very wonderful place with beautiful views, the place is big and clean, everything u need is in the kitchen, and there is a car park. We had a wonderful time.',
        fr: 'Un endroit vraiment merveilleux avec de belles vues ; le logement est grand et propre, il y a tout ce qu’il faut dans la cuisine, ainsi qu’une place de parking. Nous avons passé un séjour merveilleux.',
      },
    },
  ],

  // Overall Google rating shown above the reviews. Update `value` and `count` when they change, or set to null to hide.
  googleRating: { value: 4.7, count: 16, url: 'https://www.google.com/maps?cid=4322980668594570637' },

  // Google Calendar availability embed. `{hl}` is replaced by the page language (en / fr).
  calendarEmbed:
    'https://calendar.google.com/calendar/embed?height=300&wkst=7&bgcolor=%23ffffff&ctz=Europe/Zurich&src=MmxpbjBjOXJwYmxkODFqZjQ4a3JvdW41bHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23272e38&showPrint=0&showTz=0&showCalendars=0&showTitle=0&showNav=1&showDate=1&showTabs=0&hl={hl}',

  links: {
    village: 'https://www.alpesvaudoises.ch/en/Z76/les-diablerets/diablerets',
    glacier: { en: 'https://www.glacier3000.ch/en', fr: 'https://www.glacier3000.ch/fr' },
  },
};
