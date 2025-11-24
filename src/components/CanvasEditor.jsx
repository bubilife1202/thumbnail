import { useEffect, useRef, useState } from 'react'
import { Canvas } from 'fabric'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import FloatingMenu from './FloatingMenu'

const CanvasEditor = ({ onCanvasReady, canvasWidth = 1280, canvasHeight = 720 }) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [fabricCanvas, setFabricCanvas] = useState(null)
  const [zoom, setZoom] = useState(1)

  // Floating Menu State
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 })
  const [selectedObject, setSelectedObject] = useState(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric canvas
    const canvas = new Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selectionColor: 'rgba(99, 102, 241, 0.1)', // Indigo selection
      selectionBorderColor: '#6366f1',
      selectionLineWidth: 1,
    })

    // Enable object controls & snapping simulation
    canvas.selection = true
    canvas.renderAll()

    setFabricCanvas(canvas)
    onCanvasReady(canvas)

    // Events for Floating Menu
    const updateMenuPosition = (obj) => {
      if (!obj || !containerRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      // Fabric object coords are relative to canvas 0,0
      // We need screen coordinates for the fixed/absolute menu
      // Actually, since menu is inside container relative, we can use container relative coords
      // But container centers the canvas with transform or flex.
      // Let's use simple bounding box logic.

      const bound = obj.getBoundingRect()
      const zoom = canvas.getZoom()

      // Calculate center top of the object in canvas coords
      const objCenterX = bound.left + bound.width / 2
      const objTopY = bound.top

      // Canvas offset in the container?
      // Since we use flex center, the canvas element is centered.
      // We can use the canvas DOM element's offset relative to the parent.

      // Let's just use the absolute page coordinates for safety if we used Portal,
      // but here we are in relative container.
      // Let's simplify: Menu is absolute in container.

      // Warning: The canvas element is scaled by CSS or Zoom?
      // Fabric zoom scales the internal drawing, but the canvas element size?
      // Fabric `setZoom` affects the context scale. `getBoundingRect` returns zoomed coords.

      // We need the offset of the canvas element within the `containerRef` div.
      const canvasEl = canvas.getElement()
      const canvasOffsetLeft = canvasEl.offsetLeft
      const canvasOffsetTop = canvasEl.offsetTop

      setMenuPosition({
        left: canvasOffsetLeft + objCenterX,
        top: canvasOffsetTop + objTopY
      })
    }

    const handleSelection = (e) => {
      const selection = e.selected || [e.target]
      if (selection.length === 1) {
        const obj = selection[0]
        setSelectedObject(obj)
        updateMenuPosition(obj)
        setMenuVisible(true)
      } else {
        setMenuVisible(false)
        setSelectedObject(null)
      }
    }

    const handleClearSelection = () => {
      setMenuVisible(false)
      setSelectedObject(null)
    }

    const handleObjectMoving = (e) => {
      // Hide menu while dragging to avoid flicker/distraction
      setMenuVisible(false)

      // Basic Snapping Logic (Simulated Smart Guides)
      const obj = e.target
      const w = canvas.width
      const h = canvas.height
      const snapDist = 10

      const centerX = obj.left + (obj.width * obj.scaleX) / 2
      const centerY = obj.top + (obj.height * obj.scaleY) / 2

      // Snap to Center
      if (Math.abs(centerX - w / 2) < snapDist) {
        obj.set({ left: w / 2 - (obj.width * obj.scaleX) / 2 })
      }
      if (Math.abs(centerY - h / 2) < snapDist) {
        obj.set({ top: h / 2 - (obj.height * obj.scaleY) / 2 })
      }
    }

    const handleObjectModified = (e) => {
       // Show menu again after drag/resize ends
       if(e.target) {
         setSelectedObject(e.target)
         updateMenuPosition(e.target)
         setMenuVisible(true)
       }
    }

    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', handleClearSelection)
    canvas.on('object:moving', handleObjectMoving)
    canvas.on('object:modified', handleObjectModified) // Covers scaling/rotating too

    // Handle window resize
    const handleResize = () => {
      fitCanvasToContainer(canvas, canvas.getWidth(), canvas.getHeight())
    }

    window.addEventListener('resize', handleResize)

    setTimeout(() => {
      fitCanvasToContainer(canvas, canvasWidth, canvasHeight)
    }, 100)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    if (!fabricCanvas) return
    // Update menu position if zoom changes or canvas moves
    if (selectedObject && menuVisible) {
        // Force re-calc position?
        // Ideally we'd trigger the update logic again but it's complex.
        // Hiding menu on zoom is safer.
        setMenuVisible(false)
    }
  }, [zoom])

  // Canvas Size Update
  useEffect(() => {
    if (!fabricCanvas) return
    fabricCanvas.setWidth(canvasWidth)
    fabricCanvas.setHeight(canvasHeight)
    setTimeout(() => {
      fitCanvasToContainer(fabricCanvas, canvasWidth, canvasHeight)
    }, 50)
  }, [canvasWidth, canvasHeight, fabricCanvas])

  const fitCanvasToContainer = (canvas, width, height) => {
    if (!containerRef.current || !canvas) return

    const container = containerRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const availableWidth = containerWidth * 0.85
    const availableHeight = containerHeight * 0.85

    const scaleX = availableWidth / width
    const scaleY = availableHeight / height
    const scale = Math.min(scaleX, scaleY)

    setZoom(scale)
    canvas.setZoom(scale)
    canvas.renderAll()
  }

  // Action Handlers
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

  // Floating Menu Actions
  const handleDelete = () => {
    if (!fabricCanvas || !selectedObject) return
    fabricCanvas.remove(selectedObject)
    fabricCanvas.discardActiveObject()
    fabricCanvas.renderAll()
    setMenuVisible(false)
  }

  const handleDuplicate = () => {
    if (!fabricCanvas || !selectedObject) return
    selectedObject.clone((cloned) => {
      cloned.set({
        left: selectedObject.left + 20,
        top: selectedObject.top + 20
      })
      fabricCanvas.add(cloned)
      fabricCanvas.setActiveObject(cloned)
      fabricCanvas.renderAll()
    })
  }

  const handleBringForward = () => {
    if (!fabricCanvas || !selectedObject) return
    fabricCanvas.bringObjectForward(selectedObject)
    fabricCanvas.renderAll()
  }

  const handleSendBackward = () => {
    if (!fabricCanvas || !selectedObject) return
    fabricCanvas.sendObjectBackwards(selectedObject)
    fabricCanvas.renderAll()
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center bg-dark-900 relative overflow-hidden"
    >
      {/* Floating Menu - Rendered inside container but absolute positioned */}
      <FloatingMenu
        visible={menuVisible}
        position={menuPosition}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
      />

      {/* Canvas Container */}
      <div className="relative flex items-center justify-center transition-transform duration-200 ease-out">
        <canvas ref={canvasRef} className="shadow-2xl rounded-sm" />
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-dark-800/80 backdrop-blur-sm rounded-lg p-1.5 shadow-lg border border-dark-700/50">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-dark-700 rounded-md transition-colors text-dark-300 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-dark-700 rounded-md transition-colors text-dark-300 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <div className="h-px bg-dark-700 mx-2" />
        <button
          onClick={handleFitToScreen}
          className="p-2 hover:bg-dark-700 rounded-md transition-colors text-dark-300 hover:text-white"
          title="Fit to Screen"
        >
          <Maximize2 size={18} />
        </button>
        <div className="text-[10px] text-center text-dark-400 font-mono py-1">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Canvas Info */}
      <div className="absolute top-4 left-4 bg-dark-800/80 backdrop-blur-sm rounded-md px-3 py-1.5 text-xs text-dark-400 border border-dark-700/50 font-mono flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        {canvasWidth} × {canvasHeight}
      </div>
    </div>
  )
}

export default CanvasEditor
