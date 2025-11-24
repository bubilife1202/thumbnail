import { useState, useEffect, useRef } from 'react'
import { Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Sparkles, Sliders, Type, Layers } from 'lucide-react'
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
    // Preset logic remains same...
     switch (preset) {
      case 'youtube':
        updateProperty('fontSize', 72)
        updateProperty('fontWeight', 900)
        updateProperty('fill', '#ffffff')
        updateProperty('stroke', '#000000')
        updateProperty('strokeWidth', 6)
        selectedObject.set('shadow', { color: 'rgba(0, 0, 0, 0.6)', blur: 10, offsetX: 4, offsetY: 4 })
        break
      case 'neon':
        updateProperty('fontSize', 64)
        updateProperty('fontWeight', 700)
        updateProperty('fill', '#ff00ff')
        updateProperty('stroke', '#00ffff')
        updateProperty('strokeWidth', 2)
        selectedObject.set('shadow', { color: '#ff00ff', blur: 20, offsetX: 0, offsetY: 0 })
        break
      case 'minimal':
        updateProperty('fontSize', 48)
        updateProperty('fontWeight', 400)
        updateProperty('fill', '#333333')
        updateProperty('stroke', '')
        updateProperty('strokeWidth', 0)
        selectedObject.set('shadow', null)
        break
      case 'outline':
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

    const currentFilters = selectedObject.filters || []
    const filteredFilters = currentFilters.filter(f => {
      if (filterType === 'Brightness') return !(f instanceof fabric.filters.Brightness)
      if (filterType === 'Contrast') return !(f instanceof fabric.filters.Contrast)
      return true
    })

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
        const { left, top, scaleX, scaleY, angle, filters } = selectedObject
        const newImage = new FabricImage(imgElement, { left, top, scaleX, scaleY, angle, filters })
        canvas.remove(selectedObject)
        canvas.add(newImage)
        canvas.setActiveObject(newImage)
        canvas.renderAll()
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  if (!selectedObject) {
    return (
      <aside className="w-80 bg-dark-900 border-l border-dark-700/50 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <Layers size={40} className="text-dark-600" />
        </div>
        <h3 className="text-lg font-bold text-dark-300 mb-2">No Selection</h3>
        <p className="text-sm text-dark-500 leading-relaxed max-w-[200px]">
          Click on an object in the canvas to edit its properties
        </p>
      </aside>
    )
  }

  const isText = selectedObject.type === 'textbox'
  const isImage = selectedObject.type === 'image'

  const PropertySection = ({ title, icon: Icon, children }) => (
    <div className="mb-6 p-4 bg-dark-800/40 rounded-xl border border-dark-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-dark-400 uppercase tracking-wider">
        {Icon && <Icon size={14} />}
        {title}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  const Label = ({ children }) => (
    <label className="block text-xs font-medium text-dark-300 mb-2">
      {children}
    </label>
  )

  return (
    <aside className="w-80 bg-dark-900 border-l border-dark-700/50 p-4 overflow-y-auto custom-scrollbar select-none">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <Sliders size={16} className="text-indigo-400" />
          PROPERTIES
        </h2>
        <span className="text-[10px] font-mono bg-dark-800 text-dark-400 px-2 py-1 rounded capitalize border border-dark-700">
          {selectedObject.type}
        </span>
      </div>

      {/* Text Presets */}
      {isText && (
        <PropertySection title="Quick Styles" icon={Sparkles}>
          <div className="grid grid-cols-2 gap-2">
             {[
               { id: 'youtube', label: 'YouTube', color: 'bg-red-500' },
               { id: 'neon', label: 'Neon', color: 'bg-purple-500' },
               { id: 'minimal', label: 'Minimal', color: 'bg-zinc-500' },
               { id: 'outline', label: 'Outline', color: 'bg-indigo-500' }
             ].map(preset => (
               <button
                key={preset.id}
                onClick={() => applyTextPreset(preset.id)}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all border ${
                  textPreset === preset.id
                    ? 'bg-dark-700 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-dark-800 border-transparent hover:bg-dark-700 text-dark-300 hover:text-dark-100'
                }`}
               >
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${preset.color}`} />
                   {preset.label}
                 </div>
               </button>
             ))}
          </div>
        </PropertySection>
      )}

      {/* Typography */}
      {isText && (
        <PropertySection title="Typography" icon={Type}>
          <div>
            <Label>Font Family</Label>
            <select
              value={properties.fontFamily || 'Noto Sans KR, sans-serif'}
              onChange={(e) => updateProperty('fontFamily', e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 text-dark-200 rounded-lg px-3 py-2.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
            >
              <option value="Noto Sans KR, sans-serif">Noto Sans KR</option>
              <option value="Black Han Sans, sans-serif">Black Han Sans</option>
              <option value="Do Hyeon, sans-serif">Do Hyeon</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Courier New, monospace">Courier New</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Size</Label>
              <span className="text-[10px] text-dark-400 font-mono">{properties.fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="200"
              value={properties.fontSize || 20}
              onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <Label>Alignment</Label>
            <div className="flex bg-dark-900 p-1 rounded-lg border border-dark-700">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateProperty('textAlign', align)}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    properties.textAlign === align
                      ? 'bg-dark-700 text-white shadow-sm'
                      : 'text-dark-500 hover:text-dark-300'
                  }`}
                >
                  {align === 'left' && <AlignLeft size={16} className="mx-auto" />}
                  {align === 'center' && <AlignCenter size={16} className="mx-auto" />}
                  {align === 'right' && <AlignRight size={16} className="mx-auto" />}
                </button>
              ))}
            </div>
          </div>
        </PropertySection>
      )}

      {/* Image Controls */}
      {isImage && (
        <PropertySection title="Image Adjustments" icon={ImageIcon}>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          <button
            onClick={handleReplaceImage}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-lg text-xs font-medium transition-all mb-4 border border-dark-600 hover:border-dark-500"
          >
            <ImageIcon size={14} />
            Replace Image
          </button>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Brightness</Label>
              <span className="text-[10px] text-dark-400 font-mono">{Math.round((properties.brightness || 0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={properties.brightness || 0}
              onChange={(e) => updateImageFilter('Brightness', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Contrast</Label>
              <span className="text-[10px] text-dark-400 font-mono">{Math.round((properties.contrast || 0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={properties.contrast || 0}
              onChange={(e) => updateImageFilter('Contrast', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </PropertySection>
      )}

      {/* Appearance */}
      <PropertySection title="Appearance" icon={Palette}>
        <div>
          <Label>Fill Color</Label>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-dark-600 shadow-sm ring-2 ring-dark-800 hover:ring-indigo-500 transition-all cursor-pointer">
              <input
                type="color"
                value={properties.fill || '#000000'}
                onChange={(e) => updateProperty('fill', e.target.value)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
              />
            </div>
            <span className="text-xs font-mono text-dark-400 uppercase">{properties.fill}</span>
          </div>
        </div>

        <div>
          <Label>Stroke Color</Label>
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full overflow-hidden border border-dark-600 shadow-sm ring-2 ring-dark-800 hover:ring-indigo-500 transition-all cursor-pointer">
              <input
                type="color"
                value={properties.stroke || '#000000'}
                onChange={(e) => updateProperty('stroke', e.target.value)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
              />
            </div>
            <span className="text-xs font-mono text-dark-400 uppercase">{properties.stroke}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label>Stroke Width</Label>
            <span className="text-[10px] text-dark-400 font-mono">{properties.strokeWidth}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={properties.strokeWidth || 0}
            onChange={(e) => updateProperty('strokeWidth', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
           <div className="flex justify-between mb-2">
            <Label>Opacity</Label>
            <span className="text-[10px] text-dark-400 font-mono">{Math.round((properties.opacity || 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={properties.opacity || 1}
            onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </PropertySection>

      {/* Actions */}
      <div className="flex gap-2 mt-8 mb-4">
        <button
          onClick={duplicateObject}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-dark-200 rounded-xl text-xs font-bold transition-all border border-dark-700 hover:border-dark-600"
        >
          <Copy size={14} />
          DUPLICATE
        </button>
        <button
          onClick={deleteObject}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-all border border-red-500/20 hover:border-red-500/30"
        >
          <Trash2 size={14} />
          DELETE
        </button>
      </div>
    </aside>
  )
}

export default PropertyPanel
