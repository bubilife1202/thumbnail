import { Trash2, Copy, Layers, ChevronUp, ChevronDown } from 'lucide-react'

const FloatingMenu = ({ visible, position, onDelete, onDuplicate, onBringForward, onSendBackward }) => {
  if (!visible) return null

  // Offset the menu slightly above the object
  const style = {
    left: position.left,
    top: position.top - 60, // 60px above
    transform: 'translate(-50%, 0)', // Center horizontally relative to object center
  }

  return (
    <div
      className="absolute z-50 flex items-center gap-1 p-1.5 bg-dark-900 border border-dark-700/50 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200"
      style={style}
      onMouseDown={(e) => e.stopPropagation()} // Prevent canvas from catching the click
    >
      <button
        onClick={onDuplicate}
        className="p-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        title="Duplicate"
      >
        <Copy size={16} />
      </button>

      <div className="w-px h-4 bg-dark-700 mx-0.5" />

      <button
        onClick={onBringForward}
        className="p-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        title="Bring Forward"
      >
        <ChevronUp size={16} />
      </button>

      <button
        onClick={onSendBackward}
        className="p-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        title="Send Backward"
      >
        <ChevronDown size={16} />
      </button>

      <div className="w-px h-4 bg-dark-700 mx-0.5" />

      <button
        onClick={onDelete}
        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>

      {/* Little triangle arrow at bottom */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-dark-900 border-r border-b border-dark-700/50 rotate-45" />
    </div>
  )
}

export default FloatingMenu
