import { getTemplatesBySize } from '../data/templates'

const TemplateGallery = ({ onLoadTemplate, currentCanvasSize }) => {
  const templates = getTemplatesBySize(currentCanvasSize)

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">템플릿 선택</h3>
      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onLoadTemplate(template)}
            className="group relative bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-indigo-500 rounded-lg p-3 transition-all duration-200 text-left"
          >
            {/* Template Thumbnail Emoji */}
            <div className="flex items-center gap-3">
              <div className="text-3xl flex-shrink-0">{template.thumbnail}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 rounded-lg transition-colors pointer-events-none" />
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-dark-800 border border-dark-700 rounded-lg">
        <p className="text-xs text-gray-500 leading-relaxed">
          💡 <span className="text-gray-400">팁:</span> 템플릿을 클릭하면 캔버스에 즉시 적용됩니다. 모든 요소는 수정 가능합니다.
        </p>
      </div>
    </div>
  )
}

export default TemplateGallery
