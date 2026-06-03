'use client';

import dynamic from 'next/dynamic';

// Client-only, lazy: Leaflet needs `window`, and this keeps it out of the
// initial bundle. `isolate` scopes Leaflet's z-indexes from the rest of the UI.
const Map = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[30rem] w-full place-items-center bg-bg-soft text-sm text-muted">
      Loading map…
    </div>
  )
});

export function OfficeMap() {
  return (
    <div className="isolate h-full min-h-[30rem] overflow-hidden rounded-2xl border border-border shadow-card">
      <Map />
    </div>
  );
}
