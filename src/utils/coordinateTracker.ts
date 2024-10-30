import { ProcessCoordinates, BoxBounds, Coordinates } from '../types/coordinates';
import { LAYOUT_CONSTANTS } from '../constants/layout';

export class CoordinateTracker {
  private processCoordinates: Map<string, ProcessCoordinates>;
  private canvasBounds: BoxBounds;

  constructor() {
    this.processCoordinates = new Map();
    this.canvasBounds = {
      left: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY
    };
  }

  public trackProcessBox(
    id: string,
    centerX: number,
    y: number,
    width: number,
    height: number
  ): void {
    const bounds: BoxBounds = {
      left: centerX - width / 2,
      right: centerX + width / 2,
      top: y,
      bottom: y + height
    };

    this.processCoordinates.set(id, {
      id,
      centerX,
      bounds,
      children: []
    });

    this.updateCanvasBounds(bounds);
  }

  public trackParallelProcess(
    parentId: string,
    childId: string,
    coordinates: ProcessCoordinates
  ): void {
    const parent = this.processCoordinates.get(parentId);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      coordinates.isParallel = true;
      parent.children.push(coordinates);
      this.processCoordinates.set(childId, coordinates);
      this.updateCanvasBounds(coordinates.bounds);
    }
  }

  public trackPollutantBox(
    processId: string,
    pollutantId: string,
    bounds: BoxBounds
  ): void {
    const process = this.processCoordinates.get(processId);
    if (process) {
      process.bounds = {
        left: Math.min(process.bounds.left, bounds.left),
        right: Math.max(process.bounds.right, bounds.right),
        top: Math.min(process.bounds.top, bounds.top),
        bottom: Math.max(process.bounds.bottom, bounds.bottom)
      };
      this.updateCanvasBounds(bounds);
    }
  }

  public getProcessCoordinates(id: string): ProcessCoordinates | undefined {
    return this.processCoordinates.get(id);
  }

  public getAllProcessCoordinates(): ProcessCoordinates[] {
    return Array.from(this.processCoordinates.values());
  }

  public getCanvasBounds(): BoxBounds {
    return { ...this.canvasBounds };
  }

  private updateCanvasBounds(bounds: BoxBounds): void {
    this.canvasBounds = {
      left: Math.min(this.canvasBounds.left, bounds.left),
      right: Math.max(this.canvasBounds.right, bounds.right),
      top: Math.min(this.canvasBounds.top, bounds.top),
      bottom: Math.max(this.canvasBounds.bottom, bounds.bottom)
    };
  }

  public calculateConnectorPath(
    start: Coordinates,
    end: Coordinates,
    isParallel: boolean = false
  ): string {
    if (isParallel) {
      // For parallel processes, use a different curve
      const midY = (start.y + end.y) / 2;
      const controlX = Math.abs(end.x - start.x) * 0.5;
      return `M ${start.x} ${start.y} 
              C ${start.x + controlX} ${start.y}, 
                ${end.x - controlX} ${end.y}, 
                ${end.x} ${end.y}`;
    } else {
      // Standard vertical connection
      const midY = (start.y + end.y) / 2;
      return `M ${start.x} ${start.y} 
              C ${start.x} ${midY}, 
                ${end.x} ${midY}, 
                ${end.x} ${end.y}`;
    }
  }
}