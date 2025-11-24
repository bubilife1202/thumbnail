import { lightingPresets } from '../../utils/layerEffects'

const LightingPanel = ({ activePreset = 'clean', onChange }) => {
  return (
    <div className="bg-dark-900/70 border border-dark-800 rounded-lg p-3 text-sm text-dark-100 space-y-2">
      <div className="font-semibold text-dark-100">Lighting</div>
      <div className="flex gap-2">
        {Object.keys(lightingPresets).map((key) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 rounded-md border text-xs ${
              activePreset === key
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-100'
                : 'bg-dark-800 border-dark-700 text-dark-200'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="text-[11px] text-dark-400">
        Presets blend glow, inner shadow, and rim-light for quick pop.
      </div>
    </div>
  )
}

export default LightingPanel
