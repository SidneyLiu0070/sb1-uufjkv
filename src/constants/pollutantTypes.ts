export const POLLUTANT_TYPES = {
  G: {
    id: 'G',
    name: '废气',
    description: '气态污染物',
    pattern: /^G\d+$/
  },
  W: {
    id: 'W',
    name: '废水',
    description: '液态污染物',
    pattern: /^W\d+$/
  },
  S: {
    id: 'S',
    name: '固废',
    description: '固态污染物',
    pattern: /^S\d+$/
  },
  N: {
    id: 'N',
    name: '噪声',
    description: '噪声污染',
    pattern: /^N\d*$/
  }
} as const;

export type PollutantTypeKey = keyof typeof POLLUTANT_TYPES;

export function isPollutantType(type: string): type is PollutantTypeKey {
  return type in POLLUTANT_TYPES;
}

export function validatePollutantLabel(label: string): boolean {
  const type = label[0] as PollutantTypeKey;
  if (!isPollutantType(type)) {
    return false;
  }
  return POLLUTANT_TYPES[type].pattern.test(label);
}