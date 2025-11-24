const baseGridConfigs = {
  '1280x720': {
    ruleOfThirds: [
      { x: 1280 / 3, y: 0 },
      { x: (1280 / 3) * 2, y: 0 },
      { x: 0, y: 720 / 3 },
      { x: 0, y: (720 / 3) * 2 },
    ],
    golden: [
      { x: 1280 * 0.382, y: 720 * 0.382 },
      { x: 1280 * 0.618, y: 720 * 0.618 },
    ],
    safeZone: { x: 80, y: 80, width: 1280 - 160, height: 720 - 140 },
  },
  '1080x1920': {
    ruleOfThirds: [
      { x: 1080 / 3, y: 0 },
      { x: (1080 / 3) * 2, y: 0 },
      { x: 0, y: 1920 / 3 },
      { x: 0, y: (1920 / 3) * 2 },
    ],
    golden: [
      { x: 1080 * 0.382, y: 1920 * 0.382 },
      { x: 1080 * 0.618, y: 1920 * 0.618 },
    ],
    safeZone: { x: 72, y: 140, width: 1080 - 144, height: 1920 - 260 },
  },
}

export const gridTypes = ['ruleOfThirds', 'golden', 'centerFocus']

export const getGridConfig = (width, height) => {
  const key = `${width}x${height}`
  return (
    baseGridConfigs[key] || {
      ruleOfThirds: [
        { x: width / 3, y: 0 },
        { x: (width / 3) * 2, y: 0 },
        { x: 0, y: height / 3 },
        { x: 0, y: (height / 3) * 2 },
      ],
      golden: [
        { x: width * 0.382, y: height * 0.382 },
        { x: width * 0.618, y: height * 0.618 },
      ],
      safeZone: { x: 32, y: 32, width: width - 64, height: height - 96 },
    }
  )
}

export const getSnapPoints = (width, height, gridType = 'ruleOfThirds') => {
  const config = getGridConfig(width, height)
  if (gridType === 'centerFocus') {
    return [
      { x: width / 2, y: height / 2 },
      { x: width / 2, y: height * 0.35 },
      { x: width / 2, y: height * 0.65 },
    ]
  }
  return config[gridType] || []
}

export const getSafeZoneMask = (width, height) => getGridConfig(width, height).safeZone
