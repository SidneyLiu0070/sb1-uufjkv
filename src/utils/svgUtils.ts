import { ProcessNode, Position, Dimensions } from '../types/svg';
import { LAYOUT_CONSTANTS } from '../constants/layout';

export function createSvgElement(type: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

export function calculateCanvasDimensions(nodes: ProcessNode[]): Dimensions {
  const processHeight = nodes.length * (LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT + LAYOUT_CONSTANTS.PROCESS_BOX.SPACING);
  const minWidth = LAYOUT_CONSTANTS.CANVAS.MIN_WIDTH;
  const minHeight = Math.max(LAYOUT_CONSTANTS.CANVAS.MIN_HEIGHT, processHeight + LAYOUT_CONSTANTS.CANVAS.PADDING * 2);

  return {
    width: minWidth,
    height: minHeight
  };
}

export function createArrowMarker(): SVGMarkerElement {
  const marker = createSvgElement('marker') as SVGMarkerElement;
  marker.setAttribute('id', 'arrow');
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerWidth', LAYOUT_CONSTANTS.CONNECTOR.ARROW_SIZE.toString());
  marker.setAttribute('markerHeight', LAYOUT_CONSTANTS.CONNECTOR.ARROW_SIZE.toString());
  marker.setAttribute('orient', 'auto');

  const path = createSvgElement('path');
  path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  path.setAttribute('fill', LAYOUT_CONSTANTS.CONNECTOR.COLORS.FILL);

  marker.appendChild(path);
  return marker;
}

export function calculateConnectorPath(start: Position, end: Position, type: 'straight' | 'curved'): string {
  if (type === 'straight') {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  } else {
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  }
}