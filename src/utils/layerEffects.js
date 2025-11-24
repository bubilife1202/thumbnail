export const subjectLift = (intensity = 0.6) => ({
  shadow: `0 ${Math.round(10 * intensity)}px ${Math.round(40 * intensity)}px rgba(0,0,0,0.${Math.round(
    25 + intensity * 25
  )})`,
  glow: `0 0 ${Math.round(16 * intensity)}px rgba(255,255,255,0.${Math.round(15 + intensity * 35)})`,
  parallax: { x: intensity * 4, y: intensity * 6 },
})

export const lightingPresets = {
  pop: { glow: '0 0 24px rgba(255, 255, 255, 0.35)', innerShadow: 'inset 0 0 24px rgba(0,0,0,0.35)' },
  depth: { glow: '0 16px 42px rgba(0,0,0,0.45)', innerShadow: 'inset 0 8px 18px rgba(0,0,0,0.35)' },
  clean: { glow: '0 12px 28px rgba(0,0,0,0.2)', innerShadow: 'none' },
}
