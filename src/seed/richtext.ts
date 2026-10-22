// Construit un contenu Lexical minimal (paragraphes et titres) à partir de texte brut.
type Block = string | { h2: string }

export const richText = (...blocks: Block[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: blocks.map((b) =>
      typeof b === 'string'
        ? {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            textFormat: 0,
            children: [{ type: 'text', text: b, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
          }
        : {
            type: 'heading',
            tag: 'h2',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ type: 'text', text: b.h2, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
          },
    ),
  },
})
