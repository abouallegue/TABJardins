// Arborescence reprise des catégories du site WordPress (slugs identiques pour garder les URL).
export type SeedCategory = { title: string; slug: string; tagline?: string; children?: SeedCategory[] }

export const categoryTree: SeedCategory[] = [
  {
    title: 'Végétaux',
    slug: 'vegetaux',
    tagline: 'Arbres, arbustes, fruitiers, rosiers et vivaces sélectionnés par nos pépiniéristes.',
    children: [
      { title: 'Arbres', slug: 'arbres' },
      { title: 'Arbres fruitiers', slug: 'arbres-fruitiers', tagline: 'Saveurs, couleurs et générosité au jardin' },
      {
        title: 'Arbustes',
        slug: 'arbustes',
        children: [
          { title: 'Arbustes caducs', slug: 'caducs-arbustes' },
          { title: 'Arbustes méditerranéens', slug: 'mediterraneens' },
          { title: 'Arbustes ornementaux', slug: 'ornementaux' },
          { title: 'Arbustes persistants', slug: 'persistants-arbustes' },
        ],
      },
      { title: 'Caducs', slug: 'caducs' },
      { title: 'Persistants', slug: 'persistants' },
      { title: 'Exotiques', slug: 'exotiques' },
      { title: 'Petits fruits et légumes', slug: 'petits-fruits-et-legumes' },
      { title: 'Plantes aromatiques', slug: 'plantes-aromatiques' },
      { title: 'Plantes grimpantes', slug: 'plantes-grimpantes' },
      { title: 'Plantes vivaces et graminées', slug: 'vivaces' },
      { title: 'Rosiers', slug: 'rosiers' },
      { title: 'Amendements, paillages et terreaux', slug: 'amendements-et-paillages' },
    ],
  },
  {
    title: 'Motoculture',
    slug: 'motocultures',
    tagline: 'Vente, réparation et révision de matériel de jardin.',
    children: [
      { title: 'Tondeuses', slug: 'tondeuses' },
      { title: 'Robots tondeuses', slug: 'robots-tondeuses' },
      { title: 'Tracteurs tondeuses', slug: 'tracteurs-tondeuses' },
      { title: 'Débroussailleuses', slug: 'debroussailleuses' },
      { title: 'Coupe-bordures', slug: 'coupe-bordures' },
      { title: 'Tronçonneuses', slug: 'tronconneuses' },
      { title: 'Élagueuses sur perche', slug: 'elagueuses-sur-perche' },
      { title: 'Taille-haies', slug: 'taille-haies' },
      { title: 'Souffleurs', slug: 'souffleurs' },
      { title: 'Aspirateurs', slug: 'aspirateurs' },
      { title: 'Motoculteurs', slug: 'motoculteurs' },
      { title: 'Nettoyeurs haute pression', slug: 'nettoyeurs-haute-pression' },
    ],
  },
]

// Quelques produits relevés sur le site actuel, pour la démonstration.
// L'import complet du catalogue se fera lors de la migration.
export const sampleProducts = [
  {
    title: 'HUSQVARNA LC137i Tondeuse à batterie',
    slug: 'husqvarna-lc137i-tondeuse-a-batterie',
    category: 'tondeuses',
    brand: 'Husqvarna',
    shortDescription: 'Tondeuse à batterie légère et facile à entretenir, pour une coupe nette.',
    variantLabel: 'Batterie + chargeur',
    variants: [
      { label: 'Sans', price: 369 },
      { label: 'Avec', price: 499 },
    ],
    specs: [
      ['Puissance nette', '0,5 kW à 3 200 tr/min'],
      ['Carter de coupe', 'Plastique ABS'],
      ['Largeur de coupe', '37,5 cm'],
      ['Méthodes de coupe', 'Ramassage, BioClip® (kit en option), éjection arrière'],
      ['Hauteur de coupe', '25 à 75 mm, 7 positions, réglage centralisé'],
      ['Bac de ramassage', '40 l'],
      ['Poids', '15 kg'],
      ['Niveau sonore garanti', '88 dB(A)'],
    ],
    featured: true,
  },
  { title: 'HUSQVARNA LC140SP Tondeuse', slug: 'husqvarna-lc140sp-tondeuse', category: 'tondeuses', brand: 'Husqvarna', price: 549 },
  {
    title: 'HUSQVARNA LC142i Tondeuse à batterie',
    slug: 'husqvarna-lc-142i-tondeuse-a-batterie',
    category: 'tondeuses',
    brand: 'Husqvarna',
    variantLabel: 'Batterie + chargeur',
    variants: [
      { label: 'Sans', price: 439 },
      { label: 'Avec', price: 619 },
    ],
    featured: true,
  },
  { title: 'HUSQVARNA LC253S Tondeuse', slug: 'husqvarna-lc-253s-tondeuse', category: 'tondeuses', brand: 'Husqvarna', price: 749 },
  { title: 'HUSQVARNA 129R Débroussailleuse', slug: 'husqvarna-129r', category: 'debroussailleuses', brand: 'Husqvarna', price: 479 },
  { title: 'HUSQVARNA 570BTS Souffleur', slug: 'husqvarna-570bts', category: 'souffleurs', brand: 'Husqvarna', price: 999 },
  {
    title: 'HUSQVARNA AUTOMOWER 415X',
    slug: 'husqvarna-automower-415x',
    category: 'robots-tondeuses',
    brand: 'Husqvarna',
    price: 2649,
    featured: true,
  },
  {
    title: 'HUSQVARNA R 112C Tracteur tondeuse',
    slug: 'husqvarna-r-112c',
    category: 'tracteurs-tondeuses',
    brand: 'Husqvarna',
    stock: 'out_of_stock' as const,
  },
  ...['Granny Smith', 'Fuji', 'Reine des reinettes', 'Golden Delicious'].map((name) => ({
    title: `Pommier ${name}`,
    slug: `pommier-${name.toLowerCase().replace(/\s+/g, '-')}`,
    category: 'arbres-fruitiers',
    price: 44.9,
    plant: { exposure: ['soleil'], foliage: ['caduc'], flowerColor: ['blanc'], floweringMonths: ['4', '5'], hardiness: 'tres-rustique' },
    featured: name === 'Reine des reinettes',
  })),
  ...['Bigarreau géant Hedelfingen', 'Stella', 'Bigarreau Burlat'].map((name) => ({
    title: `Cerisier ${name}`,
    slug: `cerisier-${name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}`,
    category: 'arbres-fruitiers',
    price: 44.9,
    plant: { exposure: ['soleil'], foliage: ['caduc'], flowerColor: ['blanc'], floweringMonths: ['4'], hardiness: 'tres-rustique' },
  })),
  ...['Doyenné du comice', 'Beurré Hardy'].map((name) => ({
    title: `Poirier ${name}`,
    slug: `poirier-${name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}`,
    category: 'arbres-fruitiers',
    price: 44.9,
    plant: { exposure: ['soleil', 'mi-ombre'], foliage: ['caduc'], flowerColor: ['blanc'], floweringMonths: ['4'], hardiness: 'rustique' },
  })),
]
