import { typeScale, weightTokens, letterSpacing, strokeRules } from '../design/tokens'

const contrastRatio = (rgb1, rgb2) => {
  const lum = (c) => {
    const a = c.map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }
  const l1 = lum(rgb1) + 0.05
  const l2 = lum(rgb2) + 0.05
  return Math.max(l1, l2) / Math.min(l1, l2)
}

export const computeStrokeForBackground = (bgColor = '#000000', baseColor = '#ffffff') => {
  const toRgb = (hex) => hex.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16))
  const ratio = contrastRatio(toRgb(bgColor.replace('#', '')), toRgb(baseColor.replace('#', '')))
  const needsStroke = ratio < strokeRules.adaptiveContrastThreshold * 10
  return {
    strokeWidth: needsStroke ? strokeRules.defaultWidth : 0,
    glowWidth: needsStroke ? strokeRules.glowWidth : 0,
  }
}

export const getTypeTreatment = (kind = 'headline', sizeBias = 0) => {
  const scale = typeScale[kind]
  const clampValue = scale.clamp
  return {
    fontSize: clampValue,
    minSize: scale.min + sizeBias,
    maxSize: scale.max + sizeBias,
  }
}

export const getAdaptiveSpacing = (length) => {
  if (length < 20) return letterSpacing.loose
  if (length < 60) return letterSpacing.normal
  return letterSpacing.tight
}

export const autoFitText = (text, kind = 'headline', weight = 'bold', background = '#000000') => {
  const treatment = getTypeTreatment(kind)
  const spacing = getAdaptiveSpacing(text.length)
  const { strokeWidth, glowWidth } = computeStrokeForBackground(background)

  return {
    ...treatment,
    fontWeight: weightTokens[weight] || weightTokens.bold,
    letterSpacing: spacing,
    strokeWidth,
    glowWidth,
    clamp: treatment.fontSize,
  }
}
