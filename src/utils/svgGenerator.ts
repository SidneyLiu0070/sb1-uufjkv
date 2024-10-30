import { ProcessNode, Position } from '../types/svg';
import { LAYOUT_CONSTANTS, POLLUTANT_COLORS } from '../constants/layout';
import { LegendGenerator } from './legendGenerator';
import { CoordinateTracker } from './coordinateTracker';

export class SvgGenerator {
  private svg: SVGSVGElement;
  private defs: SVGDefsElement;
  private mainGroup: SVGGElement;
  private legendGenerator: LegendGenerator;
  private coordinateTracker: CoordinateTracker;

  constructor() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.legendGenerator = new LegendGenerator(this.svg, this.mainGroup);
    this.coordinateTracker = new CoordinateTracker();
    this.initializeSvg();
  }

  private initializeSvg(): void {
    // Add defs section with arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrow');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', LAYOUT_CONSTANTS.CONNECTOR.ARROW_SIZE.toString());
    marker.setAttribute('markerHeight', LAYOUT_CONSTANTS.CONNECTOR.ARROW_SIZE.toString());
    marker.setAttribute('orient', 'auto');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    path.setAttribute('fill', LAYOUT_CONSTANTS.CONNECTOR.COLORS.FILL);

    marker.appendChild(path);
    this.defs.appendChild(marker);
    this.svg.appendChild(this.defs);
    this.svg.appendChild(this.mainGroup);
  }

  public initialize(width: number, height: number): void {
    this.svg.setAttribute('width', width.toString());
    this.svg.setAttribute('height', height.toString());
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  public getSvgElement(): SVGSVGElement {
    return this.svg;
  }

  public drawProcessConnector(start: Position, end: Position): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Calculate control points for the curve
    const midY = (start.y + end.y) / 2;
    const d = `M ${start.x} ${start.y} 
               C ${start.x} ${midY}, 
                 ${end.x} ${midY}, 
                 ${end.x} ${end.y}`;
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', LAYOUT_CONSTANTS.CONNECTOR.COLORS.STROKE);
    path.setAttribute('stroke-width', LAYOUT_CONSTANTS.CONNECTOR.STROKE_WIDTH.toString());
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#arrow)');

    this.mainGroup.insertBefore(path, this.mainGroup.firstChild);
    return path;
  }

  public drawConnectorToPollutantGroup(
    start: Position,
    end: Position,
    side: 'left' | 'right'
  ): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Draw a straight horizontal line
    const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', LAYOUT_CONSTANTS.CONNECTOR.COLORS.STROKE);
    path.setAttribute('stroke-width', LAYOUT_CONSTANTS.CONNECTOR.STROKE_WIDTH.toString());
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', 'url(#arrow)');
    path.setAttribute('stroke-dasharray', LAYOUT_CONSTANTS.CONNECTOR.DASH_ARRAY);

    this.mainGroup.appendChild(path);
    return path;
  }

  public drawPollutantBox(
    x: number,
    y: number,
    type: keyof typeof POLLUTANT_COLORS,
    label: string
  ): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const colors = POLLUTANT_COLORS[type];

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH.toString());
    rect.setAttribute('height', LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT.toString());
    rect.setAttribute('rx', LAYOUT_CONSTANTS.POLLUTANT_BOX.CORNER_RADIUS.toString());
    rect.setAttribute('fill', colors.fill);
    rect.setAttribute('stroke', colors.stroke);
    rect.setAttribute('stroke-width', '1');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (x + LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH / 2).toString());
    text.setAttribute('y', (y + LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT / 2).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', LAYOUT_CONSTANTS.FONT.POLLUTANT.SIZE);
    text.textContent = label;

    group.appendChild(rect);
    group.appendChild(text);
    return group;
  }

  public drawPollutantGroup(
    pollutants: Array<{ type: string; label: string }>,
    x: number,
    y: number,
    side: 'left' | 'right'
  ): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Calculate group container dimensions
    const boxWidth = LAYOUT_CONSTANTS.POLLUTANT_BOX.WIDTH;
    const boxHeight = LAYOUT_CONSTANTS.POLLUTANT_BOX.HEIGHT;
    const boxSpacing = LAYOUT_CONSTANTS.POLLUTANT_BOX.SPACING;
    const innerPadding = LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.PADDING.INNER;
    
    const containerWidth = pollutants.length * boxWidth + 
                          (pollutants.length - 1) * boxSpacing +
                          2 * innerPadding;
    const containerHeight = boxHeight + 2 * innerPadding;

    // Draw group container
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    container.setAttribute('x', x.toString());
    container.setAttribute('y', y.toString());
    container.setAttribute('width', containerWidth.toString());
    container.setAttribute('height', containerHeight.toString());
    container.setAttribute('rx', LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.CONTAINER.CORNER_RADIUS.toString());
    container.setAttribute('fill', 'none');
    container.setAttribute('stroke', LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.CONTAINER.STROKE);
    container.setAttribute('stroke-width', LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.CONTAINER.STROKE_WIDTH.toString());
    container.setAttribute('stroke-dasharray', LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.CONTAINER.DASH_ARRAY);

    group.appendChild(container);

    // Draw pollutant boxes
    pollutants.forEach((pollutant, index) => {
      const pollutantX = x + innerPadding + index * (boxWidth + boxSpacing);
      const pollutantY = y + innerPadding;
      
      const pollutantBox = this.drawPollutantBox(
        pollutantX,
        pollutantY,
        pollutant.type as keyof typeof POLLUTANT_COLORS,
        pollutant.label
      );
      group.appendChild(pollutantBox);
    });

    this.mainGroup.appendChild(group);
    return group;
  }

  public drawProcessBox(x: number, y: number, title: string): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH.toString());
    rect.setAttribute('height', LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT.toString());
    rect.setAttribute('rx', LAYOUT_CONSTANTS.PROCESS_BOX.CORNER_RADIUS.toString());
    rect.setAttribute('fill', LAYOUT_CONSTANTS.PROCESS_BOX.COLORS.FILL);
    rect.setAttribute('stroke', LAYOUT_CONSTANTS.PROCESS_BOX.COLORS.STROKE);
    rect.setAttribute('stroke-width', '2');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (x + LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH / 2).toString());
    text.setAttribute('y', (y + LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT / 2).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', LAYOUT_CONSTANTS.FONT.PROCESS.NAME);
    text.setAttribute('font-weight', LAYOUT_CONSTANTS.FONT.PROCESS.WEIGHT);
    text.textContent = title;

    group.appendChild(rect);
    group.appendChild(text);
    this.mainGroup.appendChild(group);
    return group;
  }

  public drawLegend(x: number, y: number): SVGGElement {
    return this.legendGenerator.drawLegend(x, y);
  }
}