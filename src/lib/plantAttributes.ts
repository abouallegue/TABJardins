// Attributs des végétaux : ils servent à la fois aux champs du back-office
// et aux filtres des pages catégories.
type Option = { label: string; value: string }

const opt = (label: string, value: string): Option => ({ label, value })

export const months: Option[] = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
].map((label, i) => opt(label, String(i + 1)))

export const plantAttributes = {
  exposure: {
    label: 'Exposition',
    options: [opt('Soleil', 'soleil'), opt('Mi-ombre', 'mi-ombre'), opt('Ombre', 'ombre')],
  },
  foliageColor: {
    label: 'Couleur du feuillage',
    options: [
      opt('Vert', 'vert'), opt('Vert foncé', 'vert-fonce'), opt('Panaché', 'panache'),
      opt('Pourpre', 'pourpre'), opt('Doré', 'dore'), opt('Gris / argenté', 'gris'),
    ],
  },
  flowerColor: {
    label: 'Couleur des fleurs',
    options: [
      opt('Blanc', 'blanc'), opt('Rose', 'rose'), opt('Rouge', 'rouge'), opt('Orange', 'orange'),
      opt('Jaune', 'jaune'), opt('Bleu', 'bleu'), opt('Violet', 'violet'), opt('Multicolore', 'multicolore'),
    ],
  },
  height: {
    label: 'Hauteur à maturité',
    options: [
      opt('Moins de 50 cm', 'lt-50'), opt('50 cm à 1 m', '50-100'), opt('1 à 2 m', '100-200'),
      opt('2 à 5 m', '200-500'), opt('Plus de 5 m', 'gt-500'),
    ],
  },
  foliage: {
    label: 'Persistance du feuillage',
    options: [opt('Caduc', 'caduc'), opt('Persistant', 'persistant'), opt('Semi-persistant', 'semi-persistant')],
  },
  hardiness: {
    label: 'Rusticité',
    options: [
      opt('Très rustique (< -15 °C)', 'tres-rustique'), opt('Rustique (-15 °C)', 'rustique'),
      opt('Assez rustique (-10 °C)', 'assez-rustique'), opt('Peu rustique (-5 °C)', 'peu-rustique'),
    ],
  },
  floweringMonths: { label: 'Période de floraison', options: months },
} as const

export type PlantAttributeKey = keyof typeof plantAttributes

export const labelFor = (key: PlantAttributeKey, value: string): string =>
  plantAttributes[key].options.find((o) => o.value === value)?.label ?? value
