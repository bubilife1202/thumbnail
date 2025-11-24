import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import CanvasEditor from './components/CanvasEditor'
import PropertyPanel from './components/PropertyPanel'
import { getTemplatesBySize } from './data/templates'
import { canvasSizes, DEFAULT_CANVAS_SIZE } from './data/canvasSizes'
import { smartResizeCanvas } from './utils/smartResize'
import QuickCreator from './components/QuickCreator'
import { resolveStyle } from './services/styleResolver'
import LightingPanel from './components/Controls/LightingPanel'
import { getHints } from './services/hints'

function App() {
  const [canvas, setCanvas] = useState(null)
  const [selectedObject, setSelectedObject] = useState(null)
  const [projectName, setProjectName] = useState('Untitled Thumbnail')
  const [hasLoadedInitialTemplate, setHasLoadedInitialTemplate] = useState(false)
  const [currentCanvasSize, setCurrentCanvasSize] = useState(DEFAULT_CANVAS_SIZE)
  const [prompt, setPrompt] = useState('Bold vlog about travel secrets')
  const [stylePreset, setStylePreset] = useState('clean')
  const [sentiment, setSentiment] = useState('neutral')
  const [resolvedStyle, setResolvedStyle] = useState(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showSafe, setShowSafe] = useState(true)
  const [gridType, setGridType] = useState('ruleOfThirds')
  const [lightingPreset, setLightingPreset] = useState('clean')
  const [adjustments, setAdjustments] = useState({ weight: 700, spacing: 0, micro: 50 })

  // ✅ useCallback으로 메모이제이션하여 무한 재생성 방지
  const handleCanvasReady = useCallback((fabricCanvas) => {
    setCanvas(fabricCanvas)

    // Handle object selection
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected[0])
    })
    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0])
    })
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null)
    })
  }, [])

  // Auto-load first template on startup
  useEffect(() => {
    if (canvas && !hasLoadedInitialTemplate) {
      const currentTemplates = getTemplatesBySize(currentCanvasSize)
      if (currentTemplates.length > 0) {
        // Load the first template automatically
        handleLoadTemplate(currentTemplates[0])
        setHasLoadedInitialTemplate(true)
      }
    }
  }, [canvas, hasLoadedInitialTemplate, currentCanvasSize])

  const handleLoadTemplate = async (template) => {
    if (!canvas) return

    // Clear current canvas
    canvas.clear()

    // Wait for fonts to load before rendering
    await document.fonts.ready

    // Load template data
    canvas.loadFromJSON(template.data, () => {
      // Ensure fonts are applied to all text objects
      canvas.getObjects().forEach((obj) => {
        if (obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text') {
          obj.set({ dirty: true })
        }
      })

      canvas.renderAll()

      // Update project name to template name
      setProjectName(template.name)

      // Clear selection
      canvas.discardActiveObject()
      setSelectedObject(null)
      canvas.renderAll()

      // Auto-fit canvas to screen after template load
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 100)
    })
  }

  const handleCanvasSizeChange = (newSizeId) => {
    if (!canvas || newSizeId === currentCanvasSize) return

    const newSize = canvasSizes[newSizeId]
    const oldSize = canvasSizes[currentCanvasSize]

    if (!newSize || !oldSize) return

    // Use Smart Resize Engine
    smartResizeCanvas(canvas, oldSize.width, oldSize.height, newSize.width, newSize.height)

    // Deselect & Render
    canvas.discardActiveObject()
    setSelectedObject(null)
    canvas.renderAll()

    // Update State
    setCurrentCanvasSize(newSizeId)

    // Auto-fit to screen
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 50)
  }

  const currentSize = canvasSizes[currentCanvasSize]

  useEffect(() => {
    setResolvedStyle(resolveStyle({ prompt, presetKey: stylePreset, sentiment }))
  }, [prompt, stylePreset, sentiment])

  const hints = getHints({ sentiment, gridType })

  const overlayOptions = {
    gridType,
    showGrid,
    showSafeZone: showSafe,
    onToggleGrid: () => setShowGrid((v) => !v),
    onToggleSafeZone: () => setShowSafe((v) => !v),
  }

  const handleMake = () => {
    if (!canvas) return
    const dataUrl = canvas.toDataURL({ format: 'png' })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-preview.png`
    link.click()
  }

  return (
    <div className="flex flex-col h-screen bg-dark-950 text-dark-100 selection:bg-indigo-500/30">
      {/* Header */}
      <Header
        projectName={projectName}
        setProjectName={setProjectName}
        canvas={canvas}
        currentCanvasSize={currentCanvasSize}
        onCanvasSizeChange={handleCanvasSizeChange}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar */}
        <Toolbar canvas={canvas} onLoadTemplate={handleLoadTemplate} currentCanvasSize={currentCanvasSize} />

        {/* Canvas Area with specialized background for contrast */}
        <main className="flex-1 relative bg-black/40 shadow-inner flex flex-col min-w-0">
          <div className="grid grid-cols-[2fr_3fr] gap-3 p-3">
            <QuickCreator
              prompt={prompt}
              onPromptChange={setPrompt}
              preset={stylePreset}
              onPresetChange={setStylePreset}
              sentiment={sentiment}
              onSentimentChange={setSentiment}
              canvasSize={currentCanvasSize}
              onSizeChange={handleCanvasSizeChange}
              resolvedStyle={resolvedStyle}
              onMake={handleMake}
              adjustments={adjustments}
              onAdjustmentsChange={setAdjustments}
            />

            <div className="bg-dark-900/40 border border-dark-800 rounded-xl p-3 relative min-h-[360px]">
              <CanvasEditor
                onCanvasReady={handleCanvasReady}
                canvasWidth={currentSize.width}
                canvasHeight={currentSize.height}
                overlayOptions={overlayOptions}
              />

              <div className="absolute top-3 left-3 flex gap-2 text-[11px] text-dark-200">
                {hints.map((hint) => (
                  <span key={hint.key} className="bg-dark-800/80 border border-dark-700 rounded-full px-2 py-0.5">
                    {hint.message}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-3 left-3 flex gap-2 text-[11px]">
                {['ruleOfThirds', 'golden', 'centerFocus'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setGridType(type)}
                    className={`px-2 py-1 rounded-md border ${
                      gridType === type
                        ? 'bg-indigo-500/30 border-indigo-400 text-indigo-50'
                        : 'bg-dark-800/70 border-dark-700 text-dark-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 flex gap-3">
            <LightingPanel activePreset={lightingPreset} onChange={setLightingPreset} />
          </div>
        </main>

        {/* Right Property Panel */}
        <PropertyPanel
          canvas={canvas}
          selectedObject={selectedObject}
        />
      </div>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-dark-800/50 px-4 py-1.5 flex justify-between items-center text-[10px] text-dark-500 select-none">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
           <span>Ready</span>
        </div>

        <div className="flex items-center gap-1">
          Made with ❤️ by{' '}
          <a
            href="https://reelscode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Reelscode
          </a>
          <span className="text-dark-700 mx-1">|</span>
          <span>v2.2.0 Professional</span>
        </div>
      </footer>
    </div>
  )
}

export default App
