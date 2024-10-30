import { ProcessNode, Position, Dimensions } from '../types/svg';
import { LAYOUT_CONSTANTS, POLLUTANT_COLORS } from '../constants/layout';
import { CoordinateTracker } from './coordinateTracker';
import { ScaleCalculator } from './scaleCalculator';

export class LayoutOptimizer {
  private coordinateTracker: CoordinateTracker;
  private centerX: number;

  constructor() {
    this.coordinateTracker = new CoordinateTracker();
    this.centerX = 0;
  }

  public optimizeLayout(nodes: ProcessNode[]): {
    positions: Map<string, Position>;
    dimensions: Dimensions;
    bounds: { left: number; right: number; bottom: number };
  } {
    const positions = new Map<string, Position>();
    
    // Calculate initial dimensions based on content
    const initialWidth = this.calculateInitialWidth(nodes);
    this.centerX = initialWidth / 2;

    // Position main process nodes along center line
    this.positionMainProcessNodes(nodes, positions);

    // Position pollutants
    this.positionPollutants(nodes, positions);

    // Get bounds from coordinate tracker
    const trackerBounds = this.coordinateTracker.getCanvasBounds();

    // Add padding to bounds
    const paddedBounds = {
      left: trackerBounds.left - LAYOUT_CONSTANTS.CANVAS.PADDING,
      right: trackerBounds.right + LAYOUT_CONSTANTS.CANVAS.PADDING,
      bottom: trackerBounds.bottom + LAYOUT_CONSTANTS.CANVAS.PADDING
    };

    // Add space for legend (80px spacing + 150px legend width)
    const legendSpace = 230;
    
    // Calculate final dimensions
    const dimensions = {
      width: Math.max(
        LAYOUT_CONSTANTS.CANVAS.MIN_WIDTH,
        paddedBounds.right - paddedBounds.left + legendSpace
      ),
      height: Math.max(
        LAYOUT_CONSTANTS.CANVAS.MIN_HEIGHT,
        paddedBounds.bottom - trackerBounds.top + LAYOUT_CONSTANTS.CANVAS.PADDING
      )
    };

    return {
      positions,
      dimensions,
      bounds: paddedBounds
    };
  }

  private calculateInitialWidth(nodes: ProcessNode[]): number {
    let maxPollutantsPerSide = 0;
    
    // Calculate maximum number of pollutants on either side
    nodes.forEach(node => {
      const leftPollutants = node.pollutants.filter(p => 
        POLLUTANT_COLORS[p.type].position === 'left'
      ).length;
      const rightPollutants = node.pollutants.filter(p => 
        POLLUTANT_COLORS[p.type].position === 'right'
      ).length;
      
      maxPollutantsPerSide = Math.max(
        maxPollutantsPerSide,
        leftPollutants,
        rightPollutants
      );
    });

    // Calculate width needed for pollutant groups
    const pollutantGroupWidth = maxPollutantsPerSide * LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH +
                               (maxPollutantsPerSide - 1) * LAYOUT_CONSTANTS.POLLUTANT_BOX.SPACING +
                               2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER;

    // Calculate total width including process box and spacing
    const totalWidth = LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH +
                      2 * pollutantGroupWidth +
                      2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.OUTER;

    return Math.max(LAYOUT_CONSTANTS.CANVAS.MIN_WIDTH, totalWidth + 2 * LAYOUT_CONSTANTS.CANVAS.PADDING);
  }

  private positionMainProcessNodes(nodes: ProcessNode[], positions: Map<string, Position>): void {
    let currentY = LAYOUT_CONSTANTS.CANVAS.PADDING;

    nodes.forEach((node, index) => {
      const x = this.centerX - LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH / 2;
      const y = currentY;

      positions.set(node.id, { x, y });
      this.coordinateTracker.trackProcessBox(
        node.id,
        this.centerX,
        y,
        LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH,
        LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT
      );

      // Add vertical spacing between process boxes
      currentY += LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT + LAYOUT_CONSTANTS.PROCESS_BOX.SPACING.VERTICAL;
    });
  }

  private positionPollutants(nodes: ProcessNode[], positions: Map<string, Position>): void {
    nodes.forEach(node => {
      const processPos = positions.get(node.id);
      if (!processPos) return;

      const leftPollutants = node.pollutants.filter(p => 
        POLLUTANT_COLORS[p.type].position === 'left'
      );
      const rightPollutants = node.pollutants.filter(p => 
        POLLUTANT_COLORS[p.type].position === 'right'
      );

      // Position left pollutants
      if (leftPollutants.length > 0) {
        const groupWidth = this.calculatePollutantGroupWidth(leftPollutants.length);
        const startX = processPos.x - LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.OUTER - groupWidth;
        this.positionPollutantGroup(leftPollutants, startX, processPos.y, node.id, positions, 'left');
      }

      // Position right pollutants
      if (rightPollutants.length > 0) {
        const startX = processPos.x + LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH + 
                      LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.OUTER;
        this.positionPollutantGroup(rightPollutants, startX, processPos.y, node.id, positions, 'right');
      }
    });
  }

  private calculatePollutantGroupWidth(pollutantCount: number): number {
    return pollutantCount * LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH +
           (pollutantCount - 1) * LAYOUT_CONSTANTS.POLLUTANT_BOX.SPACING +
           2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER;
  }

  private positionPollutantGroup(
    pollutants: Array<{ id: string; type: string }>,
    startX: number,
    processY: number,
    processId: string,
    positions: Map<string, Position>,
    side: 'left' | 'right'
  ): void {
    // Center pollutant group vertically relative to process box
    const groupY = processY + (LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT - LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT) / 2;
    
    pollutants.forEach((pollutant, index) => {
      const x = startX + 
                LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER + 
                index * (LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH + LAYOUT_CONSTANTS.POLLUTANT_BOX.SPACING);
      const y = groupY;

      positions.set(`${processId}-${pollutant.id}`, { x, y });
      
      this.coordinateTracker.trackPollutantBox(processId, pollutant.id, {
        left: x,
        right: x + LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH,
        top: y,
        bottom: y + LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT
      });
    });
  }
}