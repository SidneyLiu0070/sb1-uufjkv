import { SvgGenerator } from '../utils/svgGenerator';
import { LayoutOptimizer } from '../utils/layoutOptimizer';
import { ProcessNode, Position } from '../types/svg';
import { LAYOUT_CONSTANTS, POLLUTANT_COLORS } from '../constants/layout';

export class SvgService {
  private generator: SvgGenerator;
  private layoutOptimizer: LayoutOptimizer;

  constructor() {
    this.generator = new SvgGenerator();
    this.layoutOptimizer = new LayoutOptimizer();
  }

  public generateSvg(nodes: ProcessNode[]): SVGSVGElement {
    console.log('Generating SVG for nodes:', nodes);
    
    // Calculate optimal layout
    const { positions, dimensions, bounds } = this.layoutOptimizer.optimizeLayout(nodes);
    console.log('Layout calculated:', { positions, dimensions, bounds });

    // Initialize SVG with calculated dimensions
    this.generator.initialize(dimensions.width, dimensions.height);
    console.log('SVG initialized with dimensions:', dimensions);

    // Draw process flow connections first (so they appear behind boxes)
    this.drawProcessConnections(nodes, positions);
    console.log('Process connections drawn');

    // Draw process boxes
    this.drawProcessBoxes(nodes, positions);
    console.log('Process boxes drawn');

    // Draw pollutants and their connections
    this.drawPollutants(nodes, positions);
    console.log('Pollutants drawn');

    // Draw legend aligned with the bottom of the last process box
    const lastProcessPosition = positions.get(nodes[nodes.length - 1].id);
    if (lastProcessPosition) {
      const lastProcessBottomY = lastProcessPosition.y + LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT;
      const legendY = lastProcessBottomY;
      const legendHeight = (Object.keys(POLLUTANT_COLORS).length * 30) + 60; // 30px spacing between items + 60px padding
      const legendBottomY = legendY + legendHeight;

      // Add detailed debug logs for legend positioning
      console.log('\n=== Legend Position Details ===');
      console.log(`Last process box bottom Y: ${lastProcessBottomY}`);
      console.log(`Legend Y position: ${legendY}`);
      console.log(`Legend bottom Y: ${legendBottomY}`);
      console.log(`Legend height: ${legendHeight}`);
      console.log(`Number of pollutant types: ${Object.keys(POLLUTANT_COLORS).length}`);
      console.log('============================\n');

      this.drawLegend(bounds, legendY);
    }

    // Get the final SVG element
    const svg = this.generator.getSvgElement();
    console.log('Final SVG element generated');
    
    return svg;
  }

  private drawProcessConnections(nodes: ProcessNode[], positions: Map<string, Position>): void {
    nodes.forEach((node, index) => {
      if (index < nodes.length - 1) {
        const currentPos = positions.get(node.id);
        const nextPos = positions.get(nodes[index + 1].id);
        
        if (currentPos && nextPos) {
          // Start from bottom center of current box
          const startX = currentPos.x + LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH / 2;
          const startY = currentPos.y + LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT;
          
          // End at top center of next box
          const endX = nextPos.x + LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH / 2;
          const endY = nextPos.y;

          this.generator.drawProcessConnector(
            { x: startX, y: startY },
            { x: endX, y: endY }
          );
        }
      }
    });
  }

  private drawProcessBoxes(nodes: ProcessNode[], positions: Map<string, Position>): void {
    nodes.forEach(node => {
      const position = positions.get(node.id);
      if (position) {
        this.generator.drawProcessBox(position.x, position.y, node.title);
      }
    });
  }

  private drawPollutants(nodes: ProcessNode[], positions: Map<string, Position>): void {
    nodes.forEach(node => {
      const processPos = positions.get(node.id);
      if (!processPos) return;

      // Group pollutants by side (left/right)
      const leftPollutants = node.pollutants.filter(p => 
        POLLUTANT_COLORS[p.type].position === 'left'
      );
      const rightPollutants = node.pollutants.filter(p => 
        POLLUTANT_COLORS[p.type].position === 'right'
      );

      // Draw left pollutants
      if (leftPollutants.length > 0) {
        const groupWidth = this.calculatePollutantGroupWidth(leftPollutants.length);
        const startX = processPos.x - LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.OUTER - groupWidth;
        const startY = processPos.y + (LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT - 
                      (LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT + 2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER)) / 2;
        
        this.generator.drawPollutantGroup(leftPollutants, startX, startY, 'left');
        
        // Draw connector from process box to pollutant group
        this.generator.drawConnectorToPollutantGroup(
          { 
            x: processPos.x, 
            y: processPos.y + LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT / 2 
          },
          { 
            x: startX + groupWidth, 
            y: startY + (LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT + 2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER) / 2
          },
          'left'
        );
      }

      // Draw right pollutants
      if (rightPollutants.length > 0) {
        const startX = processPos.x + LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH + 
                      LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.OUTER;
        const startY = processPos.y + (LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT - 
                      (LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT + 2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER)) / 2;
        
        this.generator.drawPollutantGroup(rightPollutants, startX, startY, 'right');
        
        // Draw connector from process box to pollutant group
        this.generator.drawConnectorToPollutantGroup(
          { 
            x: processPos.x + LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH, 
            y: processPos.y + LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT / 2 
          },
          { 
            x: startX, 
            y: startY + (LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT + 2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER) / 2
          },
          'right'
        );
      }
    });
  }

  private calculatePollutantGroupWidth(pollutantCount: number): number {
    return pollutantCount * LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH +
           (pollutantCount - 1) * LAYOUT_CONSTANTS.POLLUTANT_BOX.SPACING +
           2 * LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER;
  }

  private drawLegend(bounds: { left: number; right: number; bottom: number }, legendY: number): void {
    // Place legend 80px to the right of the rightmost element
    const legendX = bounds.right + 80;
    this.generator.drawLegend(legendX, legendY);
  }
}