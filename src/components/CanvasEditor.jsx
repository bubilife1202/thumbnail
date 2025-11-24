import { useEffect, useRef, useState } from 'react'
import { Canvas } from 'fabric'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import FloatingMenu from './FloatingMenu'
import CanvasOverlay from './CanvasOverlay'
import { getSnapPoints, getSafeZoneMask } from '../utils/layoutGrids'

const CanvasEditor = ({
  onCanvasReady,
  canvasWidth = 1280,
  canvasHeight = 720,
  overlayOptions = { gridType: 'ruleOfThirds', showGrid: true, showSafeZone: true },
}) => {
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
      if (!obj || !containerRef.current || !canvasRef.current) return

      // Calculate absolute position on the screen/container
      const canvasEl = canvas.getElement()
      // Because the canvas is scaled via CSS (transform) or Zoom, we need the transformed coordinates.
      // The most reliable way is to get the bounding rect of the object in viewport coordinates,
      // then subtract the container's bounding rect to get coordinates relative to the container.

      const containerRect = containerRef.current.getBoundingClientRect()

      // Get object center point in canvas coordinates
      const objCenter = obj.getCenterPoint()

      // Transform canvas coordinates to viewport coordinates
      // Fabric canvas.getVpCenter() gives viewport center, but we need object position.
      // We can use canvas.getSelectionElement() or just manual calc.
      // The canvas zoom level affects the internal coordinate system.

      // The canvas DOM element might also be scaled by CSS (via the parent div flex centering or scale transform?)
      // In this code, we rely on canvas.setZoom() for fitting, so the canvas DOM element size (width/height attributes) stays large?
      // No, fitCanvasToContainer sets zoom, but keeps width/height attributes?
      // Fabric's setWidth/setHeight changes the DOM element size.
      // fitCanvasToContainer uses setZoom.

      // Let's use Fabric's own coordinate transformation
      // canvas.vptCoords is the viewport transform.
      // The canvas offset on screen is needed.
      const canvasRect = canvasRef.current.getBoundingClientRect()

      // Calculate object center relative to the canvas DOM element
      // (obj x * zoom) + panX
      const vpt = canvas.getViewportTransform()
      const objCanvasX = objCenter.x * vpt[0] + vpt[4]
      const objCanvasY = objCenter.y * vpt[3] + vpt[5]

      // Now add the canvas's offset relative to the container
      const relativeLeft = (canvasRect.left - containerRect.left) + objCanvasX
      const relativeTop = (canvasRect.top - containerRect.top) + objCanvasY

      setMenuPosition({
        left: relativeLeft,
        top: relativeTop
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
      // Hide menu while dragging
      setMenuVisible(false)

      // Improved Snapping Logic
      const obj = e.target
      const w = canvas.width
      const h = canvas.height
      const snapDist = 12

      // Calculate actual center of the object regardless of origin
      const objCenter = obj.getCenterPoint()

      let newLeft = obj.left
      let newTop = obj.top

      const snapPoints = getSnapPoints(w, h, overlayOptions.gridType)
      snapPoints.forEach((pt) => {
        if (Math.abs(objCenter.x - pt.x) < snapDist) {
          newLeft += pt.x - objCenter.x
        }
        if (Math.abs(objCenter.y - pt.y) < snapDist) {
          newTop += pt.y - objCenter.y
        }
      })

      // Snap X (Center)
      if (Math.abs(objCenter.x - w / 2) < snapDist) {
        // We need to shift the object so its center matches w/2
        // shift amount = w/2 - currentCenterX
        const shiftX = w / 2 - objCenter.x
        newLeft += shiftX
      }

      // Snap Y (Center)
      if (Math.abs(objCenter.y - h / 2) < snapDist) {
        const shiftY = h / 2 - objCenter.y
        newTop += shiftY
      }

      if (overlayOptions.showSafeZone) {
        const safe = getSafeZoneMask(w, h)
        const halfW = obj.getScaledWidth() / 2
        const halfH = obj.getScaledHeight() / 2
        const clampedX = Math.min(Math.max(objCenter.x, safe.x + halfW), safe.x + safe.width - halfW)
        const clampedY = Math.min(Math.max(objCenter.y, safe.y + halfH), safe.y + safe.height - halfH)
        newLeft += clampedX - objCenter.x
        newTop += clampedY - objCenter.y
      }

      // Apply changes if snapped
      if (newLeft !== obj.left || newTop !== obj.top) {
        obj.set({ left: newLeft, top: newTop })
      }
    }

    const handleObjectModified = (e) => {
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
    canvas.on('object:modified', handleObjectModified)

    const handleResize = () => {
      fitCanvasToContainer(canvas, canvas.getWidth(), canvas.getHeight())
      // Also update menu position if visible
      if (canvas.getActiveObject()) {
        updateMenuPosition(canvas.getActiveObject())
      }
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
    if (selectedObject && menuVisible) {
        setMenuVisible(false)
    }
  }, [zoom])

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
      <FloatingMenu
        visible={menuVisible}
        position={menuPosition}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
      />

      <div className="relative flex items-center justify-center transition-transform duration-200 ease-out">
        <canvas ref={canvasRef} className="shadow-2xl rounded-sm" />
        <CanvasOverlay
          width={canvasWidth}
          height={canvasHeight}
          gridType={overlayOptions.gridType}
          showGrid={overlayOptions.showGrid}
          showSafeZone={overlayOptions.showSafeZone}
          onToggleGrid={overlayOptions.onToggleGrid}
          onToggleSafeZone={overlayOptions.onToggleSafeZone}
        />
      </div>

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

      <div className="absolute top-4 left-4 bg-dark-800/80 backdrop-blur-sm rounded-md px-3 py-1.5 text-xs text-dark-400 border border-dark-700/50 font-mono flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        {canvasWidth} × {canvasHeight}
      </div>
    </div>
  )
}

export default CanvasEditor
