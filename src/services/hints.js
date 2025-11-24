const hintLibrary = [
  { key: 'contrast', message: 'Increase text stroke or overlay when background contrast dips.' },
  { key: 'hierarchy', message: 'Use size + weight shifts between headline and subhead to guide the eye.' },
  { key: 'spacing', message: 'Keep badges aligned to grid snap points for clean spacing.' },
]

export const getHints = ({ sentiment, gridType }) => {
  const base = [...hintLibrary]
  if (sentiment === 'dramatic') base.push({ key: 'drama', message: 'Try rim light + vignette for cinematic depth.' })
  if (gridType === 'centerFocus') base.push({ key: 'center', message: 'Center lock important elements to avoid jitter in motion.' })
  return base
}
