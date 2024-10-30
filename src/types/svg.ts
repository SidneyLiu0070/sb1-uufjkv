export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Pollutant {
  id: string;
  type: 'G' | 'W' | 'S' | 'N';
  label: string;
  description: string;
}

export interface ProcessNode {
  id: string;
  title: string;
  description: string;
  pollutants: Pollutant[];
}

export interface SvgConfig {
  padding: number;
  minSpacing: number;
  scale: number;
}

export interface ViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export interface SvgGenerationOptions {
  showGrid?: boolean;
  debug?: boolean;
  scale?: number;
}