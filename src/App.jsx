import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import CanvasEditor from './components/CanvasEditor'
import PropertyPanel from './components/PropertyPanel'
import { getTemplatesBySize } from './data/templates'
import { canvasSizes, DEFAULT_CANVAS_SIZE } from './data/canvasSizes'

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

  const handleLoadTemplate = (template) => {
    if (!canvas) return

    // Clear current canvas
    canvas.clear()

    // Load template data
    canvas.loadFromJSON(template.data, () => {
      canvas.renderAll()

      // Update project name to template name
      setProjectName(template.name)

      // Clear selection
      canvas.discardActiveObject()
      setSelectedObject(null)
      canvas.renderAll()

      // Trigger resize to fit canvas to screen after template load
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 50)
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

  return (
    <div className="flex flex-col h-screen bg-dark-950">
      {/* Header */}
      <Header
        projectName={projectName}
        setProjectName={setProjectName}
        canvas={canvas}
        currentCanvasSize={currentCanvasSize}
        onCanvasSizeChange={handleCanvasSizeChange}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <Toolbar canvas={canvas} onLoadTemplate={handleLoadTemplate} currentCanvasSize={currentCanvasSize} />

        {/* Canvas Area */}
        <CanvasEditor
          onCanvasReady={handleCanvasReady}
          canvasWidth={currentSize.width}
          canvasHeight={currentSize.height}
        />

        {/* Right Property Panel */}
        <PropertyPanel
          canvas={canvas}
          selectedObject={selectedObject}
        />
      </div>

      {/* Footer */}
      <div className="bg-dark-900 border-t border-dark-700 px-4 py-2 text-center text-xs text-gray-500">
        Made with ❤️ by{' '}
        <a
          href="https://reelscode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Reelscode
        </a>
        {' '}| v2.1.0 - Template Edition
      </div>
    </div>
  )
}

export default App
