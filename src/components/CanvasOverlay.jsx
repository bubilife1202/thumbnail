import { Eye, Grid, Shield, Crop } from 'lucide-react'
import { getGridConfig } from '../utils/layoutGrids'

const CanvasOverlay = ({ width, height, gridType, showGrid, showSafeZone, onToggleGrid, onToggleSafeZone }) => {
  const config = getGridConfig(width, height)
  return (
    <div className="absolute inset-0 pointer-events-none">
      {showGrid && (
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${width} ${height}`}> 
          {gridType === 'ruleOfThirds' && (
            <>
              <line x1={width / 3} x2={width / 3} y1={0} y2={height} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1={(width / 3) * 2} x2={(width / 3) * 2} y1={0} y2={height} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1={0} x2={width} y1={height / 3} y2={height / 3} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1={0} x2={width} y1={(height / 3) * 2} y2={(height / 3) * 2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </>
          )}
          {gridType === 'golden' &&
            config.golden.map((pt, idx) => (
              <line
                key={idx}
                x1={pt.x}
                x2={pt.x}
                y1={0}
                y2={height}
                stroke="rgba(255,255,255,0.12)"
                strokeDasharray="4 4"
              />
            ))}
          {gridType === 'centerFocus' && (
            <>
              <line x1={width / 2} x2={width / 2} y1={0} y2={height} stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
              <line x1={0} x2={width} y1={height / 2} y2={height / 2} stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            </>
          )}
        </svg>
      )}

      {showSafeZone && (
        <div
          className="absolute border-2 border-amber-400/70 bg-amber-400/5"
          style={{
            left: config.safeZone.x,
            top: config.safeZone.y,
            width: config.safeZone.width,
            height: config.safeZone.height,
          }}
        />
      )}

      <div className="absolute top-3 right-3 pointer-events-auto flex gap-2">
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border ${
            showGrid ? 'bg-dark-700 text-white border-dark-500' : 'bg-dark-900/80 text-dark-200 border-dark-700'
          }`}
        >
          <Grid size={14} /> Grid
        </button>
        <button
          onClick={onToggleSafeZone}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border ${
            showSafeZone ? 'bg-amber-500/20 text-amber-50 border-amber-400' : 'bg-dark-900/80 text-dark-200 border-dark-700'
          }`}
        >
          <Shield size={14} /> Safe
        </button>
        <div className="px-2 py-1 rounded-md bg-dark-900/70 text-dark-200 border border-dark-700 text-[11px] flex items-center gap-1">
          <Eye size={12} />
          {gridType}
        </div>
      </div>

      <div className="absolute bottom-3 left-3 pointer-events-auto flex items-center gap-2 text-[11px] text-dark-100 bg-dark-900/70 border border-dark-700 rounded-md px-2 py-1">
        <Crop size={12} /> {width} × {height}
      </div>
    </div>
  )
}

export default CanvasOverlay
