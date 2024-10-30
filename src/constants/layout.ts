export const LAYOUT_CONSTANTS = {
  CANVAS: {
    MIN_WIDTH: 1200,
    MIN_HEIGHT: 800,
    PADDING: 50,
    SCALE_THRESHOLDS: {
      SMALL: 3,
      LARGE: 10
    }
  },
  PROCESS_BOX: {
    WIDTH: 160,
    HEIGHT: 60,
    SPACING: {
      VERTICAL: 60,
      HORIZONTAL: 200,
      PARALLEL_OFFSET: 60
    },
    CORNER_RADIUS: 5,
    COLORS: {
      FILL: '#F3E5F5',
      STROKE: '#7B1FA2'
    }
  },
  POLLUTANT_BOX: {
    WIDTH: 20,
    HEIGHT: 20,
    SPACING: 5,
    CORNER_RADIUS: 3,
    GROUP: {
      PADDING: {
        INNER: 10, // Padding between pollutant boxes and group container
        OUTER: 60  // Distance from process box to group container
      },
      CONTAINER: {
        STROKE: '#666666',
        STROKE_WIDTH: 1,
        DASH_ARRAY: '5,5',
        CORNER_RADIUS: 3
      }
    }
  },
  CONNECTOR: {
    STROKE_WIDTH: 2,
    ARROW_SIZE: 6,
    DASH_ARRAY: '5,5',
    COLORS: {
      STROKE: '#666666',
      FILL: '#666666'
    },
    CURVE: {
      TENSION: 0.4,
      PARALLEL_TENSION: 0.6
    }
  },
  FONT: {
    TITLE: {
      SIZE: '24px',
      WEIGHT: 'bold'
    },
    PROCESS: {
      NAME: '16px',
      DESC: '12px',
      WEIGHT: 'bold'
    },
    POLLUTANT: {
      SIZE: '12px',
      WEIGHT: 'normal'
    }
  }
} as const;

export const POLLUTANT_COLORS = {
  G: {
    fill: '#E8F5E9',
    stroke: '#4CAF50',
    label: '废气',
    position: 'left'
  },
  W: {
    fill: '#E1F5FE',
    stroke: '#2196F3',
    label: '废水',
    position: 'left'
  },
  S: {
    fill: '#FFF3E0',
    stroke: '#FF9800',
    label: '固废',
    position: 'right'
  },
  N: {
    fill: '#FFECB3',
    stroke: '#FFA000',
    label: '噪声',
    position: 'right'
  }
} as const;