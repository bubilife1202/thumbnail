import { Type, Image as ImageIcon, Square, Circle, Palette, Upload } from 'lucide-react'
import { Textbox, Rect, Circle as FabricCircle, Triangle, FabricImage } from 'fabric'

const Toolbar = ({ canvas }) => {
  const addText = () => {
    if (!canvas) return

    const text = new Textbox('텍스트를 입력하세요', {
      left: 100,
      top: 100,
      fontSize: 48,
      fontWeight: 900,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 3,
      shadow: {
        color: 'rgba(0, 0, 0, 0.5)',
        blur: 10,
        offsetX: 3,
        offsetY: 3,
      },
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  const addRectangle = () => {
    if (!canvas) return

    const rect = new Rect({
      left: 150,
      top: 150,
      width: 200,
      height: 120,
      fill: '#6366f1',
      stroke: '#4f46e5',
      strokeWidth: 2,
    })

    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()
  }

  const addCircle = () => {
    if (!canvas) return

    const circle = new FabricCircle({
      left: 150,
      top: 150,
      radius: 80,
      fill: '#8b5cf6',
      stroke: '#7c3aed',
      strokeWidth: 2,
    })

    canvas.add(circle)
    canvas.setActiveObject(circle)
    canvas.renderAll()
  }

  const addTriangle = () => {
    if (!canvas) return

    const triangle = new Triangle({
      left: 150,
      top: 150,
      width: 150,
      height: 150,
      fill: '#ec4899',
      stroke: '#db2777',
      strokeWidth: 2,
    })

    canvas.add(triangle)
    canvas.setActiveObject(triangle)
    canvas.renderAll()
  }

  const handleImageUpload = (e) => {
    if (!canvas) return

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imgElement = new Image()
      imgElement.src = event.target.result

      imgElement.onload = () => {
        const fabricImage = new FabricImage(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        })
        canvas.add(fabricImage)
        canvas.setActiveObject(fabricImage)
        canvas.renderAll()
      }
    }
    reader.readAsDataURL(file)

    // Reset input
    e.target.value = ''
  }

  const changeBackgroundColor = () => {
    if (!canvas) return

    const input = document.createElement('input')
    input.type = 'color'
    input.value = canvas.backgroundColor || '#ffffff'
    input.onchange = (e) => {
      canvas.setBackgroundColor(e.target.value, () => {
        canvas.renderAll()
      })
    }
    input.click()
  }

  const ToolButton = ({ icon: Icon, label, onClick, ...props }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-dark-800 transition-colors group"
      {...props}
    >
      <Icon size={24} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
      <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
        {label}
      </span>
    </button>
  )

  return (
    <aside className="w-20 bg-dark-900 border-r border-dark-700 flex flex-col items-center py-6 gap-2">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 rotate-0">
        Tools
      </h2>

      <ToolButton icon={Type} label="텍스트" onClick={addText} />

      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-dark-800 transition-colors group">
          <Upload size={24} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
          <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
            이미지
          </span>
        </div>
      </label>

      <div className="h-px w-12 bg-dark-700 my-2" />

      <ToolButton icon={Square} label="사각형" onClick={addRectangle} />
      <ToolButton icon={Circle} label="원" onClick={addCircle} />
      <ToolButton
        icon={() => (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 group-hover:text-indigo-400 transition-colors"
          >
            <path d="M12 2 L22 20 L2 20 Z" />
          </svg>
        )}
        label="삼각형"
        onClick={addTriangle}
      />

      <div className="h-px w-12 bg-dark-700 my-2" />

      <ToolButton icon={Palette} label="배경색" onClick={changeBackgroundColor} />
    </aside>
  )
}

export default Toolbar
