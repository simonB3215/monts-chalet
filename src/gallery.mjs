// Photo catalogue. One entry per photo published on the site.
//   file  → file name inside src/images/original/
//   slug  → name of the optimised files in public/images/ (slug-480.avif, slug-960.webp, …)
//   tags  → gallery filters: chalet | interior | views | winter | summer
//   alt   → descriptive alternative text, per language
// After adding, removing or replacing a photo run `npm run images` and then `npm run build`.

export const photos = [
  {
    file: 'index__02_chalet_winter.jpg', slug: 'chalet-winter', tags: ['chalet', 'winter'],
    alt: { en: 'Monts-Chalet under deep snow beneath a clear blue sky', fr: 'Monts-Chalet sous une épaisse couche de neige, par un ciel bleu limpide' },
  },
  {
    file: 'index__01_chalet_summer.jpg', slug: 'chalet-summer', tags: ['chalet', 'summer'],
    alt: { en: 'Monts-Chalet in summer, with three cows in the meadow in front', fr: 'Monts-Chalet en été, trois vaches dans le pré au premier plan' },
  },
  {
    file: 'index__08_view_on_glacier_from_meilleret.jpg', slug: 'glacier-view', tags: ['views', 'winter'],
    alt: { en: 'The Diablerets massif and its glacier in winter, seen from Meilleret', fr: 'Le massif des Diablerets et son glacier en hiver, vus depuis le Meilleret' },
  },
  {
    file: 'index__03_chalet_winter_with_garage.jpg', slug: 'chalet-winter-balconies', tags: ['chalet', 'winter'],
    alt: { en: 'Snow-covered roof and carved wooden balconies of the chalet, with the mountains behind', fr: 'Toit enneigé et balcons en bois ajouré du chalet, avec les montagnes en arrière-plan' },
  },
  {
    file: 'appartment__08_03_terrasse.jpg', slug: 'terrace-massif-view', tags: ['views', 'summer'],
    alt: { en: 'Garden bench beside the chalet facing the Diablerets massif in summer', fr: 'Banc de jardin à côté du chalet, face au massif des Diablerets en été' },
  },
  {
    file: 'appartment__04_01_living_room_view_from_kitchen.jpg', slug: 'living-room', tags: ['interior'],
    alt: { en: 'Sitting area with leather sofas, a wooden sideboard and a natural stone wall', fr: 'Coin salon avec canapés en cuir, buffet en bois et mur en pierre naturelle' },
  },
  {
    file: 'appartment__03_03__full_kitchen_view.jpg', slug: 'dining-kitchen', tags: ['interior'],
    alt: { en: 'Large solid-wood dining table in front of the open kitchen', fr: 'Grande table en bois massif devant la cuisine ouverte' },
  },
  {
    file: 'appartment__08_02_terrasse.jpg', slug: 'terrace-valley-view', tags: ['views', 'summer'],
    alt: { en: 'View from the covered terrace over the village of Les Diablerets and the valley', fr: 'Vue depuis la terrasse couverte sur le village des Diablerets et la vallée' },
  },
  {
    file: 'appartment__05_01_double_bed_room_large_view.jpg', slug: 'double-bedroom', tags: ['interior'],
    alt: { en: 'Double bedroom with a glass door opening onto the terrace and the mountains', fr: 'Chambre double avec porte-fenêtre donnant sur la terrasse et les montagnes' },
  },
  {
    file: 'appartment__04_04_living_room_with_kitchen_in_background_and_outside_view.jpg', slug: 'living-room-window', tags: ['interior'],
    alt: { en: 'Living room with a wide window framing the forested slopes', fr: 'Séjour avec une large fenêtre ouverte sur les pentes boisées' },
  },
  {
    file: 'appartment__03_02_kitchen.jpg', slug: 'kitchen', tags: ['interior'],
    alt: { en: 'Modern open kitchen with matt anthracite units and a black worktop', fr: 'Cuisine ouverte moderne aux façades anthracite mat et plan de travail noir' },
  },
  {
    file: 'appartment__08_01_terrasse.jpg', slug: 'terrace', tags: ['views', 'summer'],
    alt: { en: 'Covered terrace with a table and chairs, looking towards the mountains', fr: 'Terrasse couverte avec table et chaises, tournée vers les montagnes' },
  },
  {
    file: 'appartment__04_02_living_room_with_kitchen_in_background.jpg', slug: 'living-room-kitchen', tags: ['interior'],
    alt: { en: 'Leather sofas and coffee table, with the dining area and kitchen in the background', fr: 'Canapés en cuir et table basse, avec le coin repas et la cuisine en arrière-plan' },
  },
  {
    file: 'appartment__03_04_kitchen_view_south.jpg', slug: 'dining-table', tags: ['interior'],
    alt: { en: 'Wooden dining table with leather chairs in front of the stone wall', fr: 'Table en bois et chaises en cuir devant le mur en pierre' },
  },
  {
    file: 'appartment__06_03_bunk_bed_room_without_outside_view.jpg', slug: 'bunk-room', tags: ['interior'],
    alt: { en: 'Bedroom with wooden bunk beds and wall shelves', fr: 'Chambre avec lits superposés en bois et étagères murales' },
  },
  {
    file: 'appartment__07_02_bathroom_with_large_view.jpg', slug: 'bathroom', tags: ['interior'],
    alt: { en: 'Bathroom with bathtub, double washbasin and backlit mirror', fr: 'Salle de bain avec baignoire, double lavabo et miroir rétroéclairé' },
  },
  {
    file: 'appartment__08_05_terrasse.jpg', slug: 'bench-panorama', tags: ['views', 'summer'],
    alt: { en: 'Bench in front of the chalet with a panorama of snow-capped summits', fr: 'Banc devant le chalet avec un panorama de sommets enneigés' },
  },
  {
    file: 'appartment__03_05_kitchen_view_south_unzoomed.jpg', slug: 'living-dining-wide', tags: ['interior'],
    alt: { en: 'Wide view of the dining area, the kitchen and the stone feature wall', fr: 'Vue d’ensemble du coin repas, de la cuisine et du mur en pierre' },
  },
  {
    file: 'appartment__03_06_dinning_table_with_view_on_living_room.jpg', slug: 'dining-living', tags: ['interior'],
    alt: { en: 'Dining table with the sitting area and television behind', fr: 'Table à manger avec le coin salon et la télévision en arrière-plan' },
  },
  {
    file: 'appartment__04_03_living_room_with_kitchen_in_background_angled_.jpg', slug: 'living-room-angled', tags: ['interior'],
    alt: { en: 'Living room seen from the corner, with the kitchen and sideboard beyond', fr: 'Le séjour vu depuis l’angle, avec la cuisine et le buffet au fond' },
  },
  {
    file: 'appartment__04_05_living_room_with_view_on_stone_wall.jpg', slug: 'living-room-stone-wall', tags: ['interior'],
    alt: { en: 'Sofas facing the stone wall, the sideboard and the dining table', fr: 'Canapés face au mur en pierre, au buffet et à la table à manger' },
  },
  {
    file: 'appartment__05_03_double_bed_room.jpg', slug: 'double-bedroom-wardrobe', tags: ['interior'],
    alt: { en: 'Double bedroom with a built-in pine wardrobe', fr: 'Chambre double avec armoire intégrée en bois clair' },
  },
  {
    file: 'appartment__06_01_bunk_bed_room_with_outside_view.jpg', slug: 'bunk-room-window', tags: ['interior'],
    alt: { en: 'Bunk-bed room with a large window onto the garden', fr: 'Chambre à lits superposés avec une grande fenêtre sur le jardin' },
  },
  {
    file: 'appartment__06_04_bunk_bed_room_with_third_bed.jpg', slug: 'bunk-room-third-bed', tags: ['interior'],
    alt: { en: 'Bunk beds with the pull-out third bed made up', fr: 'Lits superposés avec le troisième lit gigogne déployé' },
  },
  {
    file: 'appartment__02_01_entrance_view_by_the_door.jpg', slug: 'entrance-hall', tags: ['interior'],
    alt: { en: 'Entrance hall with built-in wooden wardrobes and a dark stone floor', fr: 'Hall d’entrée avec armoires intégrées en bois et sol en pierre sombre' },
  },
  {
    file: 'appartment__02_03_entrance_view_with_main_room_view_and_door_open.jpg', slug: 'entrance-hall-open', tags: ['interior'],
    alt: { en: 'Entrance hall opening onto the dining area, front door open to the outside', fr: 'Hall d’entrée ouvert sur le coin repas, porte d’entrée ouverte sur l’extérieur' },
  },
  {
    file: 'appartment__03_01_kitchen_view_from_entrance.jpg', slug: 'dining-from-entrance', tags: ['interior'],
    alt: { en: 'Dining table and kitchen seen from the entrance', fr: 'La table à manger et la cuisine vues depuis l’entrée' },
  },
  {
    file: 'appartment__01_01_entrance_door_closed.jpg', slug: 'entrance-door', tags: ['chalet'],
    alt: { en: 'Apartment entrance: a wooden door set in a dry-stone wall', fr: 'Entrée de l’appartement : porte en bois dans un mur en pierre sèche' },
  },
  {
    file: 'appartment__09_03_ski_locker.jpg', slug: 'ski-room', tags: ['interior', 'winter'],
    alt: { en: 'Ski room with a boot-dryer rack and a wooden sledge', fr: 'Local à skis avec sèche-chaussures et luge en bois' },
  },
  {
    file: 'appartment__09_02_washing_machine_and_dryer.jpg', slug: 'laundry-room', tags: ['interior'],
    alt: { en: 'Laundry room with stacked washing machine and dryer', fr: 'Buanderie avec lave-linge et sèche-linge superposés' },
  },
  {
    file: 'appartment__09_01_toilet.jpg', slug: 'separate-toilet', tags: ['interior'],
    alt: { en: 'Separate toilet with a small washbasin', fr: 'WC séparé avec petit lave-mains' },
  },
];
