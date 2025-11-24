export const typeScale = {
  headline: { min: 32, max: 64, clamp: 'clamp(2rem, 3vw, 4rem)' },
  subhead: { min: 20, max: 32, clamp: 'clamp(1.25rem, 2vw, 2rem)' },
  cta: { min: 16, max: 22, clamp: 'clamp(1rem, 1.5vw, 1.375rem)' },
}

export const weightTokens = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 800,
}

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0em',
  loose: '0.05em',
  tracked: '0.08em',
}

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
}

export const shadows = {
  glow: '0 10px 40px rgba(99, 102, 241, 0.35)',
  depth: '0 12px 32px rgba(0,0,0,0.35)',
  rim: '0 0 0 2px rgba(255,255,255,0.14)',
}

export const gradients = {
  aurora: ['#86fde8', '#acb6e5'],
  heat: ['#ff6a00', '#ee0979'],
  neon: ['#00f260', '#0575e6'],
  dusk: ['#ff512f', '#dd2476'],
}

export const presets = {
  bold: {
    typography: { weight: 'black', letterSpacing: 'tight', casing: 'upper' },
    effects: { shadow: 'depth', stroke: true, glow: false },
    corners: 'md',
    gradient: 'heat',
  },
  clean: {
    typography: { weight: 'semibold', letterSpacing: 'normal', casing: 'title' },
    effects: { shadow: 'glow', stroke: false, glow: true },
    corners: 'sm',
    gradient: 'aurora',
  },
  pop: {
    typography: { weight: 'bold', letterSpacing: 'loose', casing: 'upper' },
    effects: { shadow: 'rim', stroke: true, glow: true },
    corners: 'lg',
    gradient: 'neon',
  },
}

export const sentimentTokens = {
  neutral: { overlay: 'rgba(0,0,0,0.25)', stroke: '#0ea5e9' },
  upbeat: { overlay: 'rgba(255,255,255,0.15)', stroke: '#f59e0b' },
  dramatic: { overlay: 'rgba(0,0,0,0.45)', stroke: '#ef4444' },
}

export const strokeRules = {
  defaultWidth: 2,
  glowWidth: 8,
  adaptiveContrastThreshold: 0.55,
}
