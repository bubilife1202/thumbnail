import clsx from 'clsx'
import PageContainer from './PageContainer'

const TemplateShell = ({
  header,
  leftRail,
  main,
  rightRail,
  footer,
  maxWidth = 'var(--layout-max-width)',
  railWidth = 'var(--layout-rail-width)',
  inspectorWidth = 'var(--layout-inspector-width)',
  gap = 'var(--layout-shell-gap)',
}) => {
  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 selection:bg-indigo-500/30">
      <div className="flex flex-col min-h-screen">
        {header && (
          <div className="sticky top-0 z-30 border-b border-dark-800/60 bg-dark-950/90 backdrop-blur-md">
            <PageContainer maxWidth={maxWidth} className="py-2">
              {header}
            </PageContainer>
          </div>
        )}

        <div className="flex-1">
          <PageContainer maxWidth={maxWidth} className="h-full py-4">
            <div
              className="layout-grid"
              style={{
                gridTemplateColumns: `${railWidth} minmax(0, 1fr) ${inspectorWidth}`,
                gap,
              }}
            >
              {leftRail && <div className={clsx('layout-left-rail h-full')}>{leftRail}</div>}
              <div className={clsx('layout-main-pane h-full flex flex-col')}>{main}</div>
              {rightRail && <div className={clsx('layout-right-rail h-full')}>{rightRail}</div>}
            </div>
          </PageContainer>
        </div>

        {footer && (
          <div className="border-t border-dark-800/60 bg-dark-950/90 backdrop-blur-md">
            <PageContainer maxWidth={maxWidth} className="py-2">
              {footer}
            </PageContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateShell
