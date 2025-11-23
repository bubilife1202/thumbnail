import { useEffect, useRef, useState } from 'react'
import { Canvas } from 'fabric'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

const CanvasEditor = ({ onCanvasReady, canvasWidth = 1280, canvasHeight = 720 }) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [fabricCanvas, setFabricCanvas] = useState(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric canvas (only once)
    const canvas = new Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    })

    // Enable object controls
    canvas.selection = true

    // Set initial zoom to 100%
    canvas.setZoom(1)
    setZoom(1)
    canvas.renderAll()

    setFabricCanvas(canvas)
    onCanvasReady(canvas)

    // No auto-fit on resize - user controls zoom manually

    return () => {
      canvas.dispose()
    }
  }, [])

  // Handle canvas size changes separately
  useEffect(() => {
    if (!fabricCanvas) return

    // Update canvas dimensions when size props change
    fabricCanvas.setWidth(canvasWidth)
    fabricCanvas.setHeight(canvasHeight)

    // Keep zoom at 100% after size change
    fabricCanvas.setZoom(zoom)
    fabricCanvas.renderAll()
  }, [canvasWidth, canvasHeight, fabricCanvas])

  const fitCanvasToContainer = (canvas, width, height) => {
    if (!containerRef.current || !canvas) return

    const container = containerRef.current
    // Get container dimensions and reserve space for UI elements
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    // Calculate available space (leave 10% padding on each side)
    const availableWidth = containerWidth * 0.8
    const availableHeight = containerHeight * 0.8

    // Calculate scale to fit canvas within available space
    const scaleX = availableWidth / width
    const scaleY = availableHeight / height
    const scale = Math.min(scaleX, scaleY)

    setZoom(scale)
    canvas.setZoom(scale)
    canvas.renderAll()
  }

  const handleZoomIn = () => {
    if (!fabricCanvas) return
    const newZoom = Math.min(zoom + 0.1, 2)
    setZoom(newZoom)
    fabricCanvas.setZoom(newZoom)
    fabricCanvas.renderAll()
  }

  const handleZoomOut = () => {
    if (!fabricCanvas) return
    const newZoom = Math.max(zoom - 0.1, 0.1)
    setZoom(newZoom)
    fabricCanvas.setZoom(newZoom)
    fabricCanvas.renderAll()
  }

  const handleFitToScreen = () => {
    if (!fabricCanvas) return
    fitCanvasToContainer(fabricCanvas, canvasWidth, canvasHeight)
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center bg-dark-900 relative overflow-auto"
    >
      {/* Canvas Container - Always centered */}
      <div className="relative flex items-center justify-center">
        <canvas ref={canvasRef} className="shadow-2xl" />
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-dark-800 rounded-lg p-2 shadow-lg border border-dark-700">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-dark-700 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} className="text-gray-300" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-dark-700 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} className="text-gray-300" />
        </button>
        <button
          onClick={handleFitToScreen}
          className="p-2 hover:bg-dark-700 rounded transition-colors"
          title="Fit to Screen"
        >
          <Maximize2 size={20} className="text-gray-300" />
        </button>
        <div className="text-xs text-center text-gray-400 pt-2 border-t border-dark-700">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Canvas Info */}
      <div className="absolute top-4 left-4 bg-dark-800 rounded-lg px-3 py-2 text-xs text-gray-400 border border-dark-700">
        {canvasWidth} × {canvasHeight} px
      </div>
    </div>
  )
}

export default CanvasEditor
