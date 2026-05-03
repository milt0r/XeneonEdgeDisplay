import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { HAEntityState } from '@shared/types';
import { entityIcon, entityFriendlyName, entityUnit, isOnState } from './HaIcon';
import { BigSlider } from './BigSlider';

interface Props {
  entity: HAEntityState;
  onClose: () => void;
}

export function HaEntityDetail({ entity, onClose }: Props) {
  const domain = entity.entityId.split('.')[0];
  const name = entityFriendlyName(entity.entityId, entity.attributes);

  return createPortal(
    <div className="ha-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ha-detail">
        <div className="ha-detail-header">
          <span className="ha-detail-icon">{entityIcon(entity.entityId, entity.attributes, 28)}</span>
          <div className="ha-detail-titles">
            <div className="ha-detail-name">{name}</div>
            <div className="ha-detail-id mono">{entity.entityId}</div>
          </div>
          <button className="btn" onClick={onClose}>CLOSE ✕</button>
        </div>
        <div className="ha-detail-body">
          {domain === 'light' && <LightControls entity={entity} />}
          {domain === 'switch' && <ToggleControls entity={entity} />}
          {domain === 'input_boolean' && <ToggleControls entity={entity} />}
          {domain === 'fan' && <FanControls entity={entity} />}
          {domain === 'climate' && <ClimateControls entity={entity} />}
          {domain === 'media_player' && <MediaControls entity={entity} />}
          {domain === 'cover' && <CoverControls entity={entity} />}
          {domain === 'lock' && <LockControls entity={entity} />}
          {domain === 'scene' && <RunControls entity={entity} service="turn_on" label="ACTIVATE SCENE" />}
          {domain === 'script' && <RunControls entity={entity} service="turn_on" label="RUN SCRIPT" />}
          {domain === 'automation' && <RunControls entity={entity} service="trigger" label="TRIGGER" />}
          {domain === 'camera' && <CameraView entity={entity} />}
          {(domain === 'sensor' || domain === 'binary_sensor') && <SensorView entity={entity} />}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------- domain controls ---------- */

function call(domain: string, service: string, data?: Record<string, unknown>) {
  return window.api.ha.callService(domain, service, data);
}

function BigToggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button className={`big-toggle ${on ? 'on' : ''}`} onClick={onClick}>
      <span className="big-toggle-knob">{on ? 'ON' : 'OFF'}</span>
      <span className="big-toggle-label">{label}</span>
    </button>
  );
}

function ToggleControls({ entity }: { entity: HAEntityState }) {
  const on = isOnState(entity.state);
  const domain = entity.entityId.split('.')[0];
  return (
    <div className="ctrl-stack">
      <BigToggle
        on={on}
        label={on ? 'On' : 'Off'}
        onClick={() => call(domain, 'toggle', { entity_id: entity.entityId })}
      />
    </div>
  );
}

function LightControls({ entity }: { entity: HAEntityState }) {
  const on = isOnState(entity.state);
  const attrs: any = entity.attributes;
  const supportsBrightness = attrs.supported_color_modes?.some?.((m: string) =>
    ['brightness', 'color_temp', 'hs', 'rgb', 'rgbw', 'rgbww', 'xy', 'white'].includes(m)
  ) ?? attrs.brightness != null;
  const supportsColorTemp = attrs.supported_color_modes?.includes?.('color_temp') ?? attrs.color_temp_kelvin != null;

  const initialPct = Math.round(((attrs.brightness ?? 0) / 255) * 100);
  const [brightness, setBrightness] = useState(initialPct);
  const [kelvin, setKelvin] = useState<number>(attrs.color_temp_kelvin ?? 4000);
  const minK = attrs.min_color_temp_kelvin ?? 2200;
  const maxK = attrs.max_color_temp_kelvin ?? 6500;

  useEffect(() => { setBrightness(Math.round(((attrs.brightness ?? 0) / 255) * 100)); }, [attrs.brightness]);
  useEffect(() => { if (attrs.color_temp_kelvin) setKelvin(attrs.color_temp_kelvin); }, [attrs.color_temp_kelvin]);

  return (
    <div className="ctrl-stack">
      <BigToggle
        on={on}
        label={on ? 'On' : 'Off'}
        onClick={() => call('light', 'toggle', { entity_id: entity.entityId })}
      />
      {supportsBrightness && (
        <BigSlider
          label="Brightness"
          min={0}
          max={100}
          value={brightness}
          formatValue={(v) => `${v}%`}
          onChange={setBrightness}
          onCommit={(v) =>
            call('light', 'turn_on', { entity_id: entity.entityId, brightness_pct: v })
          }
        />
      )}
      {supportsColorTemp && (
        <BigSlider
          label="Color temperature"
          min={minK}
          max={maxK}
          step={50}
          value={kelvin}
          formatValue={(v) => `${v}K`}
          onChange={setKelvin}
          onCommit={(v) =>
            call('light', 'turn_on', { entity_id: entity.entityId, color_temp_kelvin: v })
          }
          color="linear-gradient(90deg, #ffb14a, #fff5e0, #c8e0ff)"
        />
      )}
    </div>
  );
}

function FanControls({ entity }: { entity: HAEntityState }) {
  const on = isOnState(entity.state);
  const attrs: any = entity.attributes;
  const supportsSpeed = attrs.percentage != null || attrs.preset_modes != null;
  const [pct, setPct] = useState<number>(attrs.percentage ?? 0);
  useEffect(() => { setPct(attrs.percentage ?? 0); }, [attrs.percentage]);
  return (
    <div className="ctrl-stack">
      <BigToggle on={on} label={on ? 'On' : 'Off'} onClick={() => call('fan', 'toggle', { entity_id: entity.entityId })} />
      {supportsSpeed && (
        <BigSlider
          label="Speed"
          min={0} max={100} value={pct}
          formatValue={(v) => `${v}%`}
          onChange={setPct}
          onCommit={(v) => call('fan', 'set_percentage', { entity_id: entity.entityId, percentage: v })}
        />
      )}
    </div>
  );
}

function ClimateControls({ entity }: { entity: HAEntityState }) {
  const attrs: any = entity.attributes;
  const cur = attrs.current_temperature;
  const tgt = attrs.temperature ?? cur ?? 20;
  const minT = attrs.min_temp ?? 7;
  const maxT = attrs.max_temp ?? 35;
  const stepT = attrs.target_temp_step ?? 0.5;
  const unit = attrs.unit_of_measurement ?? '°';
  const modes: string[] = attrs.hvac_modes ?? [];
  const [target, setTarget] = useState<number>(tgt);
  useEffect(() => { setTarget(attrs.temperature ?? attrs.current_temperature ?? 20); }, [attrs.temperature, attrs.current_temperature]);

  return (
    <div className="ctrl-stack">
      <div className="climate-readout">
        <div>
          <div className="metric-label">Current</div>
          <div className="metric-value" style={{ fontSize: 56 }}>{cur != null ? cur : '—'}<span className="sensor-unit">{unit}</span></div>
        </div>
        <div>
          <div className="metric-label">Mode</div>
          <div className="metric-value" style={{ fontSize: 32, textTransform: 'capitalize' }}>{entity.state}</div>
        </div>
      </div>
      <BigSlider
        label="Target"
        min={minT} max={maxT} step={stepT}
        value={target}
        formatValue={(v) => `${v.toFixed(stepT < 1 ? 1 : 0)}${unit}`}
        onChange={setTarget}
        onCommit={(v) => call('climate', 'set_temperature', { entity_id: entity.entityId, temperature: v })}
      />
      {modes.length > 0 && (
        <div className="mode-row">
          {modes.map((m) => (
            <button
              key={m}
              className={`chip ${entity.state === m ? 'active' : ''}`}
              onClick={() => call('climate', 'set_hvac_mode', { entity_id: entity.entityId, hvac_mode: m })}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MediaControls({ entity }: { entity: HAEntityState }) {
  const attrs: any = entity.attributes;
  const vol = Math.round((attrs.volume_level ?? 0) * 100);
  const [v, setV] = useState(vol);
  useEffect(() => { setV(Math.round((attrs.volume_level ?? 0) * 100)); }, [attrs.volume_level]);
  const sources: string[] = attrs.source_list ?? [];

  return (
    <div className="ctrl-stack">
      <div className="metric-label">Now playing</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)' }}>
        {attrs.media_title ?? entity.state}
      </div>
      {attrs.media_artist && <div className="muted">{attrs.media_artist}</div>}

      <div className="transport" style={{ marginTop: 12 }}>
        <button className="btn" onClick={() => call('media_player', 'media_previous_track', { entity_id: entity.entityId })}>⏮</button>
        <button className="btn" onClick={() => call('media_player', 'media_play_pause', { entity_id: entity.entityId })}>⏯</button>
        <button className="btn" onClick={() => call('media_player', 'media_next_track', { entity_id: entity.entityId })}>⏭</button>
        <button className="btn" onClick={() => call('media_player', 'media_stop', { entity_id: entity.entityId })}>⏹</button>
      </div>

      <BigSlider
        label="Volume"
        min={0} max={100} value={v}
        formatValue={(x) => `${x}%`}
        onChange={setV}
        onCommit={(x) => call('media_player', 'volume_set', { entity_id: entity.entityId, volume_level: x / 100 })}
      />

      {sources.length > 0 && (
        <div className="mode-row">
          {sources.slice(0, 12).map((s) => (
            <button
              key={s}
              className={`chip ${attrs.source === s ? 'active' : ''}`}
              onClick={() => call('media_player', 'select_source', { entity_id: entity.entityId, source: s })}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CoverControls({ entity }: { entity: HAEntityState }) {
  const attrs: any = entity.attributes;
  const pos = attrs.current_position ?? null;
  const [p, setP] = useState<number>(pos ?? 50);
  useEffect(() => { if (pos != null) setP(pos); }, [pos]);
  return (
    <div className="ctrl-stack">
      <div className="transport">
        <button className="btn" onClick={() => call('cover', 'open_cover', { entity_id: entity.entityId })}>OPEN</button>
        <button className="btn" onClick={() => call('cover', 'stop_cover', { entity_id: entity.entityId })}>STOP</button>
        <button className="btn" onClick={() => call('cover', 'close_cover', { entity_id: entity.entityId })}>CLOSE</button>
      </div>
      {pos != null && (
        <BigSlider
          label="Position"
          min={0} max={100} value={p}
          formatValue={(v) => `${v}%`}
          onChange={setP}
          onCommit={(v) => call('cover', 'set_cover_position', { entity_id: entity.entityId, position: v })}
        />
      )}
    </div>
  );
}

function LockControls({ entity }: { entity: HAEntityState }) {
  const locked = entity.state === 'locked';
  return (
    <div className="ctrl-stack">
      <BigToggle
        on={!locked}
        label={locked ? 'Locked' : 'Unlocked'}
        onClick={() => call('lock', locked ? 'unlock' : 'lock', { entity_id: entity.entityId })}
      />
    </div>
  );
}

function RunControls({ entity, service, label }: { entity: HAEntityState; service: string; label: string }) {
  const [pulsed, setPulsed] = useState(false);
  const domain = entity.entityId.split('.')[0];
  return (
    <div className="ctrl-stack" style={{ alignItems: 'center' }}>
      <button
        className={`big-toggle ${pulsed ? 'on' : ''}`}
        style={{ width: 360, height: 120 }}
        onClick={() => {
          call(domain, service, { entity_id: entity.entityId });
          setPulsed(true);
          setTimeout(() => setPulsed(false), 600);
        }}
      >
        <span className="big-toggle-knob">{label}</span>
      </button>
    </div>
  );
}

function CameraView({ entity }: { entity: HAEntityState }) {
  const [src, setSrc] = useState<string | null>(null);
  const refresh = async () => {
    const url = await window.api.ha.cameraSnapshot(entity.entityId);
    setSrc(url);
  };
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.entityId]);
  return (
    <div className="ctrl-stack">
      <div style={{ width: '100%', maxHeight: '60vh', overflow: 'hidden', borderRadius: 'var(--radius)' }}>
        {src ? <img src={src} alt={entity.entityId} style={{ width: '100%', height: 'auto', display: 'block' }} /> : <div className="muted">Loading…</div>}
      </div>
      <button className="btn" onClick={refresh}>REFRESH</button>
    </div>
  );
}

function SensorView({ entity }: { entity: HAEntityState }) {
  const unit = entityUnit(entity.attributes);
  return (
    <div className="ctrl-stack" style={{ alignItems: 'center' }}>
      <div className="metric-label">{(entity.attributes as any).device_class ?? 'value'}</div>
      <div className="metric-value" style={{ fontSize: 96 }}>
        {entity.state}<span className="sensor-unit">{unit}</span>
      </div>
      <div className="muted mono" style={{ fontSize: 11 }}>
        Last changed {new Date(entity.lastChanged).toLocaleString()}
      </div>
    </div>
  );
}
