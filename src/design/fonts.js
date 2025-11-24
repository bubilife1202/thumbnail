export const fontPairs = [
  {
    name: 'Urban Modern',
    headline: 'Inter',
    subhead: 'Inter',
    cta: 'Inter',
    locales: { default: ['Inter', 'Noto Sans KR', 'Noto Sans JP'] },
    usage: 'Tech, gaming, news',
  },
  {
    name: 'Editorial Contrast',
    headline: 'Playfair Display',
    subhead: 'Inter',
    cta: 'Inter',
    locales: { default: ['Playfair Display', 'Noto Serif JP', 'Noto Serif KR'] },
    usage: 'Lifestyle, vlog, education',
  },
  {
    name: 'Rounded Pop',
    headline: 'Baloo 2',
    subhead: 'Noto Sans KR',
    cta: 'Noto Sans KR',
    locales: { default: ['Baloo 2', 'Noto Sans KR', 'Noto Sans JP'] },
    usage: 'Commerce, playful, promos',
  },
]

export const getFontStack = (locale = 'default', pairName = 'Urban Modern') => {
  const pair = fontPairs.find((f) => f.name === pairName) || fontPairs[0]
  const localeFonts = pair.locales[locale] || pair.locales.default
  return localeFonts.concat(['system-ui', '-apple-system', 'BlinkMacSystemFont']).join(', ')
}
