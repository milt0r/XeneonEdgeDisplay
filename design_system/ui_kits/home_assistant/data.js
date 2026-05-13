// Home-Assistant entity fixtures. Each entity follows the HA REST shape
// (entityId, state, attributes) closely enough that detail components can
// reuse logic from the upstream code.

const ENTITY_FIXTURES = [
  // ---- Living Room ----
  {
    entityId: 'light.living_room_floor_lamp',
    state: 'on',
    area: 'Living Room',
    attributes: {
      friendly_name: 'Living Rm — Floor Lamp',
      brightness: 199,             // 0-255 → 78%
      color_temp_kelvin: 3200,
      min_color_temp_kelvin: 2200,
      max_color_temp_kelvin: 6500,
      supported_color_modes: ['color_temp', 'brightness']
    }
  },
  {
    entityId: 'light.living_room_ceiling',
    state: 'on',
    area: 'Living Room',
    attributes: { friendly_name: 'Living Rm — Ceiling', brightness: 102, supported_color_modes: ['brightness'] }
  },
  {
    entityId: 'climate.main_floor',
    state: 'heat',
    area: 'Living Room',
    attributes: {
      friendly_name: 'Main Floor — Thermostat',
      current_temperature: 68,
      temperature: 72,
      min_temp: 60, max_temp: 85, target_temp_step: 1,
      unit_of_measurement: '°F',
      hvac_modes: ['off', 'heat', 'cool', 'heat_cool', 'fan_only', 'dry']
    }
  },
  {
    entityId: 'media_player.living_room_tv',
    state: 'playing',
    area: 'Living Room',
    attributes: {
      friendly_name: 'Living Rm — TV',
      media_title: 'The Last of Us · S2E4',
      media_artist: 'HBO Max',
      volume_level: 0.42,
      source: 'HBO Max',
      source_list: ['Plex', 'HBO Max', 'Netflix', 'YouTube', 'Spotify', 'AirPlay']
    }
  },

  // ---- Kitchen ----
  {
    entityId: 'media_player.kitchen_sonos',
    state: 'playing',
    area: 'Kitchen',
    attributes: {
      friendly_name: 'Kitchen Speaker',
      media_title: 'Atomic Heart Bar',
      media_artist: 'Mick Gordon · Doom Eternal OST',
      volume_level: 0.55,
      source: 'spotify',
      source_list: ['spotify', 'tunein', 'aux', 'airplay']
    }
  },
  {
    entityId: 'light.kitchen_under_cabinet',
    state: 'off',
    area: 'Kitchen',
    attributes: { friendly_name: 'Kitchen — Under-cabinet', brightness: 0, supported_color_modes: ['brightness'] }
  },
  {
    entityId: 'sensor.kitchen_temperature',
    state: '71',
    area: 'Kitchen',
    attributes: { friendly_name: 'Kitchen Temp', unit_of_measurement: '°F', device_class: 'temperature' }
  },

  // ---- Office ----
  {
    entityId: 'switch.office_amp',
    state: 'on',
    area: 'Office',
    attributes: { friendly_name: 'Office — Amp' }
  },
  {
    entityId: 'fan.office_ceiling',
    state: 'on',
    area: 'Office',
    attributes: { friendly_name: 'Office — Ceiling Fan', percentage: 60 }
  },
  {
    entityId: 'scene.evening',
    state: 'scening',
    area: 'Office',
    attributes: { friendly_name: 'Evening Scene' }
  },
  {
    entityId: 'sensor.cpu_temp',
    state: '64',
    area: 'Office',
    attributes: { friendly_name: 'PC — CPU Temp', unit_of_measurement: '°C', device_class: 'temperature' }
  },

  // ---- Outdoor ----
  {
    entityId: 'lock.front_door',
    state: 'locked',
    area: 'Outdoor',
    attributes: { friendly_name: 'Front Door' }
  },
  {
    entityId: 'cover.garage_door',
    state: 'open',
    area: 'Outdoor',
    attributes: { friendly_name: 'Garage Door', current_position: 100 }
  },
  {
    entityId: 'camera.porch',
    state: 'recording',
    area: 'Outdoor',
    attributes: { friendly_name: 'Porch Camera' }
  },
  {
    entityId: 'sensor.outdoor_temperature',
    state: '64',
    area: 'Outdoor',
    attributes: { friendly_name: 'Outdoor Temp', unit_of_measurement: '°F', device_class: 'temperature' }
  },
  {
    entityId: 'binary_sensor.front_motion',
    state: 'on',
    area: 'Outdoor',
    attributes: { friendly_name: 'Front Motion', device_class: 'motion', last_triggered: '2 min ago' }
  },

  // ---- Extra domains (added in iteration 3) ----
  {
    entityId: 'weather.home',
    state: 'partlycloudy',
    area: 'Outdoor',
    attributes: {
      friendly_name: 'Detroit · Home',
      temperature: 64, apparent_temperature: 61,
      humidity: 47, wind_speed: 12,
      temperature_unit: '°F',
      forecast: [
        { day: 'FRI', high: 67, low: 52, condition: 'partlycloudy' },
        { day: 'SAT', high: 71, low: 55, condition: 'sunny' },
        { day: 'SUN', high: 58, low: 49, condition: 'rainy' },
        { day: 'MON', high: 63, low: 51, condition: 'cloudy' }
      ]
    }
  },
  {
    entityId: 'person.mark',
    state: 'home',
    area: 'Outdoor',
    attributes: { friendly_name: 'Mark', battery: 78, source: 'iPhone 15 Pro', initials: 'MK' }
  },
  {
    entityId: 'person.hannah',
    state: 'not_home',
    area: 'Outdoor',
    attributes: { friendly_name: 'Hannah', battery: 42, source: 'iPhone 14', initials: 'HN', location: 'Downtown' }
  },
  {
    entityId: 'automation.morning_routine',
    state: 'on',
    area: 'Office',
    attributes: { friendly_name: 'Morning Routine', last_triggered: 'Today · 06:30', mode: 'single' }
  },
  {
    entityId: 'vacuum.roborock',
    state: 'docked',
    area: 'Living Room',
    attributes: { friendly_name: 'Roborock S8', battery_level: 92, status: 'Charging', fan_speed: 'balanced' }
  },
  {
    entityId: 'update.ha_core',
    state: 'on',
    area: 'Office',
    attributes: {
      friendly_name: 'Home Assistant Core',
      installed_version: '2026.5.1',
      latest_version: '2026.5.3',
      release_summary: 'Bug fixes + improved websocket reliability'
    }
  },
  {
    entityId: 'alarm_control_panel.house',
    state: 'armed_home',
    area: 'Outdoor',
    attributes: { friendly_name: 'House Alarm', supported_features: 47, code_format: 'number' }
  }
];

// Initial page layouts — entity id + size override per tile.
const INITIAL_PAGES = [
  {
    id: 'living', name: 'Living Room',
    tiles: [
      { entityId: 'light.living_room_floor_lamp', size: '1x2' },
      { entityId: 'climate.main_floor',           size: '2x1' },
      { entityId: 'media_player.living_room_tv',  size: '2x1' },
      { entityId: 'light.living_room_ceiling',    size: '1x1' },
      { entityId: 'vacuum.roborock',              size: '2x1' }
    ]
  },
  {
    id: 'kitchen', name: 'Kitchen',
    tiles: [
      { entityId: 'media_player.kitchen_sonos',   size: '2x2' },
      { entityId: 'light.kitchen_under_cabinet',  size: '1x1' },
      { entityId: 'sensor.kitchen_temperature',   size: '1x1' }
    ]
  },
  {
    id: 'office', name: 'Office',
    tiles: [
      { entityId: 'switch.office_amp',            size: '1x1' },
      { entityId: 'fan.office_ceiling',           size: '1x1' },
      { entityId: 'scene.evening',                size: '1x1' },
      { entityId: 'sensor.cpu_temp',              size: '2x1' },
      { entityId: 'automation.morning_routine',   size: '2x1' },
      { entityId: 'update.ha_core',               size: '2x1' }
    ]
  },
  {
    id: 'outdoor', name: 'Outdoor',
    tiles: [
      { entityId: 'camera.porch',                 size: '3x2' },
      { entityId: 'weather.home',                 size: '2x2' },
      { entityId: 'alarm_control_panel.house',    size: '2x1' },
      { entityId: 'lock.front_door',              size: '1x1' },
      { entityId: 'cover.garage_door',            size: '1x1' },
      { entityId: 'sensor.outdoor_temperature',   size: '1x1' },
      { entityId: 'binary_sensor.front_motion',   size: '1x1' },
      { entityId: 'person.mark',                  size: '1x1' },
      { entityId: 'person.hannah',                size: '1x1' }
    ]
  }
];

window.HA_ENTITIES = ENTITY_FIXTURES;
window.HA_INITIAL_PAGES = INITIAL_PAGES;
