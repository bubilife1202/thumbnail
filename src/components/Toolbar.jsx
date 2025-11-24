import { useState } from 'react'
import { Type, Image as ImageIcon, Square, Circle, Palette, Upload, Layers, Triangle as TriangleIcon } from 'lucide-react'
import { Textbox, Rect, Circle as FabricCircle, Triangle, FabricImage } from 'fabric'
import TemplateGallery from './TemplateGallery'

const Toolbar = ({ canvas, onLoadTemplate, currentCanvasSize }) => {
  const [activeTab, setActiveTab] = useState('templates')

  const handleTemplateLoad = (template) => {
    onLoadTemplate(template)
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
      className={`w-16 h-16 flex flex-col items-center justify-center gap-1.5 transition-all relative group
        ${active ? 'text-white' : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'}
      `}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : ''}`}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>

      {active && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-indigo-500 rounded-l-full" />
      )}
    </button>
  )

  const ActionButton = ({ icon: Icon, label, onClick, ...props }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-dark-800 border border-transparent hover:border-dark-700 transition-all group text-left"
      {...props}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dark-800 group-hover:bg-dark-700 border border-dark-700 group-hover:border-dark-600 flex items-center justify-center transition-all group-hover:shadow-lg">
        <Icon size={20} className="text-dark-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      <span className="text-sm text-dark-300 group-hover:text-dark-100 transition-colors font-medium">
        {label}
      </span>
    </button>
  )

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <nav className="w-16 bg-dark-900 border-r border-dark-700/50 flex flex-col items-center py-4 gap-2 z-10">
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
      </nav>

      {/* Drawer Content */}
      <aside className="w-72 bg-dark-900/95 border-r border-dark-700/50 flex flex-col backdrop-blur-sm">
        <div className="p-5 border-b border-dark-700/50">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {activeTab === 'templates' && '템플릿 갤러리'}
            {activeTab === 'text' && '텍스트 추가'}
            {activeTab === 'elements' && '디자인 요소'}
            {activeTab === 'upload' && '이미지 업로드'}
          </h2>
          <p className="text-xs text-dark-400 mt-1">
            {activeTab === 'templates' && '미리 만들어진 디자인을 선택하세요'}
            {activeTab === 'text' && '원하는 스타일의 텍스트를 추가하세요'}
            {activeTab === 'elements' && '도형과 배경색을 설정하세요'}
            {activeTab === 'upload' && '나만의 이미지를 사용해보세요'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <TemplateGallery onLoadTemplate={handleTemplateLoad} currentCanvasSize={currentCanvasSize} />
          )}

          {/* Text Tab */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <ActionButton
                  icon={Type}
                  label="제목 텍스트"
                  onClick={() => addText('title')}
                />
                <ActionButton
                  icon={Type}
                  label="부제목 텍스트"
                  onClick={() => addText('subtitle')}
                />
                <ActionButton
                  icon={Type}
                  label="본문 텍스트"
                  onClick={() => addText('body')}
                />
              </div>

              <div className="h-px bg-dark-800 my-4" />

              <ActionButton
                icon={Type}
                label="기본 텍스트 추가"
                onClick={() => addText('default')}
              />
            </div>
          )}

          {/* Elements Tab */}
          {activeTab === 'elements' && (
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                 <button
                   onClick={addRectangle}
                   className="flex flex-col items-center justify-center p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-indigo-500/50 transition-all group aspect-square"
                 >
                   <Square size={32} className="text-dark-400 group-hover:text-indigo-400 mb-2 transition-colors" />
                   <span className="text-xs text-dark-300 group-hover:text-dark-100">사각형</span>
                 </button>
                 <button
                   onClick={addCircle}
                   className="flex flex-col items-center justify-center p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-indigo-500/50 transition-all group aspect-square"
                 >
                   <Circle size={32} className="text-dark-400 group-hover:text-indigo-400 mb-2 transition-colors" />
                   <span className="text-xs text-dark-300 group-hover:text-dark-100">원</span>
                 </button>
                 <button
                   onClick={addTriangle}
                   className="flex flex-col items-center justify-center p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-indigo-500/50 transition-all group aspect-square"
                 >
                   <TriangleIcon size={32} className="text-dark-400 group-hover:text-indigo-400 mb-2 transition-colors" />
                   <span className="text-xs text-dark-300 group-hover:text-dark-100">삼각형</span>
                 </button>
               </div>

               <div className="h-px bg-dark-800 my-2" />

               <ActionButton
                icon={Palette}
                label="배경색 변경"
                onClick={changeBackgroundColor}
              />
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-dark-700 hover:border-indigo-500 bg-dark-800/50 hover:bg-dark-800 rounded-xl p-8 transition-all group text-center">
                  <div className="w-16 h-16 bg-dark-700 group-hover:bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Upload size={32} className="text-dark-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-dark-200 group-hover:text-white transition-colors">
                    이미지 업로드
                  </p>
                  <p className="text-xs text-dark-500 mt-2">
                    JPG, PNG, GIF 지원
                  </p>
                </div>
              </label>

              <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50">
                <h4 className="text-xs font-bold text-dark-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  권장 사이즈
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-300">YouTube Thumbnail</span>
                    <span className="text-dark-500 font-mono">1280 × 720</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-300">Instagram Square</span>
                    <span className="text-dark-500 font-mono">1080 × 1080</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-300">Facebook Cover</span>
                    <span className="text-dark-500 font-mono">1200 × 630</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default Toolbar
