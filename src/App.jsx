import { useState, useEffect } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import CanvasEditor from './components/CanvasEditor'
import PropertyPanel from './components/PropertyPanel'
import { templates } from './data/templates'

function App() {
  const [canvas, setCanvas] = useState(null)
  const [selectedObject, setSelectedObject] = useState(null)
  const [projectName, setProjectName] = useState('Untitled Thumbnail')
  const [hasLoadedInitialTemplate, setHasLoadedInitialTemplate] = useState(false)

  const handleCanvasReady = (fabricCanvas) => {
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
  }

  // Auto-load first template on startup
  useEffect(() => {
    if (canvas && !hasLoadedInitialTemplate && templates.length > 0) {
      // Load the first template automatically
      handleLoadTemplate(templates[0])
      setHasLoadedInitialTemplate(true)
    }
  }, [canvas, hasLoadedInitialTemplate])

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
    })
  }

  return (
    <div className="flex flex-col h-screen bg-dark-950">
      {/* Header */}
      <Header
        projectName={projectName}
        setProjectName={setProjectName}
        canvas={canvas}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <Toolbar canvas={canvas} onLoadTemplate={handleLoadTemplate} />

        {/* Canvas Area */}
        <CanvasEditor onCanvasReady={handleCanvasReady} />

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
