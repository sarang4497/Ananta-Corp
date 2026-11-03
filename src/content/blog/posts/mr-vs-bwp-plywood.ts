import {definePost} from '../define';

export const mrVsBwpPlywood = definePost({
  slug: 'mr-vs-bwp-plywood',
  title: 'MR vs BWP Plywood: Grades, Resins and Where Each Belongs',
  description: 'MR and BWP plywood differ in bonding resin and the standards they are made to. Here is what that means for kitchens, wardrobes and wet areas.',
  excerpt:
    'The grade stamped on a plywood sheet is mostly about its glue. What MR and BWP actually mean, which Indian Standards they relate to, and how to specify each one without over- or under-buying.',
  category: 'plywood-guide',
  audiences: ['interior-designer', 'architect', 'contractor', 'homeowner'],
  applications: ['kitchens', 'wardrobes', 'wet-zones', 'furniture'],
  published: '2026-11-01',
  image: '/images/materials/plywood.webp',
  imageAlt: 'Close-up of a plywood sheet surface',
  blocks: [
    {
      type: 'p',
      text: 'Two sheets of plywood can look identical on the stack and still behave very differently once they are installed near water. The difference is the resin that bonds the veneers together. Interior MR plywood and BWP plywood are made for different exposure, and choosing between them is one of the first decisions in any furniture or interior specification.'
    },
    {type: 'h2', id: 'what-the-grades-mean', text: 'What MR and BWP mean'},
    {
      type: 'p',
      text: '**MR** stands for moisture resistant. It is an interior grade, generally bonded with urea formaldehyde (UF) resin, meant for furniture and fittings in normal indoor conditions — rooms that see everyday humidity but not direct or repeated wetting.'
    },
    {
      type: 'p',
      text: '**BWP** stands for boiling water proof. It is generally bonded with phenol formaldehyde (PF) resin, which forms a bond that holds up far better when the panel is exposed to water. The name refers to how the glue line performs in standard boil tests; it does not mean the wood itself cannot be damaged by water.'
    },
    {
      type: 'callout',
      tone: 'general',
      title: 'The standards in brief',
      text: 'In India, IS 303 is the standard for general-purpose plywood and covers interior grades such as MR. IS 710 is the standard generally associated with marine-grade plywood, made for demanding wet exposure. Always check which standard a manufacturer states for a specific product rather than assuming from the grade name alone.'
    },
    {type: 'h2', id: 'comparison', text: 'MR vs BWP at a glance'},
    {
      type: 'table',
      caption: 'Ananta catalogue values as listed on the Duroply product pages; standards as stated by Duroply.',
      head: ['', 'Duroply MR', 'Duroply BWP'],
      rows: [
        ['Grade', 'MR — moisture resistant', 'BWP — boiling water proof'],
        ['Bonding resin', 'Urea formaldehyde', 'Phenol formaldehyde'],
        ['Standard (as stated by Duroply)', 'IS 303 — MR grade for interior applications', 'IS 710 — BWP / marine grade'],
        ['Sheet size', '8 × 4 ft', '8 × 4 ft'],
        ['Thickness range', '4 – 25 mm', '4 – 25 mm'],
        ['Listed thickness options', '6, 8, 12, 16, 18 mm', '9, 12, 19 mm'],
        ['Typical uses', 'Furniture, wardrobes, bed frames, shelving, partitions', 'Kitchen cabinets, sink units, vanities, exterior furniture'],
        ['Not for', 'Areas directly exposed to water, such as sink cabinets', '—']
      ]
    },
    {type: 'h2', id: 'where-mr-works', text: 'Where MR plywood works well'},
    {
      type: 'list',
      items: [
        'Wardrobe carcasses, shelves and drawers in bedrooms.',
        'Bed frames, storage beds and study units.',
        'TV units, display units and wall partitions.',
        'Upper kitchen cabinets and areas with moderate moisture, away from the sink and dishwasher.'
      ]
    },
    {type: 'h2', id: 'where-bwp-is-worth-it', text: 'Where BWP is worth the upgrade'},
    {
      type: 'list',
      items: [
        'Sink base units and the cabinets on either side of them.',
        'Bathroom vanities and under-counter storage in wet rooms.',
        'Utility and wash areas, and cabinets near water purifiers or washing machines.',
        'Furniture in covered outdoor areas, finished and edge-sealed appropriately.'
      ]
    },
    {
      type: 'callout',
      tone: 'caution',
      text: 'Using BWP in a wet zone does not remove the need for detailing. Edge-band or seal every cut edge, finish both faces, and keep carcass bottoms off wet floors with legs or a plinth. Water that sits on an unsealed edge for long enough will eventually find its way in.'
    },
    {type: 'h2', id: 'mixing-grades', text: 'Mixing grades in one project'},
    {
      type: 'p',
      text: 'A sensible kitchen specification often uses both grades: BWP for the sink run and wet-side base units, MR for upper cabinets and tall units away from water. This keeps the higher-grade sheet where it adds real protection without paying for it on every panel. If you are comparing plywood with engineered boards for the same job, see [what HDHMR is](/blog/what-is-hdhmr) and our zone-by-zone [kitchen board guide](/blog/boards-for-modular-kitchens).'
    },
    {
      type: 'p',
      text: 'Label the grade on your cutting list and drawings. On site, sheets of different grades can be hard to tell apart once cut, and a single MR panel installed in a sink unit undoes the purpose of the specification.'
    },
    {type: 'h2', id: 'checking-on-delivery', text: 'Checking what arrives'},
    {
      type: 'list',
      ordered: true,
      items: [
        'Match the grade marking and brand on each sheet with the order.',
        'Check thickness with a caliper at a few points; note any variation.',
        'Look at the edges for gaps or overlaps in the core veneers.',
        'Check faces for open joints, patches and surface damage before cutting.',
        'Store sheets flat, off the floor and under cover until use.'
      ]
    },
    {
      type: 'products',
      title: 'Duroply plywood in the Ananta catalogue',
      slugs: ['duroply-mr-moisture-resistant-plywood', 'duroply-bwp-boiling-water-proof-plywood']
    }
  ],
  faqs: [
    {
      q: 'Can MR plywood be used in a kitchen?',
      a: 'It can be used for kitchen cabinets in areas with moderate moisture, such as upper units. For areas directly exposed to water, such as sink cabinets, BWP plywood is recommended.'
    },
    {
      q: 'Is BWP plywood the same as marine plywood?',
      a: 'They are closely related and the terms are often used together. Duroply lists its BWP plywood against IS 710, the standard generally associated with marine-grade plywood. Check the stated standard for any specific product.'
    },
    {
      q: 'Does BWP plywood need edge sealing?',
      a: 'Yes. The bond resists water far better than MR, but cut edges should still be edge-banded or sealed and the faces finished, especially in wet areas.'
    },
    {
      q: 'Which thicknesses are listed for Duroply BWP?',
      a: 'The Ananta catalogue lists 9, 12 and 19 mm options within a 4–25 mm range in 8 × 4 ft sheets. Custom sizes can be requested for bulk orders.'
    }
  ],
  relatedProducts: ['duroply-mr-moisture-resistant-plywood', 'duroply-bwp-boiling-water-proof-plywood', 'duro-flush-door'],
  relatedPosts: ['mdf-vs-plywood', 'boards-for-modular-kitchens'],
  relatedTools: ['compare', 'material-selector'],
  sources: [
    {label: 'Ananta product catalogue — Duroply MR and BWP plywood', kind: 'ananta'},
    {label: 'Duroply — FAQ (IS 303 and MR grade)', url: 'https://www.duroply.in/faq.php', kind: 'manufacturer'},
    {label: 'Duroply — plywood and blockboards', url: 'https://www.duroply.in/plywood-blockboards.php', kind: 'manufacturer'},
    {label: 'Bureau of Indian Standards — IS 303 and IS 710 (standard titles and scope)', kind: 'general'}
  ]
});
