// Previous imports remain the same

class SvgGenerator {
  // Previous methods remain the same

  private generateTreatmentFacilities(nodes: ProcessNode[]): string {
    const leftTypes = ['G', 'W'];
    const rightTypes = ['S'];
    let leftContent = '';
    let rightContent = '';

    nodes.forEach((node, index) => {
      const pollutantsByType = this.groupPollutantsByType(node.pollutants);

      // Left side treatment facilities
      leftTypes.forEach(type => {
        if (pollutantsByType[type]?.length) {
          const y = index * (LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT + LAYOUT_CONSTANTS.PROCESS_BOX.SPACING);
          leftContent += this.generateTreatmentBox(type as 'G' | 'W', -LAYOUT_CONSTANTS.TREATMENT_BOX.WIDTH - LAYOUT_CONSTANTS.TREATMENT_BOX.SPACING, y);
        }
      });

      // Right side treatment facilities
      rightTypes.forEach(type => {
        if (pollutantsByType[type]?.length) {
          const y = index * (LAYOUT_CONSTANTS.PROCESS_BOX.HEIGHT + LAYOUT_CONSTANTS.PROCESS_BOX.SPACING);
          rightContent += this.generateTreatmentBox(type as 'S', LAYOUT_CONSTANTS.PROCESS_BOX.WIDTH + LAYOUT_CONSTANTS.TREATMENT_BOX.SPACING, y);
        }
      });
    });

    return leftContent + rightContent;
  }

  private generateTreatmentBox(type: 'G' | 'W' | 'S', x: number, y: number): string {
    const colors = LAYOUT_CONSTANTS.COLORS.TREATMENT[type];
    const title = {
      G: '废气处理设施',
      W: '废水处理设施',
      S: '固废处理设施'
    }[type];

    return `
      <g transform="translate(${x},${y})">
        <rect
          width="${LAYOUT_CONSTANTS.TREATMENT_BOX.WIDTH}"
          height="${LAYOUT_CONSTANTS.TREATMENT_BOX.HEIGHT}"
          rx="${LAYOUT_CONSTANTS.TREATMENT_BOX.RADIUS}"
          fill="${colors.fill}"
          stroke="${colors.stroke}"
          stroke-width="2"
        />
        <text
          x="${LAYOUT_CONSTANTS.TREATMENT_BOX.WIDTH / 2}"
          y="${LAYOUT_CONSTANTS.TREATMENT_BOX.HEIGHT / 2}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="${LAYOUT_CONSTANTS.FONT.PROCESS.NAME}"
        >${title}</text>
      </g>
    `;
  }

  private groupPollutantsByType(pollutants: PollutantNode[]): Record<string, PollutantNode[]> {
    return pollutants.reduce((acc, p) => {
      if (!acc[p.type]) acc[p.type] = [];
      acc[p.type].push(p);
      return acc;
    }, {} as Record<string, PollutantNode[]>);
  }

  // Previous methods remain the same
}

export const svgGenerator = new SvgGenerator();