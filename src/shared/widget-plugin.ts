import type { ComponentType } from 'react';

export interface WidgetSettingsField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'entity';
  options?: Array<{ label: string; value: string }>;
  default?: unknown;
}

export interface WidgetComponentProps<TConfig = Record<string, unknown>> {
  instanceId: string;
  config: TConfig;
  updateConfig(patch: Partial<TConfig>): void;
  /** Dashboard edit mode (drag/resize/remove). */
  editing: boolean;
  /** This widget's per-instance config panel is open (gear toggle). */
  configOpen: boolean;
}

export interface WidgetPlugin<TConfig = Record<string, unknown>> {
  id: string;
  title: string;
  description: string;
  category: 'system' | 'media' | 'home' | 'info' | 'utility' | 'plugin';
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  themeable: boolean;
  settingsSchema?: WidgetSettingsField[];
  defaultConfig?: TConfig;
  component: ComponentType<WidgetComponentProps<TConfig>>;
  /** If true, this is a stub/external plugin shown disabled in v1. */
  external?: boolean;
}
