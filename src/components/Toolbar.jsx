import { useState } from 'react'
import { Type, Image as ImageIcon, Square, Circle, Palette, Upload, Layers } from 'lucide-react'
import { Textbox, Rect, Circle as FabricCircle, Triangle, FabricImage } from 'fabric'
import TemplateGallery from './TemplateGallery'

const Toolbar = ({ canvas, onLoadTemplate, currentCanvasSize }) => {
  const [activeTab, setActiveTab] = useState('templates')

  const handleTemplateLoad = (template) => {
    onLoadTemplate(template)
    // Switch to text tab after loading template so user can see the canvas
    setTimeout(() => {
      setActiveTab('text')
    }, 100)
  }

  const addText = (preset = 'default') => {
    if (!canvas) return

    let textProps = {
      left: 100,
      top: 100,
      fontSize: 48,
      fontWeight: 700,
      fontFamily: 'Noto Sans KR, sans-serif',
      fill: '#ffffff',
    }

    // Apply preset styles
    switch (preset) {
      case 'title':
        textProps = {
          ...textProps,
          text: '제목을 입력하세요',
          fontSize: 72,
          fontWeight: 900,
          fontFamily: 'Black Han Sans, sans-serif',
          stroke: '#000000',
          strokeWidth: 4,
          shadow: {
            color: 'rgba(0, 0, 0, 0.5)',
            blur: 10,
            offsetX: 3,
            offsetY: 3,
          },
        }
        break
      case 'subtitle':
        textProps = {
          ...textProps,
          text: '부제목을 입력하세요',
          fontSize: 42,
          fontWeight: 500,
          fill: '#e5e7eb',
        }
        break
      case 'body':
        textProps = {
          ...textProps,
          text: '본문 텍스트',
          fontSize: 32,
          fontWeight: 400,
          fill: '#d1d5db',
        }
        break
      default:
        textProps.text = '텍스트를 입력하세요'
    }

    const text = new Textbox(textProps.text, textProps)

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

  const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-indigo-600 text-white'
          : 'text-gray-400 hover:bg-dark-800 hover:text-gray-200'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )

  const ActionButton = ({ icon: Icon, label, onClick, ...props }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-dark-700 transition-colors group text-left"
      {...props}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dark-700 group-hover:bg-dark-600 flex items-center justify-center">
        <Icon size={20} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
        {label}
      </span>
    </button>
  )

  return (
    <aside className="w-72 bg-dark-900 border-r border-dark-700 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex items-center justify-around border-b border-dark-700 p-2 gap-1">
        <TabButton
          id="templates"
          icon={Layers}
          label="템플릿"
          active={activeTab === 'templates'}
          onClick={() => setActiveTab('templates')}
        />
        <TabButton
          id="text"
          icon={Type}
          label="텍스트"
          active={activeTab === 'text'}
          onClick={() => setActiveTab('text')}
        />
        <TabButton
          id="elements"
          icon={Square}
          label="요소"
          active={activeTab === 'elements'}
          onClick={() => setActiveTab('elements')}
        />
        <TabButton
          id="upload"
          icon={Upload}
          label="업로드"
          active={activeTab === 'upload'}
          onClick={() => setActiveTab('upload')}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <TemplateGallery onLoadTemplate={handleTemplateLoad} currentCanvasSize={currentCanvasSize} />
        )}

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">텍스트 추가</h3>
            <div className="space-y-2">
              <ActionButton
                icon={Type}
                label="제목 (Title)"
                onClick={() => addText('title')}
              />
              <ActionButton
                icon={Type}
                label="부제목 (Subtitle)"
                onClick={() => addText('subtitle')}
              />
              <ActionButton
                icon={Type}
                label="본문 (Body)"
                onClick={() => addText('body')}
              />
              <ActionButton
                icon={Type}
                label="기본 텍스트"
                onClick={() => addText('default')}
              />
            </div>

            <div className="mt-4 p-3 bg-dark-800 border border-dark-700 rounded-lg">
              <p className="text-xs text-gray-500 leading-relaxed">
                💡 텍스트를 추가한 후 우측 패널에서 폰트, 크기, 색상을 변경할 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* Elements Tab */}
        {activeTab === 'elements' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">도형 추가</h3>
            <div className="space-y-2">
              <ActionButton
                icon={Square}
                label="사각형"
                onClick={addRectangle}
              />
              <ActionButton
                icon={Circle}
                label="원"
                onClick={addCircle}
              />
              <ActionButton
                icon={() => (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2 L22 20 L2 20 Z" />
                  </svg>
                )}
                label="삼각형"
                onClick={addTriangle}
              />
              <ActionButton
                icon={Palette}
                label="배경색 변경"
                onClick={changeBackgroundColor}
              />
            </div>

            <div className="mt-4 p-3 bg-dark-800 border border-dark-700 rounded-lg">
              <p className="text-xs text-gray-500 leading-relaxed">
                💡 도형을 추가한 후 드래그, 리사이징, 회전이 가능합니다.
              </p>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">이미지 업로드</h3>

            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-dark-600 hover:border-indigo-500 rounded-lg p-8 transition-colors group">
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-gray-600 group-hover:text-indigo-400 transition-colors mb-3" />
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors font-medium">
                    클릭하여 이미지 선택
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    JPG, PNG, GIF 지원
                  </p>
                </div>
              </div>
            </label>

            <div className="mt-4 p-3 bg-dark-800 border border-dark-700 rounded-lg">
              <p className="text-xs text-gray-500 leading-relaxed">
                💡 <span className="text-gray-400">팁:</span> 이미지를 업로드한 후 우측 패널에서 밝기/대비를 조절할 수 있습니다.
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                추천 이미지 사이즈
              </h4>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between py-2 border-b border-dark-800">
                  <span>유튜브 썸네일</span>
                  <span className="text-gray-400">1280 × 720</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-800">
                  <span>인스타그램</span>
                  <span className="text-gray-400">1080 × 1080</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>페이스북</span>
                  <span className="text-gray-400">1200 × 630</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Toolbar
