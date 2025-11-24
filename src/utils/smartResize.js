/**
 * Smart Resizing Logic for Fabric.js Canvas
 * Handles intelligent resizing of objects when canvas dimensions change
 */

export const smartResizeCanvas = (canvas, oldWidth, oldHeight, newWidth, newHeight) => {
  if (!canvas) return

  const scaleX = newWidth / oldWidth
  const scaleY = newHeight / oldHeight

  // 1. Resize Background (Cover Mode)
  // We want the background to always cover the entire canvas without stretching if possible,
  // or simple stretch if it's a solid color/simple pattern.
  // For complex images, we might want 'cover' behavior.
  // For now, we'll stick to stretching for background color/images to fill the space,
  // but we could enhance this to be 'cover' (crop) style later.

  if (canvas.backgroundImage) {
    const bg = canvas.backgroundImage
    // If it's an image, let's try to 'cover' it
    const bgScale = Math.max(newWidth / bg.width, newHeight / bg.height)
    bg.set({
      scaleX: bgScale,
      scaleY: bgScale,
      left: (newWidth - bg.width * bgScale) / 2,
      top: (newHeight - bg.height * bgScale) / 2
    })
  }

  // 2. Resize Objects (Smart Layout)
  const objects = canvas.getObjects()

  objects.forEach((obj) => {
    // Skip if object is locked or hidden
    if (!obj.visible) return

    // Calculate relative position (0.0 to 1.0) based on OLD size
    const relX = obj.left / oldWidth
    const relY = obj.top / oldHeight

    // Determine content type
    const isText = obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text'

    // STRATEGY:
    // - Background-like elements (very large rects) -> Stretch to fill
    // - Content elements (Text, Images, Icons) -> Reposition relative to center/edges, keep aspect ratio

    const isBackgroundElement = (obj.width * obj.scaleX > oldWidth * 0.9) && (obj.height * obj.scaleY > oldHeight * 0.9)

    if (isBackgroundElement) {
      // Background elements: Stretch to fit new dimension
      obj.set({
        width: newWidth / obj.scaleX, // Adjust width to fill
        height: newHeight / obj.scaleY, // Adjust height to fill
        left: 0,
        top: 0
      })
    } else {
      // Content elements: Smart Reposition

      // Calculate new position
      let newLeft = newWidth * relX
      let newTop = newHeight * relY

      // ANCHORING LOGIC
      // Detect if object was close to an edge, and stick to it
      const edgeThreshold = 0.15 // 15% margin

      const isLeft = relX < edgeThreshold
      const isRight = relX > (1 - edgeThreshold)
      const isTop = relY < edgeThreshold
      const isBottom = relY > (1 - edgeThreshold)
      const isCenterX = !isLeft && !isRight
      const isCenterY = !isTop && !isBottom

      if (isRight) {
        // Keep distance from right edge
        const distRight = oldWidth - obj.left
        newLeft = newWidth - distRight
      } else if (isCenterX) {
        // Keep centered
        newLeft = newWidth * 0.5 + (obj.left - oldWidth * 0.5)
      }

      if (isBottom) {
        // Keep distance from bottom edge
        const distBottom = oldHeight - obj.top
        newTop = newHeight - distBottom
      } else if (isCenterY) {
        // Keep centered
        newTop = newHeight * 0.5 + (obj.top - oldHeight * 0.5)
      }

      // TEXT RESIZING
      // Don't stretch text! Maybe scale it slightly if canvas gets MUCH smaller/bigger
      // but preserve aspect ratio.
      // Average scale factor
      const avgScale = (scaleX + scaleY) / 2

      // Limit scaling to avoid extreme sizes
      // e.g. only scale if size difference is significant (>20%)
      // For now, let's keep text size constant or slightly responsive
      // obj.scale(obj.scaleX * avgScale) // This would scale text size

      // Apply new coordinates
      obj.set({
        left: newLeft,
        top: newTop
      })

      obj.setCoords()
    }
  })

  // 3. Update Canvas Dimensions
  canvas.setWidth(newWidth)
  canvas.setHeight(newHeight)

  // 4. Render
  canvas.requestRenderAll()
}
