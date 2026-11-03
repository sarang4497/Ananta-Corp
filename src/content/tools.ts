/**
 * Interactive tools registry — the ONE list used by the /tools hub, the
 * header mega navigation, the homepage tools section, site search, the
 * assistant and the sitemap. Only genuinely interactive tools belong here.
 */
import type {Href} from '@/data/products';

export type ToolSlug =
  | 'material-selector'
  | 'compare'
  | 'requirement-builder'
  | 'sheet-calculator'
  | 'finish-explorer';

export type Tool = {
  slug: ToolSlug;
  name: string;
  /** ≤ 60 chars, for nav/search rows. */
  short: string;
  description: string;
  href: Href;
  /** lucide-react icon name. */
  icon: 'Layers' | 'Columns2' | 'ClipboardList' | 'Calculator' | 'Palette';
  /** true → rendered at /tools/[tool]; false → lives at its own route. */
  route: boolean;
};

export const TOOLS: Tool[] = [
  {
    slug: 'material-selector',
    name: 'Material Selector',
    short: 'Application → exposure → the right board',
    description:
      'Pick where the material goes and how much moisture it sees; get the matching boards from the Ananta catalogue.',
    href: {pathname: '/tools/[tool]', params: {tool: 'material-selector'}},
    icon: 'Layers',
    route: true
  },
  {
    slug: 'compare',
    name: 'Board Comparison',
    short: 'Two boards, side by side, sourced specs only',
    description: 'Compare two boards on the attributes both actually publish — brand, grade, exposure, density, thickness.',
    href: {pathname: '/tools/[tool]', params: {tool: 'compare'}},
    icon: 'Columns2',
    route: true
  },
  {
    slug: 'requirement-builder',
    name: 'Requirement Builder',
    short: 'What are you sourcing? Build a quote request',
    description:
      'Choose your project, material and quantity; get the matching categories and send the requirement on WhatsApp or by enquiry.',
    href: {pathname: '/tools/[tool]', params: {tool: 'requirement-builder'}},
    icon: 'ClipboardList',
    route: true
  },
  {
    slug: 'sheet-calculator',
    name: 'Sheet Quantity Helper',
    short: 'Area → approximate number of 8 × 4 ft sheets',
    description:
      'Estimate how many standard 8 × 4 ft sheets cover a given panel area, with a wastage allowance. An estimate, not a cutting plan.',
    href: {pathname: '/tools/[tool]', params: {tool: 'sheet-calculator'}},
    icon: 'Calculator',
    route: true
  },
  {
    slug: 'finish-explorer',
    name: 'Finish Explorer',
    short: 'Search and shortlist prelam décors',
    description: 'Browse the Action TESA prelam décor range by family, search by name or code, shortlist and send on WhatsApp.',
    href: '/decor',
    icon: 'Palette',
    route: false
  }
];

export function toolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
