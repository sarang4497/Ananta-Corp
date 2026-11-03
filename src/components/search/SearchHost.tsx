'use client';

import dynamic from 'next/dynamic';
import {useCallback, useEffect, useRef, useState} from 'react';

// The dialog (and the search index it imports) is a separate chunk, loaded
// on first open only.
const SearchDialog = dynamic(() => import('./SearchDialog'), {ssr: false});

/**
 * Site-search host, mounted once in the layout. Opens on:
 *   - window `open-search` (detail?: {q?: string}) — header, mobile menu, dock;
 *   - ⌘K / Ctrl-K anywhere, and "/" when not typing in a field.
 * Sets html[data-search-open] (the contact dock steps aside) and restores
 * focus to the element that opened it.
 */
export function SearchHost() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState('');
  const [nonce, setNonce] = useState(0);
  const opener = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);
  const closeRef = useRef<() => void>(() => {});

  const show = useCallback((q = '') => {
    if (!openRef.current) opener.current = document.activeElement as HTMLElement | null;
    setSeed(q);
    setNonce((n) => n + 1);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => show((e as CustomEvent<{q?: string} | undefined>).detail?.q ?? '');
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (openRef.current) closeRef.current();
        else show('');
        return;
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        if (t?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
        e.preventDefault();
        show('');
      }
    };
    window.addEventListener('open-search', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-search', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, [show]);

  useEffect(() => {
    openRef.current = open;
    const html = document.documentElement;
    if (open) html.dataset.searchOpen = '1';
    else delete html.dataset.searchOpen;
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    const el = opener.current;
    opener.current = null;
    if (el && document.contains(el)) requestAnimationFrame(() => el.focus());
  }, []);

  useEffect(() => {
    closeRef.current = close;
  }, [close]);

  if (!open) return null;
  return <SearchDialog key={nonce} initialQuery={seed} onClose={close} />;
}
