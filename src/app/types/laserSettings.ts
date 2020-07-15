export interface LaserSettings {
  axis: number;

  jump_delay_max: number;
  jump_delay_min: number;
  jump_speed: number;

  mark_delay: number;
  mark_speed: number;

  dot_distance: number;
  pulse_length: number;
  pulse_freq: number;

  mode: number;
}

export interface OutlineSettings {
  enabled: boolean;
  multiplier: number;
  laserSettings: LaserSettings;
}

export interface HatchSettings {
  multiplier: number;
  name: string;
  color: string;
  angle: number;
  hatchStep: number;
  interleavedFactor: number;

  isDefault: boolean;

  laserSettings: LaserSettings;
}

export interface HatchMatrixSettings {
  startSpeed: number;
  speedStepSize: number;
  startStep: number;
  hatchStepSize: number;
}

