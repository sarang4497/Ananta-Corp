'use client';

import {MapContainer, TileLayer, Marker, Popup, Tooltip} from 'react-leaflet';
import type {LatLngBoundsExpression} from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Office = {name: string; label: string; address: string; pos: [number, number]; color: string};

// USA · Italy · India, each in a palette accent. `label` is the always-visible
// English pin label; `address` is shown in the click popup.
const OFFICES: Office[] = [
  {name: 'USA', label: 'USA · Aldie, VA', address: '41542 Carriage Horse Drive, Aldie, VA 20102, USA', pos: [38.978, -77.64], color: '#1877f2'},
  {name: 'Italy', label: 'Italy · Rome', address: 'Via di Selva Candida 20A, 00166 Roma (RM), Italy', pos: [41.926, 12.396], color: '#4f46e5'},
  {
    name: 'India',
    label: 'India · Ahmedabad',
    address: 'Radha Raman Shopping Center, 13 Dr Jivraj Mehta Marg, Paldi, Ahmedabad, Gujarat 380007, India',
    pos: [23.011, 72.561],
    color: '#f97316'
  }
];

// Branded teardrop pin (palette fill, white outline + centre dot, soft shadow).
function pin(color: string) {
  return L.divIcon({
    className: 'office-pin',
    html: `<svg width="32" height="42" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 6px rgba(21,24,59,0.35))"><path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/><circle cx="15" cy="15" r="5.5" fill="#ffffff"/></svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40]
  });
}

// Bounding box (SW → NE) covering all three offices — a wide inter-continental
// view so every pin is comfortably visible on load.
const BOUNDS: LatLngBoundsExpression = [
  [23.011, -77.64],
  [41.926, 72.561]
];

/**
 * Interactive world map with three branded office pins. Colorful CARTO Voyager
 * tiles (free, no key, Latin/English labels), fit to show all three at once.
 * Each pin carries an always-visible English label; the click popup shows the
 * full office address.
 */
export default function LeafletMap() {
  return (
    <MapContainer
      bounds={BOUNDS}
      boundsOptions={{padding: [50, 50]}}
      minZoom={1}
      scrollWheelZoom={false}
      worldCopyJump
      className="h-full min-h-[30rem] w-full"
      style={{background: '#eaf1fb'}}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {OFFICES.map((o) => (
        <Marker key={o.name} position={o.pos} icon={pin(o.color)}>
          {/* Always-visible English location label above the pin. */}
          <Tooltip permanent direction="top" offset={[0, -38]} className="office-label">
            {o.label}
          </Tooltip>
          <Popup>
            <strong style={{color: o.color}}>{o.name}</strong>
            <br />
            {o.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
