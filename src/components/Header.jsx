import { useState, useRef, useEffect } from 'react'
import { Save, Download, FileJson, Image as ImageIcon, ChevronDown } from 'lucide-react'
import { canvasSizes } from '../data/canvasSizes'

const Header = ({ projectName, setProjectName, canvas, currentCanvasSize, onCanvasSizeChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

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
    const currentZoom = canvas.getZoom()
    canvas.setZoom(1)
    canvas.renderAll()
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 })
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
    const dataURL = canvas.toDataURL({ format: 'jpeg', quality: 0.95, multiplier: 1 })
    canvas.setZoom(currentZoom)
    canvas.renderAll()
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${projectName}.jpg`
    link.click()
  }

  return (
    <header className="bg-dark-900 border-b border-dark-700/50 h-14 flex items-center justify-between px-4 select-none">
      {/* Left: Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tight">PT</span>
          </div>
          <span className="text-sm font-semibold text-dark-300 hidden sm:block">
            Pro Thumbnail
          </span>
        </div>

        <div className="h-4 w-px bg-dark-700" />

        {/* Project Name Input */}
        <div className="relative group">
          {isEditing ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditing(false)
              }}
              className="bg-dark-800 text-dark-100 px-3 py-1.5 rounded-md text-sm font-medium border border-dark-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none w-64 transition-all"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-dark-100 font-medium px-3 py-1.5 rounded-md hover:bg-dark-800 transition-colors text-sm text-left w-64 truncate"
            >
              {projectName}
            </button>
          )}
        </div>
      </div>

      {/* Center: Canvas Size Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
          className="flex items-center gap-3 px-3 py-1.5 hover:bg-dark-800 rounded-md transition-colors group"
        >
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-dark-200 group-hover:text-dark-100 transition-colors">
              {currentSize.platform} · {currentSize.name}
            </span>
            <span className="text-[10px] text-dark-500 group-hover:text-dark-400 font-mono">
              {currentSize.width} × {currentSize.height}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`text-dark-500 transition-transform duration-200 ${
              isSizeDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isSizeDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto overflow-x-hidden backdrop-blur-sm bg-opacity-95 p-1.5">
            <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider px-3 py-2">
              Popular
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    currentCanvasSize === size.id
                      ? 'bg-indigo-600/10 text-indigo-400'
                      : 'hover:bg-dark-800 text-dark-300 hover:text-dark-100'
                  }`}
                >
                  <span className="text-lg">{size.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">
                      {size.platform} {size.name}
                    </div>
                    <div className="text-[10px] opacity-60 font-mono">
                      {size.width}×{size.height}
                    </div>
                  </div>
                </button>
              ))}

            <div className="h-px bg-dark-800 my-1 mx-2" />

            <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider px-3 py-2">
              Others
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    currentCanvasSize === size.id
                      ? 'bg-indigo-600/10 text-indigo-400'
                      : 'hover:bg-dark-800 text-dark-300 hover:text-dark-100'
                  }`}
                >
                  <span className="text-lg opacity-50">{size.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">
                      {size.platform} {size.name}
                    </div>
                    <div className="text-[10px] opacity-60 font-mono">
                      {size.width}×{size.height}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveJSON}
          className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-all"
          title="Save Project (JSON)"
        >
          <FileJson size={18} />
        </button>

        <div className="h-4 w-px bg-dark-800 mx-1" />

        <button
          onClick={handleDownloadPNG}
          className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white rounded-md text-xs font-medium transition-all border border-dark-700"
        >
          <ImageIcon size={14} />
          PNG
        </button>

        <button
          onClick={handleDownloadJPG}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Download size={14} />
          Export JPG
        </button>
      </div>
    </header>
  )
}

export default Header
