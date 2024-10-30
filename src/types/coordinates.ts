export interface Coordinates {
  x: number;
  y: number;
}

export interface BoxBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ProcessCoordinates {
  id: string;
  centerX: number;
  bounds: BoxBounds;
  children?: ProcessCoordinates[];
  isParallel?: boolean;
}

export interface CanvasMetrics {
  processNodes: ProcessCoordinates[];
  canvasBounds: BoxBounds;
  scale: number;
}