import { DragIcon, DocumentIcon, TrashIcon } from '../../../components/icons'

const DraggableFileItem = ({
  file,
  index,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onRemove
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`
        flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200
        cursor-grab active:cursor-grabbing transition-all
        ${draggedIndex === index ? 'opacity-50 scale-[0.98]' : 'hover:border-gray-300'}
      `}
    >
      {/* Drag handle */}
      <div className="flex-shrink-0 text-gray-400 hover:text-gray-600">
        <DragIcon className="w-5 h-5" />
      </div>
      
      {/* File icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
        <DocumentIcon className="w-5 h-5 text-red-600" />
      </div>
      
      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{file.size} MB</p>
      </div>
      
      {/* Order number */}
      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
        {index + 1}
      </span>
      
      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Remove file"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

const DraggableFileList = ({
  files,
  draggedIndex,
  reorderHandlers,
  onRemove,
  className = ''
}) => {
  if (files.length === 0) return null

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          {files.length} file{files.length > 1 ? 's' : ''} selected
        </span>
        <span className="text-xs text-gray-500">Drag to reorder</span>
      </div>
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <DraggableFileItem
            key={file.id}
            file={file}
            index={index}
            draggedIndex={draggedIndex}
            onDragStart={reorderHandlers.onDragStart(index)}
            onDragOver={reorderHandlers.onDragOver(index)}
            onDragEnd={reorderHandlers.onDragEnd}
            onRemove={() => onRemove(file.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default DraggableFileList
