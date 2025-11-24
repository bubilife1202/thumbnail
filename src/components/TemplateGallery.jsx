import { getTemplatesBySize } from '../data/templates'

const TemplateGallery = ({ onLoadTemplate, currentCanvasSize }) => {
  const templates = getTemplatesBySize(currentCanvasSize)
  const featuredTemplates = templates.filter((template) => template.featured)
  const regularTemplates = templates.filter((template) => !template.featured)
  const defaultTemplate = templates[0]

  return (
    <div className="p-4 pr-2 space-y-4">
      <div className="flex items-start justify-between pr-2 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">템플릿 선택</h3>
          <p className="text-[11px] text-gray-500 mt-1">도메인별 추천 프리셋과 전체 템플릿을 골라보세요.</p>
        </div>
        {defaultTemplate && (
          <div className="text-[10px] text-indigo-200 px-2 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/30 whitespace-nowrap">
            기본 적용: {defaultTemplate.name}
          </div>
        )}
      </div>

      {featuredTemplates.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.08em] text-indigo-200 font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_0_6px_rgba(79,70,229,0.12)]" />
            추천 프리셋
          </div>
          <div className="grid grid-cols-1 gap-3 pr-2">
            {featuredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onLoadTemplate(template)}
                className="group relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/50 via-dark-900/70 to-dark-900/90 p-4 transition-all hover:border-indigo-400 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0 drop-shadow-lg">{template.thumbnail}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white leading-tight">{template.name}</h4>
                      {template.tone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-200 border border-indigo-400/30">
                          {template.tone}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-100/80 line-clamp-2">{template.description}</p>
                    {template.useCases && template.useCases.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {template.useCases.map((useCase) => (
                          <span
                            key={useCase}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-dark-800/80 text-indigo-100 border border-indigo-500/20"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between pr-2">
          <span className="text-[11px] text-gray-400 uppercase tracking-[0.08em] font-semibold">전체 템플릿</span>
          <span className="text-[10px] text-gray-500">클릭 시 즉시 적용 · 모두 편집 가능</span>
        </div>

        {regularTemplates.length === 0 ? (
          <div className="p-4 pr-2 rounded-lg border border-dark-700 bg-dark-800/70 text-xs text-gray-400">
            이 캔버스 사이즈에 맞는 템플릿이 없습니다. 좌측 상단 사이즈를 변경하거나, 새로운 프리셋을 추가해주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 pr-2">
            {regularTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onLoadTemplate(template)}
                className="group relative bg-dark-800/80 hover:bg-dark-800 border border-dark-700 hover:border-indigo-500/60 rounded-xl p-3 transition-all duration-200 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{template.thumbnail}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors">
                        {template.name}
                      </h4>
                      {template.tagline && (
                        <span className="text-[10px] text-dark-300 bg-dark-700/80 px-2 py-0.5 rounded-full border border-dark-600/80">
                          {template.tagline}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                    {template.useCases && template.useCases.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {template.useCases.map((useCase) => (
                          <span
                            key={useCase}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-dark-800 text-gray-300 border border-dark-600"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 rounded-xl transition-colors pointer-events-none" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateGallery
