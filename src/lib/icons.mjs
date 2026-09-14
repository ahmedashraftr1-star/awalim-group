/* ==========================================================================
   icons.mjs — one consistent line icon set (1.5px stroke, 24 viewBox).
   Every icon is inline SVG so it inherits currentColor and needs no request.
   Directional arrows are drawn pointing to the INLINE-END of an RTL page
   (i.e. left); CSS flips them for [dir="ltr"] contexts.
   ========================================================================== */

const wrap = (paths, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${paths}</svg>`;

export const icons = {
  // navigation / actions
  arrow:    wrap('<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>'),        // points inline-end (left in RTL)
  arrowUp:  wrap('<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>'),
  external: wrap('<path d="M14 5h5v5"/><path d="M19 5l-9 9"/><path d="M19 14v5H5V5h5"/>'),
  check:    wrap('<path d="M20 6L9 17l-5-5"/>', ' stroke-width="2.2"'),
  plus:     wrap('<path d="M12 5v14M5 12h14"/>'),
  close:    wrap('<path d="M6 6l12 12M18 6L6 18"/>'),
  menu:     wrap('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  moon:     wrap('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'),
  sun:      wrap('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  whatsapp: wrap('<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9.5 9.5c.2 1.6 1.8 3.4 3.5 4l1.3-1a.6.6 0 0 1 .7 0l1.3 1c.3.2.3.5.1.8-.6.8-1.5 1.2-2.4 1-2.6-.6-5-3-5.6-5.6-.2-.9.2-1.8 1-2.4.3-.2.6-.2.8.1l1 1.3a.6.6 0 0 1 0 .7l-1 1.1Z"/>'),
  mail:     wrap('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  star:     wrap('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>'),
  globe:    wrap('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  award:    wrap('<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5"/>'),
  lock:     wrap('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),

  // feature icons
  ledger:   wrap('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  layers:   wrap('<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>'),
  calendar: wrap('<path d="M16 3v4M8 3v4M3 10h18"/><rect x="3" y="5" width="18" height="16" rx="2"/>'),
  camera:   wrap('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><circle cx="12" cy="13" r="3"/>'),
  compass:  wrap('<path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l7 3"/>'),
  shield:   wrap('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12l2 2 4-4"/>'),
  users:    wrap('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M17.5 13.5a6.5 6.5 0 0 1 4 6.5"/>'),
  spark:    wrap('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z"/>'),
  ear:      wrap('<path d="M6 10a6 6 0 0 1 12 0c0 3-2 4-2 7a3 3 0 0 1-6 0"/><path d="M9 10a3 3 0 0 1 6 0c0 1.5-1 2-1 3"/>'),
  a11y:     wrap('<circle cx="12" cy="4.5" r="1.5"/><path d="M4 8.5l8 1.5 8-1.5M12 10v5M9 21l3-6 3 6"/>'),
  cart:     wrap('<path d="M3 4h2l2.4 11h11l2-7H7"/><circle cx="9" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/>'),
  rtl:      wrap('<path d="M20 6h-9a3 3 0 0 0 0 6h2v8M15 6v14"/><path d="M7 15l-3 3 3 3"/><path d="M4 18h6"/>'),
  gauge:    wrap('<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.5"/>'),
  card:     wrap('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>'),
  tokens:   wrap('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/>'),
  glass:    wrap('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 16l8-8"/><path d="M12 16l4-4"/>'),
  search:   wrap('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>'),
  book:     wrap('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>'),
  flow:     wrap('<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6.5 7.5L11 16M17.5 7.5L13 16"/>'),
  swap:     wrap('<path d="M4 8h13l-3-3M20 16H7l3 3"/>'),
  phone:    wrap('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
  browser:  wrap('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6.5 6.5h.01M9 6.5h.01"/>'),
  pdf:      wrap('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>'),
  clock:    wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  pin:      wrap('<path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/>'),
  code:     wrap('<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>'),
  kanban:   wrap('<path d="M4 4h4v16H4V4zm6 0h4v10h-4V4zm6 0h4v6h-4V4z"/>'),
  pulse:    wrap('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
  terminal: wrap('<path d="M4 17l6-6-6-6M12 19h8"/>'),
  crown:     wrap('<path d="M4 19h16M4 15l3-7 5 5 5-5 3 7H4z"/>'),
  bolt:      wrap('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'),
  flask:     wrap('<path d="M10 2v7.3a2 2 0 0 1-.4 1.2l-4.3 6.4A2 2 0 0 0 7 20h10a2 2 0 0 0 1.7-3.1l-4.3-6.4a2 2 0 0 1-.4-1.2V2"/><path d="M8.5 2h7M7 16h10"/>'),
  building:  wrap('<path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/>'),
  briefcase: wrap('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
  settings:  wrap('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'),
  rocket:    wrap('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4.5c1.2-1.2 3-1.5 3-1.5M15 9V4s3.03.55 4.5 2c1.2 1.2 1.5 3 1.5 3"/>'),
  ambulance: wrap('<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10H8v7h1M6 17H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1h13c.6 0 1 .4 1 1v4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M7 8h4M9 6v4"/>'),
  newspaper: wrap('<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/>'),
  database:  wrap('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>'),
  clipboard: wrap('<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'),
  feather:   wrap('<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9"/>'),
  eye:       wrap('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
  copy:      wrap('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  refresh:   wrap('<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'),
  flame:     wrap('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
  feed:      wrap('<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>'),
  checkCircle: wrap('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
  table:     wrap('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>')
};

export const icon = (name, cls = "") => {
  const svg = icons[name] || icons.spark;
  return cls ? svg.replace("<svg ", `<svg class="${cls}" `) : svg;
};
