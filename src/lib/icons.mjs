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
  code:     wrap('<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>')
};

export const icon = (name, cls = "") => {
  const svg = icons[name] || icons.spark;
  return cls ? svg.replace("<svg ", `<svg class="${cls}" `) : svg;
};
