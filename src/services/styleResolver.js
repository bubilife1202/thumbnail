import { presets, sentimentTokens } from '../design/tokens'
import { gradientPalettes, duotones } from '../design/palettes'
import { autoFitText } from '../utils/textFit'
import { getFontStack } from '../design/fonts'

const pickPalette = (preset) => gradientPalettes[preset.gradient] || Object.values(gradientPalettes)[0]

export const resolveStyle = ({ prompt = '', presetKey = 'clean', sentiment = 'neutral', locale = 'default' }) => {
  const preset = presets[presetKey] || presets.clean
  const palette = pickPalette({ gradient: preset.gradient })
  const sentimentLayer = sentimentTokens[sentiment] || sentimentTokens.neutral

  const headline = autoFitText(prompt || 'Title', 'headline', preset.typography.weight)
  const subhead = autoFitText('Supporting line', 'subhead', preset.typography.weight)
  const cta = autoFitText('CTA', 'cta', 'semibold')

  return {
    typography: {
      headline,
      subhead,
      cta,
      casing: preset.typography.casing,
      font: getFontStack(locale),
      letterSpacing: preset.typography.letterSpacing,
    },
    palette,
    duotone: duotones.ember,
    effects: preset.effects,
    sentiment: sentimentLayer,
  }
}

export const buildTextTreatments = (style) => ({
  headline: style.typography.headline,
  subhead: style.typography.subhead,
  cta: style.typography.cta,
})
