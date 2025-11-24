import { useMemo } from 'react'
import { Sparkles, Send, Wand2 } from 'lucide-react'
import { canvasSizes } from '../data/canvasSizes'
import { buildTextTreatments } from '../services/styleResolver'

const stylePresets = [
  { key: 'clean', label: 'Clean' },
  { key: 'bold', label: 'Bold' },
  { key: 'pop', label: 'Pop' },
]

const sentiments = [
  { key: 'neutral', label: 'Neutral' },
  { key: 'upbeat', label: 'Upbeat' },
  { key: 'dramatic', label: 'Dramatic' },
]

const QuickCreator = ({
  prompt,
  onPromptChange,
  preset,
  onPresetChange,
  sentiment,
  onSentimentChange,
  canvasSize,
  onSizeChange,
  resolvedStyle,
  onMake,
  adjustments,
  onAdjustmentsChange,
}) => {
  const treatments = useMemo(() => (resolvedStyle ? buildTextTreatments(resolvedStyle) : {}), [resolvedStyle])

  const handleAdjust = (key, value) => {
    onAdjustmentsChange({ ...adjustments, [key]: value })
  }

  return (
    <div className="bg-dark-900/70 border border-dark-800 rounded-xl p-4 shadow-lg flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-dark-200 font-semibold">
        <Sparkles size={16} className="text-indigo-400" />
        Unified Prompt
      </div>
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Describe the thumbnail vibe..."
        className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <div className="flex flex-wrap gap-2">
        {stylePresets.map((p) => (
          <button
            key={p.key}
            onClick={() => onPresetChange(p.key)}
            className={`px-3 py-1.5 rounded-full text-xs border transition ${
              preset === p.key
                ? 'bg-indigo-500/20 text-indigo-100 border-indigo-400'
                : 'bg-dark-800 text-dark-200 border-dark-700 hover:border-indigo-400/60'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {sentiments.map((s) => (
          <button
            key={s.key}
            onClick={() => onSentimentChange(s.key)}
            className={`px-2.5 py-1 rounded-lg text-[11px] border transition ${
              sentiment === s.key
                ? 'bg-amber-500/20 text-amber-50 border-amber-400/70'
                : 'bg-dark-800 text-dark-300 border-dark-700 hover:border-amber-400/60'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(canvasSizes).map(([key, size]) => (
          <button
            key={key}
            onClick={() => onSizeChange(key)}
            className={`px-3 py-1 rounded-md text-xs border transition ${
              canvasSize === key
                ? 'bg-indigo-500/30 text-indigo-50 border-indigo-400'
                : 'bg-dark-800 text-dark-200 border-dark-700'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs bg-dark-800/60 p-3 rounded-lg border border-dark-700">
        <div>
          <div className="text-dark-400 mb-1">Weight</div>
          <input
            type="range"
            min={400}
            max={900}
            value={adjustments.weight}
            onChange={(e) => handleAdjust('weight', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="text-dark-400 mb-1">Letter spacing</div>
          <input
            type="range"
            min={-20}
            max={80}
            value={adjustments.spacing}
            onChange={(e) => handleAdjust('spacing', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="text-dark-400 mb-1">Microtracking</div>
          <input
            type="range"
            min={0}
            max={100}
            value={adjustments.micro}
            onChange={(e) => handleAdjust('micro', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {resolvedStyle && (
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-3 text-xs grid grid-cols-3 gap-2">
          {['headline', 'subhead', 'cta'].map((k) => (
            <div key={k} className="flex flex-col gap-1">
              <div className="text-dark-400 uppercase tracking-wide">{k}</div>
              <div className="text-dark-100 font-semibold leading-tight line-clamp-2">
                {treatments[k]?.clamp || 'Auto'}
              </div>
              <div className="text-[10px] text-dark-500">Stroke {treatments[k]?.strokeWidth}px · Glow {treatments[k]?.glowWidth}px</div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onMake}
        className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg py-2 transition shadow-lg"
      >
        <Send size={16} /> Make it
      </button>

      {resolvedStyle && (
        <div className="text-[11px] text-dark-300 flex items-center gap-2">
          <Wand2 size={14} className="text-indigo-300" />
          Adaptive contrast: {resolvedStyle.sentiment.overlay}
        </div>
      )}
    </div>
  )
}

export default QuickCreator
