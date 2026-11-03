import {definePost} from '../define';

export const estimatingSheetQuantities = definePost({
  slug: 'estimating-sheet-quantities',
  title: 'Estimating Sheet Quantities for a Furniture Project',
  description: 'A step-by-step way to turn drawings into an approximate count of 8 × 4 ft sheets, with a worked example, wastage allowance and common mistakes.',
  excerpt:
    'From a cutting list to a sheet count you can price. How to group panels, work out area, allow for wastage and sense-check the number before ordering.',
  category: 'project-sourcing',
  audiences: ['contractor', 'interior-designer', 'furniture-manufacturer', 'builder'],
  applications: ['furniture', 'wardrobes', 'kitchens'],
  published: '2026-10-09',
  image: '/images/scenes/living-wood.webp',
  imageAlt: 'Interior with wood-finish furniture and wall panelling',
  blocks: [
    {
      type: 'p',
      text: 'An early, reasonable sheet count makes every later step easier: you can get a meaningful price, check budget against design, and avoid both a mid-project shortage and a stack of unused boards. The method below gives an estimate quickly. It is not a substitute for a proper cutting plan, but it is close enough to start a conversation with your supplier.'
    },
    {type: 'h2', id: 'sheet-size', text: 'Know your sheet'},
    {
      type: 'p',
      text: 'Many boards in the Ananta catalogue — Duroply MR and BWP plywood, Action TESA interior MDF and HDHMR among them — are listed in standard **8 × 4 ft** sheets. That is 32 sq ft per sheet — roughly 2.44 × 1.22 m, or about 2.97 m². Always confirm the sheet size of the specific board, because some products are offered in other sizes or custom sizes on bulk orders.'
    },
    {type: 'h2', id: 'group-panels', text: 'Step 1: Group panels by board and thickness'},
    {
      type: 'p',
      text: 'Sheets are ordered by board type and thickness, so the estimate must be too. Make one group for each combination — for example 18 mm BWP plywood for the sink run, 17 mm prelam in white for wardrobe carcasses, 18 mm HDHMR for shutters, and thin MDF for backs. Mixing them gives a total that you cannot actually order.'
    },
    {type: 'h2', id: 'add-area', text: 'Step 2: Add up the panel area in each group'},
    {
      type: 'p',
      text: 'For each panel, multiply length by width and count how many there are. Work in one unit throughout — square feet is convenient when the sheet is 8 × 4 ft. Include shelves, dividers, backs, drawer parts and filler strips; small parts add up.'
    },
    {
      type: 'table',
      caption: 'Worked example: one wardrobe, 17 mm carcass group only. Sizes are illustrative.',
      head: ['Panel', 'Size (ft)', 'Qty', 'Area (sq ft)'],
      rows: [
        ['Side panels', '7 × 2', '3', '42'],
        ['Top and bottom', '6 × 2', '2', '24'],
        ['Fixed shelves', '3 × 1.75', '6', '31.5'],
        ['Loft base and top', '6 × 2', '2', '24'],
        ['Total', '', '', '121.5']
      ]
    },
    {type: 'h2', id: 'wastage', text: 'Step 3: Add a wastage allowance'},
    {
      type: 'p',
      text: 'Not every square foot of a sheet becomes a panel. Saw kerfs, edge trimming, grain direction and awkward panel sizes all leave offcuts. Agree an allowance with your fabricator based on the design and their cutting method — simple box carcasses waste less than designs with many large or odd-sized parts. In the example, a 10% allowance gives 121.5 × 1.10 ≈ 133.7 sq ft.'
    },
    {type: 'h2', id: 'convert', text: 'Step 4: Convert to sheets and round up'},
    {
      type: 'p',
      text: 'Divide by 32 and round up to a whole sheet: 133.7 ÷ 32 ≈ 4.2, so plan for **5 sheets**. The [Sheet Quantity Helper](/tools/sheet-calculator) does this arithmetic for you, including the wastage allowance.'
    },
    {
      type: 'callout',
      tone: 'general',
      title: 'Sense-check against the largest parts',
      text: 'An area estimate can be too low when panels are large. In the example, two 7 × 2 ft side panels fill an 8 × 4 ft sheet side by side and leave only a 1 × 4 ft strip, so the three sides alone take two sheets with little usable offcut. When panels are close to the sheet size, lay out the largest ones on a sketch of the sheet before trusting the area figure.'
    },
    {type: 'h2', id: 'common-mistakes', text: 'Common mistakes'},
    {
      type: 'list',
      items: [
        '**Forgetting backs and drawer bottoms**, which are usually a different, thinner board.',
        '**Ignoring grain or décor direction**, which limits how parts can be rotated on the sheet.',
        '**Mixing thicknesses** in one total.',
        '**Skipping shutters and fillers** until late in the design.',
        '**Not allowing for a spare sheet** on large jobs where a damaged panel would stop work.'
      ]
    },
    {type: 'h2', id: 'edge-banding', text: 'Don’t forget edge-banding'},
    {
      type: 'p',
      text: 'While you have the cutting list open, add up the length of every visible edge per board and colour. Edge-banding is ordered by length and colour, and running short of a matching tape holds up production as surely as running short of boards.'
    },
    {type: 'h2', id: 'send-the-list', text: 'Send the list for a price'},
    {
      type: 'p',
      text: 'Once each group has a sheet count, send it with board, thickness, quantity and city through the [Requirement Builder](/tools/requirement-builder) or on WhatsApp. If you are still choosing boards, start with the [Material Selector](/tools/material-selector).'
    },
    {
      type: 'products',
      title: 'Boards from the Ananta catalogue',
      slugs: ['duroply-mr-moisture-resistant-plywood', 'action-tesa-hdhmr-board', 'action-tesa-prelam-particle-board-1103-frosty-white', 'action-tesa-interior-grade-mdf']
    }
  ],
  faqs: [
    {
      q: 'How many square feet are in an 8 × 4 ft sheet?',
      a: '32 sq ft, or about 2.97 m². Divide your total panel area (with wastage) by 32 and round up to get an approximate sheet count.'
    },
    {
      q: 'How much wastage should I allow?',
      a: 'It depends on the design and cutting method. Agree it with your fabricator; designs with many large or odd-sized panels need a larger allowance than simple carcasses.'
    },
    {
      q: 'Is the Sheet Quantity Helper a cutting plan?',
      a: 'No. It gives an area-based estimate for pricing and planning. A fabricator’s cutting optimisation gives the final count.'
    },
    {
      q: 'Can I order custom sheet sizes?',
      a: 'Some products list custom sizes on request for bulk orders — for example Duroply BWP plywood and Duro flush doors. Ask with your requirement.'
    }
  ],
  relatedProducts: ['duroply-mr-moisture-resistant-plywood', 'duroply-bwp-boiling-water-proof-plywood', 'action-tesa-hdhmr-board', 'action-tesa-prelam-particle-board-1103-frosty-white'],
  relatedPosts: ['boards-for-modular-kitchens', 'mdf-thickness-guide'],
  relatedTools: ['sheet-calculator', 'requirement-builder', 'material-selector'],
  sources: [
    {label: 'Ananta product catalogue — listed sheet sizes', kind: 'ananta'},
    {label: 'Standard arithmetic for area-based sheet estimates', kind: 'general'}
  ]
});
