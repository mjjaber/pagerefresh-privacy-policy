import { useEffect, useId, useRef, useState } from 'react';
import { copy } from '../content/en';
import { CloseIcon, MenuIcon } from './Icons';
import { Wordmark } from './Wordmark';

interface HeaderProps {
  /** Where the logo and section links point. "" on the main page, "./" from the privacy page. */
  homeHref?: string;
}

/**
 * Sticky site header. On small screens the section links collapse into a
 * simple show/hide menu (a disclosure, not a dialog, so no focus trap is
 * needed). `scroll-padding-top` in the stylesheet keeps anchored sections
 * and focused fields from hiding underneath it.
 */
export function Header({ homeHref = '' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const link = (hash: string) => `${homeHref}${hash}`;

  return (
    <header className="border-sage-dark/70 bg-warm-white/95 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="page-container flex min-h-[4.5rem] items-center justify-between gap-4">
        <a href={homeHref || '#top'} aria-label={copy.nav.homeLabel} className="-ml-1 rounded-xl p-1 no-underline">
          <Wordmark />
        </a>

        <nav aria-label={copy.nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {copy.nav.links.map((item) => (
              <li key={item.href}>
                <a
                  href={link(item.href)}
                  className="text-charcoal hover:bg-sage inline-flex min-h-11 items-center rounded-full px-4 font-semibold no-underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={link('#volunteer')} className="btn btn-primary min-h-11 px-5 max-[359px]:hidden">
            {copy.nav.volunteerButton}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="text-charcoal hover:bg-sage inline-flex size-11 cursor-pointer items-center justify-center rounded-full lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? copy.nav.closeMenu : copy.nav.openMenu}</span>
            {menuOpen ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label={`${copy.nav.label} (menu)`}
        hidden={!menuOpen}
        className="border-sage-dark/70 bg-warm-white border-t lg:hidden"
      >
        <ul className="page-container flex flex-col py-3">
          {copy.nav.links.map((item) => (
            <li key={item.href}>
              <a
                href={link(item.href)}
                onClick={() => setMenuOpen(false)}
                className="text-charcoal hover:bg-sage flex min-h-12 items-center rounded-xl px-3 text-lg font-semibold no-underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
