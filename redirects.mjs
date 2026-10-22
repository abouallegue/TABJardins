// Anciennes URL WordPress qui faisaient doublon avec les pages catégories.
// Leur texte d'introduction et leur FAQ sont désormais portés par la catégorie elle-même.
const vegetaux = {
  'amendements-paillages-et-terreaux': 'amendements-et-paillages',
  arbres: 'arbres',
  'arbres-fruitiers': 'arbres-fruitiers',
  arbustes: 'arbustes',
  caducs: 'caducs',
  persistants: 'persistants',
  exotiques: 'exotiques',
  'petits-fruits-et-legumes': 'petits-fruits-et-legumes',
  'plantes-aromatiques': 'plantes-aromatiques',
  'plantes-grimpantes': 'plantes-grimpantes',
  'plantes-vivaces': 'vivaces',
  rosiers: 'rosiers',
}

export const legacyRedirects = [
  ...Object.entries(vegetaux).map(([from, to]) => ({
    source: `/${from}`,
    destination: `/categorie-produit/vegetaux/${to}`,
    permanent: true,
  })),
  { source: '/nos-vegetaux', destination: '/categorie-produit/vegetaux', permanent: true },
  { source: '/robots-tondeuses', destination: '/categorie-produit/motocultures/robots-tondeuses', permanent: true },
  { source: '/boutique', destination: '/nos-produits', permanent: true },
  { source: '/categorie-produit/promotion', destination: '/promo', permanent: true },
  { source: '/mon-compte', destination: '/panier', permanent: true },
]
