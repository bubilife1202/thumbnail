import { useState, useRef, useEffect } from 'react'
import { Save, Download, FileJson, Image as ImageIcon, ChevronDown } from 'lucide-react'
import { canvasSizes } from '../data/canvasSizes'

const Header = ({ projectName, setProjectName, canvas, currentCanvasSize, onCanvasSizeChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSizeDropdownOpen(false)
      }
    }

    if (isSizeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSizeDropdownOpen])

  const currentSize = canvasSizes[currentCanvasSize]

  const handleSaveJSON = () => {
    if (!canvas) return

    const json = canvas.toJSON()
    const dataStr = JSON.stringify(json, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${projectName}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPNG = () => {
    if (!canvas) return

    // Temporarily set zoom to 1 for export
    const currentZoom = canvas.getZoom()
    canvas.setZoom(1)
    canvas.renderAll()

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    })

    // Restore zoom
    canvas.setZoom(currentZoom)
    canvas.renderAll()

    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${projectName}.png`
    link.click()
  }

  const handleDownloadJPG = () => {
    if (!canvas) return

    const currentZoom = canvas.getZoom()
    canvas.setZoom(1)
    canvas.renderAll()

    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.95,
      multiplier: 1,
    })

    canvas.setZoom(currentZoom)
    canvas.renderAll()

    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${projectName}.jpg`
    link.click()
  }

  return (
    <header className="bg-dark-900 border-b border-dark-700 px-6 py-3 flex items-center justify-between">
      {/* Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PT</span>
          </div>
          <h1 className="text-xl font-bold text-gray-100">Pro Thumbnail Editor</h1>
        </div>

        <div className="h-6 w-px bg-dark-700" />

        {/* Project Name */}
        {isEditing ? (
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(false)
            }}
            className="bg-dark-800 text-gray-200 px-3 py-1 rounded border border-dark-600 focus:border-indigo-500 outline-none"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded hover:bg-dark-800"
          >
            {projectName}
          </button>
        )}
      </div>

      {/* Canvas Size Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors"
        >
          <span className="text-2xl">{currentSize.icon}</span>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-200">
              {currentSize.platform} - {currentSize.name}
            </div>
            <div className="text-xs text-gray-500">
              {currentSize.width} × {currentSize.height} px
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${
              isSizeDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isSizeDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-dark-800 border border-dark-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
            {/* 인기 플랫폼 */}
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                인기 플랫폼
              </div>
              {Object.values(canvasSizes)
                .filter((size) => size.popular)
                .map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      onCanvasSizeChange(size.id)
                      setIsSizeDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      currentCanvasSize === size.id
                        ? 'bg-indigo-600 text-white'
                        : 'hover:bg-dark-700 text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{size.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">
                        {size.platform} - {size.name}
                      </div>
                      <div className="text-xs opacity-75">
                        {size.width} × {size.height} px ({size.aspectRatio})
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            {/* 구분선 */}
            <div className="border-t border-dark-700 my-1"></div>

            {/* 기타 플랫폼 */}
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                기타 플랫폼
              </div>
              {Object.values(canvasSizes)
                .filter((size) => !size.popular)
                .map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      onCanvasSizeChange(size.id)
                      setIsSizeDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      currentCanvasSize === size.id
                        ? 'bg-indigo-600 text-white'
                        : 'hover:bg-dark-700 text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{size.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">
                        {size.platform} - {size.name}
                      </div>
                      <div className="text-xs opacity-75">
                        {size.width} × {size.height} px ({size.aspectRatio})
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveJSON}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-200 rounded-lg transition-colors border border-dark-600"
          title="Save as JSON"
        >
          <FileJson size={18} />
          <span className="hidden sm:inline">Save JSON</span>
        </button>

        <button
          onClick={handleDownloadPNG}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          title="Download as PNG"
        >
          <ImageIcon size={18} />
          <span className="hidden sm:inline">PNG</span>
        </button>

        <button
          onClick={handleDownloadJPG}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          title="Download as JPG"
        >
          <Download size={18} />
          <span className="hidden sm:inline">JPG</span>
        </button>
      </div>
    </header>
  )
}

export default Header
