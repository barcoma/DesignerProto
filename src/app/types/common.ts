export interface HatchLine {
  start: Point;
  end: Point;
}

export interface Point {
  x: number;
  y: number;
}

export interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

export interface RgbaColor extends RgbColor {
  alpha: number;
}

export interface LaserState {
  isLightOn: boolean;
  isVentilationOn: boolean;
  isDoorClosed: boolean;
  jobSize: number;
  remainingSize: number;
}
