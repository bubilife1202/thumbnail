import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import CanvasEditor from './components/CanvasEditor'
import PropertyPanel from './components/PropertyPanel'
import { getTemplatesBySize } from './data/templates'
import { canvasSizes, DEFAULT_CANVAS_SIZE } from './data/canvasSizes'
import TemplateShell from './components/layout/TemplateShell'

function App() {
  const [canvas, setCanvas] = useState(null)
  const [selectedObject, setSelectedObject] = useState(null)
  const [projectName, setProjectName] = useState('Untitled Thumbnail')
  const [hasLoadedInitialTemplate, setHasLoadedInitialTemplate] = useState(false)
  const [currentCanvasSize, setCurrentCanvasSize] = useState(DEFAULT_CANVAS_SIZE)

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

    // 기존 캔버스 크기
    const oldWidth = oldSize.width
    const oldHeight = oldSize.height

    // 새 캔버스 크기
    const newWidth = newSize.width
    const newHeight = newSize.height

    // 비율 계산
    const scaleX = newWidth / oldWidth
    const scaleY = newHeight / oldHeight

    // 모든 오브젝트 비율에 맞게 조정 (크기 변경 전)
    const objects = canvas.getObjects()
    objects.forEach((obj) => {
      obj.set({
        left: obj.left * scaleX,
        top: obj.top * scaleY,
        scaleX: obj.scaleX * scaleX,
        scaleY: obj.scaleY * scaleY
      })
      obj.setCoords()
    })

    // 캔버스 크기 변경 (안전한 방법)
    canvas.setWidth(newWidth)
    canvas.setHeight(newHeight)

    // 선택 해제 및 리렌더링
    canvas.discardActiveObject()
    setSelectedObject(null)
    canvas.renderAll()

    // 상태 업데이트
    setCurrentCanvasSize(newSizeId)

    // 화면에 맞게 자동 조정
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 50)
  }

  const currentSize = canvasSizes[currentCanvasSize]

  const railCardClass = 'h-full bg-dark-900/90 border border-dark-800/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/30'

  const footer = (
    <footer className="px-4 py-1.5 flex justify-between items-center text-[10px] text-dark-500 select-none">
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
  )

  return (
    <TemplateShell
      header={(
        <Header
          projectName={projectName}
          setProjectName={setProjectName}
          canvas={canvas}
          currentCanvasSize={currentCanvasSize}
          onCanvasSizeChange={handleCanvasSizeChange}
        />
      )}
      leftRail={(
        <div className={`${railCardClass} flex`}>
          <Toolbar canvas={canvas} onLoadTemplate={handleLoadTemplate} currentCanvasSize={currentCanvasSize} />
        </div>
      )}
      main={(
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-3 border-b border-dark-800/60">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_0_6px_rgba(79,70,229,0.15)]" />
              <div className="flex flex-col">
                <span className="text-xs text-dark-400">캔버스 크기</span>
                <span className="text-sm font-semibold text-white leading-tight">
                  {currentSize.platform} · {currentSize.name} ({currentSize.width}×{currentSize.height})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-dark-500">
              <span className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-200 border border-indigo-500/30">
                auto fit on load
              </span>
              <span className="hidden sm:inline">템플릿 로드시 자동 맞춤 & 선택 해제</span>
            </div>
          </div>

          <div className="flex-1 relative flex flex-col min-w-0">
            <CanvasEditor
              onCanvasReady={handleCanvasReady}
              canvasWidth={currentSize.width}
              canvasHeight={currentSize.height}
            />
          </div>
        </div>
      )}
      rightRail={(
        <div className={`${railCardClass} bg-dark-900/95`}>
          <PropertyPanel
            canvas={canvas}
            selectedObject={selectedObject}
          />
        </div>
      )}
      footer={footer}
    />
  )
}

export default App
