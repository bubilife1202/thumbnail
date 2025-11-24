import { resolveStyle } from './styleResolver'
import { gradientPalettes } from '../design/palettes'
import { presets } from '../design/tokens'

export const generateVariants = (prompt, sentiments = ['neutral', 'upbeat']) => {
  const paletteKeys = Object.keys(gradientPalettes)
  return sentiments.flatMap((sentiment) =>
    Object.keys(presets).map((presetKey, idx) => {
      const paletteKey = paletteKeys[idx % paletteKeys.length]
      return {
        sentiment,
        presetKey,
        palette: gradientPalettes[paletteKey],
        style: resolveStyle({ prompt, presetKey, sentiment }),
      }
    })
  )
}
