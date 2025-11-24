import clsx from 'clsx'

const PageContainer = ({ children, className, maxWidth = 'var(--layout-max-width)', padding = 'var(--layout-shell-padding)' }) => {
  return (
    <div
      className={clsx('layout-shell', className)}
      style={{ maxWidth, paddingLeft: padding, paddingRight: padding }}
    >
      {children}
    </div>
  )
}

export default PageContainer
