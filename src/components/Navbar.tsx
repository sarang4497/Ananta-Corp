import {Logo} from './Logo';
import {NavLinks} from './NavLinks';
import {MobileNav} from './MobileNav';

/**
 * White, solid, sticky navbar with a subtle hairline border. Server Component;
 * the links and mobile drawer are client leaves.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      {/* Solid white, pinned. Exact 4.32rem height (border-box incl. the 1px
          border) so a homepage hero can fill calc(100svh - 4.32rem) precisely.
          `items-center` keeps the cluster vertically centered in the bar. */}
      <div className="h-[4.32rem] border-b border-border bg-bg">
        <nav className="flex h-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-[var(--gutter)]">
          <Logo className="sm:ml-6 lg:ml-10" />

          <NavLinks className="ml-6 hidden nav:flex lg:ml-10" />

          {/* Mobile: hamburger drawer. */}
          <div className="flex items-center gap-3 nav:hidden">
            <MobileNav />
          </div>
        </nav>
      </div>
    </header>
  );
}
