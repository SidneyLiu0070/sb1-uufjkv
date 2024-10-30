// Previous imports remain the same

export function drawTreatmentBox(
  group: SVGGElement,
  x: number,
  y: number,
  type: 'G' | 'W' | 'S',
  title: string
): SVGGElement {
  const box = createSVGElement('g') as SVGGElement;
  box.setAttribute('transform', `translate(${x},${y})`);

  const colors = LAYOUT_CONSTANTS.COLORS.TREATMENT[type];
  
  const rect = createSVGElement('rect');
  rect.setAttribute('width', LAYOUT_CONSTANTS.TREATMENT_BOX.WIDTH.toString());
  rect.setAttribute('height', LAYOUT_CONSTANTS.TREATMENT_BOX.HEIGHT.toString());
  rect.setAttribute('rx', LAYOUT_CONSTANTS.TREATMENT_BOX.RADIUS.toString());
  rect.setAttribute('fill', colors.fill);
  rect.setAttribute('stroke', colors.stroke);
  rect.setAttribute('stroke-width', '2');

  const text = createSVGElement('text');
  text.setAttribute('x', (LAYOUT_CONSTANTS.TREATMENT_BOX.WIDTH / 2).toString());
  text.setAttribute('y', (LAYOUT_CONSTANTS.TREATMENT_BOX.HEIGHT / 2).toString());
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'middle');
  text.setAttribute('font-size', LAYOUT_CONSTANTS.FONT.PROCESS.NAME);
  text.textContent = title;

  box.append(rect, text);
  group.appendChild(box);
  return box;
}

export function drawPollutantGroup(
  group: SVGGElement,
  x: number,
  y: number,
  width: number,
  height: number
): SVGGElement {
  const box = createSVGElement('g') as SVGGElement;
  box.setAttribute('transform', `translate(${x},${y})`);

  const rect = createSVGElement('rect');
  rect.setAttribute('width', width.toString());
  rect.setAttribute('height', height.toString());
  rect.setAttribute('fill', 'none');
  rect.setAttribute('stroke', '#666666');
  rect.setAttribute('stroke-width', '1');
  rect.setAttribute('stroke-dasharray', LAYOUT_CONSTANTS.POLLUTANT_BOX.GROUP.DASH_ARRAY);

  box.appendChild(rect);
  group.appendChild(box);
  return box;
}

export function drawDashedConnector(
  group: SVGGElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): SVGElement {
  const path = createSVGElement('path');
  const d = `M ${x1} ${y1} L ${x2} ${y2}`;
  
  path.setAttribute('d', d);
  path.setAttribute('stroke', '#666666');
  path.setAttribute('stroke-width', LAYOUT_CONSTANTS.CONNECTOR.STROKE_WIDTH.toString());
  path.setAttribute('stroke-dasharray', LAYOUT_CONSTANTS.CONNECTOR.DASH_ARRAY);
  path.setAttribute('marker-end', 'url(#arrow)');
  path.setAttribute('fill', 'none');

  group.appendChild(path);
  return path;
}

// Previous functions remain the same