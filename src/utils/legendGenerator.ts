import { POLLUTANT_COLORS } from '../constants/layout';
import { LAYOUT_CONSTANTS } from '../constants/layout';

export class LegendGenerator {
  private svg: SVGSVGElement;
  private mainGroup: SVGGElement;

  constructor(svg: SVGSVGElement, mainGroup: SVGGElement) {
    this.svg = svg;
    this.mainGroup = mainGroup;
  }

  public drawLegend(x: number, y: number): SVGGElement {
    console.log('\n=== Legend Generator Details ===');
    console.log(`Legend X position: ${x}`);
    console.log(`Legend Y position: ${y}`);

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Calculate legend dimensions
    const itemSpacing = 30;
    const padding = 20;
    const legendWidth = 150;
    const legendHeight = (Object.keys(POLLUTANT_COLORS).length * itemSpacing) + 60;

    // Adjust Y position by subtracting 120px
    const adjustedY = y - 120;

    console.log(`Legend width: ${legendWidth}`);
    console.log(`Legend height: ${legendHeight}`);
    console.log(`Legend bottom Y: ${adjustedY + legendHeight}`);
    console.log('=============================\n');

    // Add background rectangle
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('x', (x - padding).toString());
    background.setAttribute('y', (adjustedY - padding).toString());
    background.setAttribute('width', legendWidth.toString());
    background.setAttribute('height', legendHeight.toString());
    background.setAttribute('fill', 'white');
    background.setAttribute('stroke', '#E5E7EB');
    background.setAttribute('rx', '8');

    // Add legend title with updated font size
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', x.toString());
    title.setAttribute('y', adjustedY.toString());
    title.setAttribute('font-size', '20px');
    title.setAttribute('font-weight', LAYOUT_CONSTANTS.FONT.TITLE.WEIGHT);
    title.textContent = '图例';

    group.appendChild(background);
    group.appendChild(title);

    // Add legend items
    let currentY = adjustedY + 40;
    Object.entries(POLLUTANT_COLORS).forEach(([type, colors]) => {
      const item = this.createLegendItem(x, currentY, type, colors);
      group.appendChild(item);
      currentY += itemSpacing;
    });

    this.mainGroup.appendChild(group);
    return group;
  }

  private createLegendItem(x: number, y: number, type: string, colors: any): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Create sample box
    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    box.setAttribute('x', x.toString());
    box.setAttribute('y', y.toString());
    box.setAttribute('width', '20');
    box.setAttribute('height', '20');
    box.setAttribute('rx', LAYOUT_CONSTANTS.POLLUTANT_BOX.CORNER_RADIUS.toString());
    box.setAttribute('fill', colors.fill);
    box.setAttribute('stroke', colors.stroke);
    box.setAttribute('stroke-width', '1');

    // Create type label
    const typeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    typeLabel.setAttribute('x', (x + 10).toString());
    typeLabel.setAttribute('y', (y + 10).toString());
    typeLabel.setAttribute('text-anchor', 'middle');
    typeLabel.setAttribute('dominant-baseline', 'middle');
    typeLabel.setAttribute('font-size', LAYOUT_CONSTANTS.FONT.POLLUTANT.SIZE);
    typeLabel.setAttribute('font-weight', 'bold');
    typeLabel.textContent = type;

    // Create description label
    const descLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    descLabel.setAttribute('x', (x + 35).toString());
    descLabel.setAttribute('y', (y + 10).toString());
    descLabel.setAttribute('dominant-baseline', 'middle');
    descLabel.setAttribute('font-size', LAYOUT_CONSTANTS.FONT.POLLUTANT.SIZE);
    descLabel.textContent = colors.label;

    group.appendChild(box);
    group.appendChild(typeLabel);
    group.appendChild(descLabel);
    return group;
  }
}