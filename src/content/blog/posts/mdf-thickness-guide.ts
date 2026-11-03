import {definePost} from '../define';

export const mdfThicknessGuide = definePost({
  slug: 'mdf-thickness-guide',
  title: 'MDF Thickness Guide: Which Thickness for Which Job',
  description: 'From thin backing panels to thick tabletops: how to choose MDF and HDHMR thickness, with the thicknesses listed for Action TESA boards.',
  excerpt:
    'MDF comes in thicknesses from under 2 mm to 25 mm, and each band has its own job. A practical guide to matching thickness to backs, shutters, carcasses, panelling and tops.',
  category: 'mdf-guide',
  audiences: ['furniture-manufacturer', 'interior-designer', 'contractor'],
  applications: ['furniture', 'panelling', 'wardrobes', 'kitchens'],
  published: '2026-10-21',
  image: '/images/products/action-tesa-interior-grade-mdf-2.webp',
  imageAlt: 'Action TESA interior grade MDF sheets',
  blocks: [
    {
      type: 'p',
      text: 'Thickness is one of the easiest specifications to get wrong. Too thin and a shelf sags or a shutter bows; too thick and you add weight, cost and hardware problems for no benefit. MDF and HDHMR are made in a wide range of thicknesses, and each band tends to suit a particular set of jobs.'
    },
    {type: 'h2', id: 'thickness-bands', text: 'Thickness bands and their usual jobs'},
    {
      type: 'table',
      caption: 'General guidance. Loads, spans, hardware and finish all affect the final choice.',
      head: ['Band', 'Typical uses', 'Notes'],
      rows: [
        ['Under 4 mm', 'Drawer bottoms, cabinet backs, flexible cladding, templates', 'Needs support; not for spans on its own'],
        ['5–8 mm', 'Wardrobe and cabinet backs, panelling skins, lining', 'Fix into grooves or onto a frame'],
        ['9–12 mm', 'Drawer sides, light shelves, decorative panels, CNC jali work', 'Edge screw holding is limited at this thickness'],
        ['16–18 mm', 'Carcasses, shutters, shelves, partitions', 'The workhorse range for furniture'],
        ['25 mm', 'Tabletops, thick shelves, heavy-duty or feature panels', 'Heavy; check hardware and wall fixing']
      ]
    },
    {type: 'h2', id: 'listed-thicknesses', text: 'Thicknesses listed in the Ananta catalogue'},
    {
      type: 'p',
      text: 'Board thicknesses are often quoted with decimals because each manufacturer calibrates its own sizes. These are the options the Ananta catalogue lists for each Action TESA board:'
    },
    {
      type: 'table',
      caption: 'As listed on the Ananta product pages. Ask for current availability before finalising drawings.',
      head: ['Board', 'Listed thicknesses', 'Exposure'],
      rows: [
        ['[Interior Grade MDF](/products/mdf/interior-grade/action-tesa-interior-grade-mdf)', '1.90, 3.30, 5.50, 7.00, 11, 16.50, 25 mm', 'Dry interiors'],
        ['[Exterior Grade MDF](/products/mdf/exterior-grade/action-tesa-exterior-grade-mdf)', '3.30, 5.50, 7.30, 11, 17, 25 mm', 'Covered, humid and semi-outdoor areas'],
        ['[HDHMR Board](/products/mdf/hdhmr/action-tesa-hdhmr-board)', '3, 5.50, 7.50, 11, 16.75, 18, 25 mm', 'Humid areas such as kitchens and vanities']
      ]
    },
    {
      type: 'callout',
      tone: 'ananta',
      text: 'The catalogue lists the interior and HDHMR boards in 8 × 4 ft sheets. Action TESA states IS 12406 compliance for its interior and exterior MDF and a density of over 850 kg/m³ for HDHMR.'
    },
    {type: 'h2', id: 'shelves-and-spans', text: 'Shelves and spans'},
    {
      type: 'p',
      text: 'Fibre boards are generally more prone to sag than plywood over long, loaded spans. For bookshelves and pantry shelves, either keep spans short, add a centre support or a front lipping, or move up a thickness. A dense board such as HDHMR helps, but span still matters more than density.'
    },
    {type: 'h2', id: 'shutters', text: 'Shutters and doors'},
    {
      type: 'p',
      text: 'Shutters are usually made in the 16–18 mm band so that standard concealed hinges seat properly. Very tall shutters may need a thicker board, a stiffening frame or anti-warp hardware. Thinner boards in the 9–12 mm range are often used for profiled or grooved inlays set into a frame rather than as a full shutter.'
    },
    {type: 'h2', id: 'panelling', text: 'Wall panelling and CNC work'},
    {
      type: 'list',
      items: [
        '**Flat panelling skins:** thin boards fixed to a frame keep weight down.',
        '**Fluted or grooved panels:** choose a thickness that leaves enough material below the deepest groove.',
        '**CNC jali and cut-out screens:** the 9–12 mm band is common; thicker boards for free-standing screens.',
        '**Humid walls and bathrooms:** use [Exterior Grade MDF](/products/mdf/exterior-grade/action-tesa-exterior-grade-mdf) or HDHMR rather than interior grade.'
      ]
    },
    {
      type: 'callout',
      tone: 'caution',
      text: 'Thin boards still need sealing. Painted or laminated panels should be finished on both faces and every edge, or they may cup as humidity changes.'
    },
    {type: 'h2', id: 'weight-and-hardware', text: 'Weight, hardware and fixings'},
    {
      type: 'p',
      text: 'Fibre boards are generally heavier than plywood of the same thickness, and the difference adds up on large shutters and wall-hung units. Check hinge capacity against shutter size and weight, and use more hinges on tall doors. Screws into MDF faces hold well with correct pilot holes, but edge fixing is weaker, especially in thinner boards; use dowels, connectors or a solid lipping where joints carry load. For wall-hung cabinets, fix through a rail into the wall rather than relying on screws into the board edge.'
    },
    {type: 'h2', id: 'ordering', text: 'Ordering by thickness'},
    {
      type: 'list',
      ordered: true,
      items: [
        'Group panels on your cutting list by board type and thickness.',
        'Convert each group into sheets with the [Sheet Quantity Helper](/tools/sheet-calculator).',
        'Compare two boards’ published specifications in [Board Comparison](/tools/compare) if you are deciding between grades.',
        'Send the list for a price and confirm thickness availability before production.'
      ]
    },
    {
      type: 'products',
      title: 'MDF boards in the Ananta catalogue',
      slugs: ['action-tesa-interior-grade-mdf', 'action-tesa-exterior-grade-mdf', 'action-tesa-hdhmr-board']
    }
  ],
  faqs: [
    {
      q: 'What thickness of MDF is used for furniture?',
      a: 'Carcasses, shutters and shelves are most often made in the 16–18 mm band. Backs and drawer bottoms use thinner boards, and tabletops often use 25 mm.'
    },
    {
      q: 'Why are MDF thicknesses like 16.50 or 16.75 mm?',
      a: 'Manufacturers calibrate boards to their own nominal sizes. Use the exact listed thickness on drawings, especially where hardware, grooves or edge-banding depend on it.'
    },
    {
      q: 'Which MDF should I use in a bathroom?',
      a: 'Interior MDF is for dry areas. For humid rooms, the catalogue lists Action TESA Exterior Grade MDF and HDHMR. Seal all edges and keep them out of standing water.'
    }
  ],
  relatedProducts: ['action-tesa-interior-grade-mdf', 'action-tesa-exterior-grade-mdf', 'action-tesa-hdhmr-board'],
  relatedPosts: ['mdf-vs-plywood', 'what-is-hdhmr', 'estimating-sheet-quantities'],
  relatedTools: ['sheet-calculator', 'compare'],
  sources: [
    {label: 'Ananta product catalogue — Action TESA MDF and HDHMR thickness options', kind: 'ananta'},
    {label: 'Action TESA — plain MDF boards', url: 'https://www.actiontesa.com/products/plain-mdf-boards/', kind: 'manufacturer'},
    {label: 'Action TESA — plain HDHMR boards', url: 'https://www.actiontesa.com/products/plain-hdhmr-boards/', kind: 'manufacturer'}
  ]
});
