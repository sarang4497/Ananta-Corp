import {definePost} from '../define';

export const boardsForModularKitchens = definePost({
  slug: 'boards-for-modular-kitchens',
  title: 'Choosing Boards for a Modular Kitchen, Zone by Zone',
  description: 'A kitchen is several moisture zones in one room. How to choose between BWP plywood, HDHMR, HMR, MDF and prelam for each part of a modular kitchen.',
  excerpt:
    'The sink run, the hob, the tall unit and the wall cabinets each see different moisture and loads. A zone-by-zone way to specify kitchen boards without overspending or underbuilding.',
  category: 'buying-guides',
  audiences: ['interior-designer', 'architect', 'furniture-manufacturer', 'contractor', 'homeowner'],
  applications: ['kitchens', 'wet-zones'],
  published: '2026-10-27',
  image: '/images/scenes/kitchen.webp',
  imageAlt: 'Modern modular kitchen with wood-finish and white cabinets',
  blocks: [
    {
      type: 'p',
      text: 'A modular kitchen is not one environment. The cabinet under the sink sees splashes, leaks and wet utensils; the wall cabinet above the hob sees heat and steam; the tall pantry unit sees neither but carries weight on long shutters. Specifying one board for the whole kitchen either wastes money in the dry zones or puts the wrong material where water is.'
    },
    {type: 'h2', id: 'kitchen-zones', text: 'Think in zones, not in rooms'},
    {
      type: 'p',
      text: 'Before choosing materials, mark the plan into zones by exposure. The table below shows a common way to do it, with the board types typically considered for each. It is a starting point for discussion with your fabricator, not a rule.'
    },
    {
      type: 'table',
      caption: 'General guidance. Final selection depends on design, hardware, budget and site conditions.',
      head: ['Zone', 'Exposure', 'Boards typically considered', 'Detailing notes'],
      rows: [
        ['Sink base unit', 'Wet — splashes, leaks', 'BWP plywood, HDHMR', 'Seal all edges; aluminium or laminate base liner; raised legs'],
        ['Base units beside sink / dishwasher', 'Wet to humid', 'BWP plywood, HDHMR, HMR', 'Edge-band immediately after cutting'],
        ['Hob and cooking base', 'Humid, heat', 'HDHMR, HMR, BWP plywood', 'Keep a heat gap; follow appliance clearances'],
        ['Wall cabinets', 'Humid (steam)', 'HMR, HDHMR, MR plywood', 'Lighter boards ease wall fixing'],
        ['Tall / pantry units', 'Dry to humid', 'HDHMR, MR plywood, prelam', 'Long shutters need stiffness and good hinges'],
        ['Painted or profiled shutters', 'Depends on zone', 'Interior MDF (dry zones), HDHMR (humid zones)', 'Seal edges before painting'],
        ['Shelves and dividers', 'Varies', 'Match the carcass board', 'Check spans to avoid sag']
      ]
    },
    {type: 'h2', id: 'carcass', text: 'The carcass: where moisture resistance matters most'},
    {
      type: 'p',
      text: 'Most kitchen failures start at the carcass bottom and side panels near the sink, where water sits on edges. This is where [BWP plywood](/products/plywood/boiling-water-proof/duroply-bwp-boiling-water-proof-plywood) or a high-density moisture-resistant board such as [HDHMR](/products/mdf/hdhmr/action-tesa-hdhmr-board) is usually specified. Away from the wet side, [Moist Master HMR](/products/high-moisture-resistant-board-moist-master/moist-master/action-tesa-moist-master-hmr-board) is commonly used for carcasses that will be laminated.'
    },
    {
      type: 'callout',
      tone: 'ananta',
      title: 'What the catalogue says',
      text: 'The Ananta catalogue lists Duroply BWP plywood for kitchen cabinets, sink units and bathroom vanities, and Action TESA HDHMR and Moist Master HMR for modular kitchens. It lists Duroply MR plywood as not for areas directly exposed to water such as sink cabinets, and pre-laminated particle board as not for high-moisture zones.'
    },
    {type: 'h2', id: 'shutters', text: 'Shutters: finish first, then board'},
    {
      type: 'p',
      text: 'Shutter choice is usually driven by the finish. Laminated shutters work on HDHMR, HMR or plywood. Painted, PU or lacquered shutters generally need the smooth face of MDF or HDHMR. In a humid kitchen, a moisture-resistant core is the safer base for painted work; interior MDF is better kept for dry zones. Heavy tall-unit shutters benefit from a dense board that holds hinge screws firmly.'
    },
    {type: 'h2', id: 'thickness', text: 'Typical thicknesses'},
    {
      type: 'list',
      items: [
        '**Carcass sides, tops and bottoms:** commonly 16–18 mm.',
        '**Back panels:** commonly thin boards in the 6–9 mm range, depending on design.',
        '**Shutters:** commonly 16–19 mm, chosen to suit the hinge and handle system.',
        '**Shelves:** match the carcass, or go thicker for long spans.'
      ]
    },
    {
      type: 'p',
      text: 'Confirm against the thicknesses actually listed for your chosen board — for example HDHMR is listed at 16.75 and 18 mm among other options, Moist Master at 9, 12 and 18 mm, and Duroply BWP at 9, 12 and 19 mm. Our [MDF thickness guide](/blog/mdf-thickness-guide) covers the thinner boards in more detail.'
    },
    {type: 'h2', id: 'detailing', text: 'Detailing that protects any board'},
    {
      type: 'list',
      ordered: true,
      items: [
        'Edge-band every cut edge, including hidden ones inside the carcass.',
        'Use a liner or tray under the sink and seal around plumbing cut-outs.',
        'Raise base units on legs with a removable plinth so floors can be mopped without soaking panels.',
        'Laminate both faces of carcass panels to balance the board and close the surface.',
        'Leave ventilation gaps behind built-in appliances.'
      ]
    },
    {
      type: 'callout',
      tone: 'caution',
      text: 'Hob and chimney clearances come from the appliance manufacturer, not from the board supplier. Follow the installation manual for distances from combustible materials.'
    },
    {type: 'h2', id: 'next-steps', text: 'From zones to a material list'},
    {
      type: 'p',
      text: 'Once zones are marked, list panels by board and thickness, estimate the number of 8 × 4 ft sheets with the [Sheet Quantity Helper](/tools/sheet-calculator), and send the list through the [Requirement Builder](/tools/requirement-builder) for a price.'
    },
    {
      type: 'products',
      title: 'Kitchen boards in the Ananta catalogue',
      slugs: ['duroply-bwp-boiling-water-proof-plywood', 'action-tesa-hdhmr-board', 'action-tesa-moist-master-hmr-board', 'action-tesa-interior-grade-mdf']
    }
  ],
  faqs: [
    {
      q: 'Which board is best for a sink cabinet?',
      a: 'Sink units are a wet zone, so BWP plywood or a high-density moisture-resistant board such as HDHMR is typically used, with all edges sealed and a liner under the sink.'
    },
    {
      q: 'Can I use pre-laminated particle board in a kitchen?',
      a: 'The Ananta catalogue lists prelam boards for modular kitchens but not for high-moisture zones. Use them for dry-side units and choose HMR or HDHMR for the wet side.'
    },
    {
      q: 'Is HDHMR or BWP plywood better for kitchens?',
      a: 'Both are used in wet zones. HDHMR offers a smoother, more uniform surface for laminates; BWP plywood offers the strength of cross-laminated veneers. Many kitchens combine them.'
    },
    {
      q: 'Can painted MDF shutters be used in a kitchen?',
      a: 'Interior MDF suits dry zones. For humid areas near the sink or hob, a moisture-resistant core such as HDHMR is the safer base for painted shutters.'
    }
  ],
  relatedProducts: ['duroply-bwp-boiling-water-proof-plywood', 'action-tesa-hdhmr-board', 'action-tesa-moist-master-hmr-board', 'action-tesa-prelam-particle-board-1103-frosty-white'],
  relatedPosts: ['what-is-hdhmr', 'mr-vs-bwp-plywood', 'estimating-sheet-quantities'],
  relatedTools: ['material-selector', 'sheet-calculator', 'requirement-builder'],
  sources: [
    {label: 'Ananta product catalogue — kitchen-suitable boards and their listed limits', kind: 'ananta'},
    {label: 'Action TESA — plain HDHMR boards', url: 'https://www.actiontesa.com/products/plain-hdhmr-boards/', kind: 'manufacturer'},
    {label: 'Action TESA — Moist Master', url: 'https://www.actiontesa.com/products/moist-master/', kind: 'manufacturer'},
    {label: 'General modular kitchen fabrication practice', kind: 'general'}
  ]
});
