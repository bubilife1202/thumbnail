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

    // Initialize Fabric canvas
    const canvas = new Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    })

    // Enable object controls
    canvas.selection = true
    canvas.renderAll()

    setFabricCanvas(canvas)
    onCanvasReady(canvas)

    // Handle window resize
    const handleResize = () => {
      fitCanvasToContainer(canvas, canvasWidth, canvasHeight)
    }

    window.addEventListener('resize', handleResize)

    // Initial fit with delay to ensure DOM is ready
    setTimeout(() => {
      fitCanvasToContainer(canvas, canvasWidth, canvasHeight)
    }, 100)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
    }
  }, [canvasWidth, canvasHeight, onCanvasReady])

  const fitCanvasToContainer = (canvas, width, height) => {
    if (!containerRef.current || !canvas) return

    const container = containerRef.current
    // Reserve space for zoom controls (120px) and canvas info (80px) and padding (80px)
    const containerWidth = container.clientWidth - 80
    const containerHeight = container.clientHeight - 200

    const scaleX = containerWidth / width
    const scaleY = containerHeight / height
    const scale = Math.min(scaleX, scaleY, 0.9) // Max 90% to leave breathing room

    setZoom(scale)
    canvas.setZoom(scale)
    canvas.setViewportTransform([scale, 0, 0, scale, 0, 0])
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
      className="flex-1 flex flex-col items-center justify-center bg-dark-900 relative overflow-hidden"
    >
      {/* Canvas Container */}
      <div className="relative">
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
