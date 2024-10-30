import { BoxBounds, ProcessCoordinates } from '../types/coordinates';
import { LAYOUT_CONSTANTS } from '../constants/layout';

export class ScaleCalculator {
  private static readonly MIN_SCALE = 0.5;
  private static readonly MAX_SCALE = 2.0;
  private static readonly TARGET_UTILIZATION = 0.75; // Target canvas utilization (75%)

  public static calculateOptimalScale(
    processCoordinates: ProcessCoordinates[],
    canvasWidth: number,
    canvasHeight: number
  ): number {
    const bounds = this.calculateTotalBounds(processCoordinates);
    
    // Calculate scale factors for both dimensions
    const scaleX = (canvasWidth * this.TARGET_UTILIZATION) / (bounds.right - bounds.left);
    const scaleY = (canvasHeight * this.TARGET_UTILIZATION) / (bounds.bottom - bounds.top);
    
    // Use the smaller scale to ensure everything fits
    let scale = Math.min(scaleX, scaleY);
    
    // Adjust based on number of nodes
    const nodeCount = this.countTotalNodes(processCoordinates);
    if (nodeCount <= 3) {
      scale *= 1.2; // Increase scale for few nodes
    } else if (nodeCount >= 10) {
      scale *= 0.8; // Decrease scale for many nodes
    }
    
    // Clamp to min/max values
    return Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, scale));
  }

  private static calculateTotalBounds(nodes: ProcessCoordinates[]): BoxBounds {
    const bounds: BoxBounds = {
      left: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY
    };

    nodes.forEach(node => {
      bounds.left = Math.min(bounds.left, node.bounds.left);
      bounds.right = Math.max(bounds.right, node.bounds.right);
      bounds.top = Math.min(bounds.top, node.bounds.top);
      bounds.bottom = Math.max(bounds.bottom, node.bounds.bottom);

      if (node.children) {
        const childBounds = this.calculateTotalBounds(node.children);
        bounds.left = Math.min(bounds.left, childBounds.left);
        bounds.right = Math.max(bounds.right, childBounds.right);
        bounds.top = Math.min(bounds.top, childBounds.top);
        bounds.bottom = Math.max(bounds.bottom, childBounds.bottom);
      }
    });

    // Add padding
    bounds.left -= LAYOUT_CONSTANTS.CANVAS.PADDING;
    bounds.right += LAYOUT_CONSTANTS.CANVAS.PADDING;
    bounds.top -= LAYOUT_CONSTANTS.CANVAS.PADDING;
    bounds.bottom += LAYOUT_CONSTANTS.CANVAS.PADDING;

    return bounds;
  }

  private static countTotalNodes(nodes: ProcessCoordinates[]): number {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? this.countTotalNodes(node.children) : 0);
    }, 0);
  }
}