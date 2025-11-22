import { useState } from 'react'
import { Save, Download, FileJson, Image as ImageIcon } from 'lucide-react'

const Header = ({ projectName, setProjectName, canvas }) => {
  const [isEditing, setIsEditing] = useState(false)

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
