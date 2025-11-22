import { useState, useEffect, useRef } from 'react'
import { Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon } from 'lucide-react'
import * as fabric from 'fabric'
import { FabricImage } from 'fabric'

const PropertyPanel = ({ canvas, selectedObject }) => {
  const [properties, setProperties] = useState({})
  const [textPreset, setTextPreset] = useState('none')
  const imageInputRef = useRef(null)

  useEffect(() => {
    if (selectedObject) {
      setProperties({
        fill: selectedObject.fill || '#000000',
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 0,
        opacity: selectedObject.opacity || 1,
        fontSize: selectedObject.fontSize || 20,
        fontWeight: selectedObject.fontWeight || 'normal',
        fontFamily: selectedObject.fontFamily || 'Noto Sans KR, sans-serif',
        textAlign: selectedObject.textAlign || 'left',
        // Image filters
        brightness: selectedObject.filters?.find(f => f.type === 'Brightness')?.brightness || 0,
        contrast: selectedObject.filters?.find(f => f.type === 'Contrast')?.contrast || 0,
      })
    }
  }, [selectedObject])

  const updateProperty = (key, value) => {
    if (!selectedObject || !canvas) return

    selectedObject.set(key, value)
    canvas.renderAll()
    setProperties({ ...properties, [key]: value })
  }

  const deleteObject = () => {
    if (!selectedObject || !canvas) return
    canvas.remove(selectedObject)
    canvas.renderAll()
  }

  const duplicateObject = () => {
    if (!selectedObject || !canvas) return

    selectedObject.clone((cloned) => {
      cloned.set({
        left: selectedObject.left + 20,
        top: selectedObject.top + 20,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
    })
  }

  const applyTextPreset = (preset) => {
    if (!selectedObject || selectedObject.type !== 'textbox') return

    setTextPreset(preset)

    switch (preset) {
      case 'youtube':
        // YouTube style: Bold white text with thick black outline and shadow
        updateProperty('fontSize', 72)
        updateProperty('fontWeight', 900)
        updateProperty('fill', '#ffffff')
        updateProperty('stroke', '#000000')
        updateProperty('strokeWidth', 6)
        selectedObject.set('shadow', {
          color: 'rgba(0, 0, 0, 0.6)',
          blur: 10,
          offsetX: 4,
          offsetY: 4,
        })
        break

      case 'neon':
        // Neon glow effect
        updateProperty('fontSize', 64)
        updateProperty('fontWeight', 700)
        updateProperty('fill', '#ff00ff')
        updateProperty('stroke', '#00ffff')
        updateProperty('strokeWidth', 2)
        selectedObject.set('shadow', {
          color: '#ff00ff',
          blur: 20,
          offsetX: 0,
          offsetY: 0,
        })
        break

      case 'minimal':
        // Clean minimal style
        updateProperty('fontSize', 48)
        updateProperty('fontWeight', 400)
        updateProperty('fill', '#333333')
        updateProperty('stroke', '')
        updateProperty('strokeWidth', 0)
        selectedObject.set('shadow', null)
        break

      case 'outline':
        // Outline only
        updateProperty('fontSize', 56)
        updateProperty('fontWeight', 700)
        updateProperty('fill', '')
        updateProperty('stroke', '#000000')
        updateProperty('strokeWidth', 4)
        selectedObject.set('shadow', null)
        break

      default:
        break
    }

    canvas.renderAll()
  }

  const updateImageFilter = (filterType, value) => {
    if (!selectedObject || !canvas) return
    if (selectedObject.type !== 'image') return

    // Get existing filters or empty array
    const currentFilters = selectedObject.filters || []

    // Remove existing filter of this type
    const filteredFilters = currentFilters.filter(f => {
      if (filterType === 'Brightness') return !(f instanceof fabric.filters.Brightness)
      if (filterType === 'Contrast') return !(f instanceof fabric.filters.Contrast)
      return true
    })

    // Add new filter if value is not 0
    if (filterType === 'Brightness' && value !== 0) {
      filteredFilters.push(new fabric.filters.Brightness({ brightness: value }))
    } else if (filterType === 'Contrast' && value !== 0) {
      filteredFilters.push(new fabric.filters.Contrast({ contrast: value }))
    }

    selectedObject.filters = filteredFilters
    selectedObject.applyFilters()
    canvas.renderAll()

    setProperties({ ...properties, [filterType.toLowerCase()]: value })
  }

  const handleReplaceImage = () => {
    if (!selectedObject || selectedObject.type !== 'image') return
    imageInputRef.current?.click()
  }

  const handleImageFileChange = (e) => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image') return

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imgElement = new Image()
      imgElement.src = event.target.result

      imgElement.onload = () => {
        // Store current properties
        const left = selectedObject.left
        const top = selectedObject.top
        const scaleX = selectedObject.scaleX
        const scaleY = selectedObject.scaleY
        const angle = selectedObject.angle
        const filters = selectedObject.filters

        // Create new image with same position and scale
        const newImage = new FabricImage(imgElement, {
          left,
          top,
          scaleX,
          scaleY,
          angle,
          filters,
        })

        // Remove old image and add new one
        canvas.remove(selectedObject)
        canvas.add(newImage)
        canvas.setActiveObject(newImage)
        canvas.renderAll()
      }
    }
    reader.readAsDataURL(file)

    // Reset input
    e.target.value = ''
  }

  if (!selectedObject) {
    return (
      <aside className="w-80 bg-dark-900 border-l border-dark-700 p-6 overflow-y-auto">
        <div className="text-center text-gray-500 mt-10">
          <p className="text-sm">객체를 선택하세요</p>
          <p className="text-xs mt-2 text-gray-600">
            선택한 객체의 속성을<br />이곳에서 편집할 수 있습니다
          </p>
        </div>
      </aside>
    )
  }

  const isText = selectedObject.type === 'textbox'
  const isImage = selectedObject.type === 'image'

  return (
    <aside className="w-80 bg-dark-900 border-l border-dark-700 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-200 mb-4">속성</h2>

      {/* Object Type Badge */}
      <div className="bg-dark-800 rounded-lg p-3 mb-4 border border-dark-700">
        <p className="text-xs text-gray-500">선택된 객체</p>
        <p className="text-sm text-gray-300 font-medium capitalize mt-1">
          {selectedObject.type === 'textbox' ? '텍스트' :
           selectedObject.type === 'rect' ? '사각형' :
           selectedObject.type === 'circle' ? '원' :
           selectedObject.type === 'triangle' ? '삼각형' :
           selectedObject.type === 'image' ? '이미지' : selectedObject.type}
        </p>
      </div>

      {/* Text Presets (only for text objects) */}
      {isText && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            텍스트 프리셋
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => applyTextPreset('youtube')}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                textPreset === 'youtube'
                  ? 'bg-red-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              YouTube
            </button>
            <button
              onClick={() => applyTextPreset('neon')}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                textPreset === 'neon'
                  ? 'bg-purple-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Neon
            </button>
            <button
              onClick={() => applyTextPreset('minimal')}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                textPreset === 'minimal'
                  ? 'bg-gray-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Minimal
            </button>
            <button
              onClick={() => applyTextPreset('outline')}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                textPreset === 'outline'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Outline
            </button>
          </div>
        </div>
      )}

      {/* Text Properties */}
      {isText && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              폰트
            </label>
            <select
              value={properties.fontFamily || 'Noto Sans KR, sans-serif'}
              onChange={(e) => updateProperty('fontFamily', e.target.value)}
              className="w-full bg-dark-800 border border-dark-600 text-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="Noto Sans KR, sans-serif">Noto Sans KR</option>
              <option value="Black Han Sans, sans-serif">Black Han Sans</option>
              <option value="Do Hyeon, sans-serif">Do Hyeon</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Courier New, monospace">Courier New</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              폰트 크기
            </label>
            <input
              type="range"
              min="12"
              max="200"
              value={properties.fontSize || 20}
              onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{properties.fontSize}px</div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              정렬
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateProperty('textAlign', 'left')}
                className={`flex-1 p-2 rounded ${
                  properties.textAlign === 'left' ? 'bg-indigo-600' : 'bg-dark-800 hover:bg-dark-700'
                }`}
              >
                <AlignLeft size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => updateProperty('textAlign', 'center')}
                className={`flex-1 p-2 rounded ${
                  properties.textAlign === 'center' ? 'bg-indigo-600' : 'bg-dark-800 hover:bg-dark-700'
                }`}
              >
                <AlignCenter size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => updateProperty('textAlign', 'right')}
                className={`flex-1 p-2 rounded ${
                  properties.textAlign === 'right' ? 'bg-indigo-600' : 'bg-dark-800 hover:bg-dark-700'
                }`}
              >
                <AlignRight size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Image Filters */}
      {isImage && (
        <>
          {/* Hidden file input */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          {/* Replace Image Button */}
          <div className="mb-4">
            <button
              onClick={handleReplaceImage}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <ImageIcon size={18} />
              이미지 교체
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              밝기
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={properties.brightness || 0}
              onChange={(e) => updateImageFilter('Brightness', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((properties.brightness || 0) * 100)}%
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              대비
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={properties.contrast || 0}
              onChange={(e) => updateImageFilter('Contrast', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((properties.contrast || 0) * 100)}%
            </div>
          </div>
        </>
      )}

      {/* Common Properties */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          채우기 색상
        </label>
        <input
          type="color"
          value={properties.fill || '#000000'}
          onChange={(e) => updateProperty('fill', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          테두리 색상
        </label>
        <input
          type="color"
          value={properties.stroke || '#000000'}
          onChange={(e) => updateProperty('stroke', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          테두리 두께
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={properties.strokeWidth || 0}
          onChange={(e) => updateProperty('strokeWidth', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">{properties.strokeWidth}px</div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          투명도
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={properties.opacity || 1}
          onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">
          {Math.round((properties.opacity || 1) * 100)}%
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={duplicateObject}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded text-sm transition-colors"
        >
          <Copy size={16} />
          복제
        </button>
        <button
          onClick={deleteObject}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors"
        >
          <Trash2 size={16} />
          삭제
        </button>
      </div>
    </aside>
  )
}

export default PropertyPanel
