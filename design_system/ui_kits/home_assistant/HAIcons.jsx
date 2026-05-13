// Inline-SVG icons mirroring source_repo/src/renderer/components/HaIcon.tsx.

const HASvg = ({ children, size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const HA_ICONS = {
  light:       (s) => <HASvg size={s}><circle cx="12" cy="9" r="5"/><path d="M9 18h6M10 21h4"/></HASvg>,
  switch:      (s) => <HASvg size={s}><rect x="3" y="9" width="18" height="6" rx="3"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/></HASvg>,
  fan:         (s) => <HASvg size={s}><circle cx="12" cy="12" r="2"/><path d="M12 2c2 4 0 7-3 8 3 1 4 4 3 8M22 12c-4 2-7 0-8-3-1 3-4 4-8 3"/></HASvg>,
  scene:       (s) => <HASvg size={s}><path d="M4 7h16M6 12h12M9 17h6"/></HASvg>,
  script:      (s) => <HASvg size={s}><path d="M7 4h7l4 4v12H7zM14 4v4h4"/><path d="M9 13h6M9 17h4"/></HASvg>,
  automation:  (s) => <HASvg size={s}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></HASvg>,
  media_player:(s) => <HASvg size={s}><polygon points="9,7 18,12 9,17" fill="currentColor" stroke="none"/></HASvg>,
  cover:       (s) => <HASvg size={s}><rect x="4" y="4" width="16" height="3"/><path d="M6 7v10M18 7v10M4 17h16M4 21h16"/></HASvg>,
  lock:        (s) => <HASvg size={s}><rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 016 0v3"/></HASvg>,
  climate:     (s) => <HASvg size={s}><path d="M14 14V5a2 2 0 10-4 0v9a4 4 0 104 0z"/><path d="M12 17v-7"/></HASvg>,
  camera:      (s) => <HASvg size={s}><path d="M3 7h4l2-2h6l2 2h4v12H3z"/><circle cx="12" cy="13" r="3.5"/></HASvg>,
  sensor:      (s) => <HASvg size={s}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></HASvg>,
  binary_sensor:(s)=> <HASvg size={s}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="9"/></HASvg>,
  weather:     (s) => <HASvg size={s}><circle cx="9" cy="13" r="4"/><path d="M13 9a4 4 0 015 4h-1M5 17h12"/></HASvg>,
  person:      (s) => <HASvg size={s}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/></HASvg>,
  vacuum:      (s) => <HASvg size={s}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/></HASvg>,
  update:      (s) => <HASvg size={s}><path d="M12 4v8M8 8l4-4 4 4"/><path d="M5 16a7 7 0 0014 0"/></HASvg>,
  alarm_control_panel: (s) => <HASvg size={s}><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6z"/><path d="M9 12l2 2 4-4"/></HASvg>,
  default:     (s) => <HASvg size={s}><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></HASvg>
};

const DEVICE_CLASS_ICONS = {
  temperature: (s) => <HASvg size={s}><path d="M14 14V5a2 2 0 10-4 0v9a4 4 0 104 0z"/><path d="M12 17v-7"/></HASvg>,
  motion:      (s) => <HASvg size={s}><circle cx="12" cy="5" r="2"/><path d="M9 9h6l-2 6 4 5M11 13l-3 7"/></HASvg>,
  humidity:    (s) => <HASvg size={s}><path d="M12 3s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z"/></HASvg>,
  door:        (s) => <HASvg size={s}><rect x="6" y="3" width="12" height="18"/><circle cx="14" cy="13" r="1" fill="currentColor" stroke="none"/></HASvg>
};

function entityIcon(entityId, attrs, size = 22) {
  const dc = attrs?.device_class;
  if (dc && DEVICE_CLASS_ICONS[dc]) return DEVICE_CLASS_ICONS[dc](size);
  const domain = entityId.split('.')[0];
  return (HA_ICONS[domain] || HA_ICONS.default)(size);
}

function entityFriendlyName(entityId, attrs) {
  return attrs?.friendly_name || entityId;
}

function entityUnit(attrs) {
  return attrs?.unit_of_measurement || '';
}

function isOnState(state) {
  return ['on', 'open', 'home', 'playing', 'unlocked', 'detected', 'active'].includes(state);
}

Object.assign(window, { entityIcon, entityFriendlyName, entityUnit, isOnState, HA_ICONS, HASvg });
