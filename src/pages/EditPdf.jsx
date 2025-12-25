import { ToolPageLayout, ToolHeader } from '../components/layout'
import { Card, Button, Spinner, Alert } from '../components/ui'
import { 
  PencilIcon, 
  SelectIcon, 
  EraserIcon, 
  TextIcon, 
  CloudUploadIcon, 
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../components/icons'
import { FeatureGrid, EDIT_FEATURES } from '../components/shared'
import { usePdfEditor, TOOLS } from '../features/editor'

// Tool Button Component
const ToolButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-blue-100 text-[#1A73E8]' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
)

export default function EditPdf() {
  const {
    pdfFile,
    pdfDoc,
    numPages,
    currentPage,
    activeTool,
    isLoading,
    isSaving,
    isDragging,
    error,
    editingText,
    
    fileInputRef,
    canvasRef,
    overlayCanvasRef,
    containerRef,
    
    reset,
    savePdf,
    selectTool,
    nextPage,
    prevPage,
    
    dropHandlers,
    handleInputChange,
    openFilePicker,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTextInput,
    finishTextEdit,
    
    canSave
  } = usePdfEditor()

  return (
    <ToolPageLayout maxWidth="max-w-6xl">
      {!pdfDoc ? (
        // Upload State
        <div className="max-w-2xl mx-auto">
          <ToolHeader
            icon={PencilIcon}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            title="Edit PDF"
            description="Whiteout mistakes and add text overlays to any PDF"
          />

          {error && (
            <Alert variant="error" className="mb-4" dismissible>
              {error}
            </Alert>
          )}

          <Card
            variant="outlined"
            padding="none"
            className={`border-2 border-dashed cursor-pointer transition-all ${
              isDragging ? 'border-[#1A73E8] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={openFilePicker}
            {...dropHandlers}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center text-center p-12">
              {isLoading ? (
                <Spinner size="lg" className="mb-4" />
              ) : (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                  isDragging ? 'bg-[#1A73E8] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <CloudUploadIcon className="w-7 h-7" />
                </div>
              )}
              <p className="font-medium text-gray-900 mb-1">
                {isLoading ? 'Loading PDF...' : isDragging ? 'Drop PDF here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">PDF files only</p>
            </div>
          </Card>

          <FeatureGrid features={EDIT_FEATURES} />
        </div>
      ) : (
        // Editor State
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card variant="outlined" className="sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
              
              {/* Tool Buttons */}
              <div className="space-y-2 mb-6">
                <ToolButton
                  active={activeTool === TOOLS.SELECT}
                  onClick={() => selectTool(TOOLS.SELECT)}
                  icon={SelectIcon}
                  label="Select"
                />
                <ToolButton
                  active={activeTool === TOOLS.ERASER}
                  onClick={() => selectTool(TOOLS.ERASER)}
                  icon={EraserIcon}
                  label="Whiteout"
                />
                <ToolButton
                  active={activeTool === TOOLS.TEXT}
                  onClick={() => selectTool(TOOLS.TEXT)}
                  icon={TextIcon}
                  label="Add Text"
                />
              </div>

              {/* Page Navigation */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Page</h4>
                <div className="flex items-center justify-between bg-gray-100 rounded-xl p-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-gray-900">
                    {currentPage} / {numPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= numPages}
                    className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <Button
                variant="primary"
                onClick={savePdf}
                disabled={!canSave}
                loading={isSaving}
                leftIcon={<DownloadIcon />}
                fullWidth
              >
                {isSaving ? 'Saving...' : 'Save PDF'}
              </Button>

              {/* New File */}
              <Button
                variant="ghost"
                onClick={reset}
                fullWidth
                className="mt-2"
              >
                Upload Different PDF
              </Button>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 min-w-0">
            <Card 
              variant="outlined"
              padding="sm"
              className="overflow-auto"
              style={{ maxHeight: 'calc(100vh - 140px)' }}
            >
              <div ref={containerRef} className="relative inline-block">
                {/* PDF Canvas */}
                <canvas ref={canvasRef} className="block" />
                
                {/* Overlay Canvas for annotations */}
                <canvas
                  ref={overlayCanvasRef}
                  className={`absolute top-0 left-0 ${
                    activeTool === TOOLS.ERASER ? 'cursor-crosshair' : 
                    activeTool === TOOLS.TEXT ? 'cursor-text' : 'cursor-default'
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />

                {/* Text Input Overlay */}
                {editingText && (
                  <input
                    type="text"
                    value={editingText.text}
                    onChange={handleTextInput}
                    onBlur={finishTextEdit}
                    autoFocus
                    placeholder="Type here..."
                    className="absolute bg-blue-50 border-2 border-[#1A73E8] rounded px-2 py-1 text-sm outline-none min-w-[150px]"
                    style={{
                      left: editingText.x,
                      top: editingText.y - editingText.fontSize - 4,
                      fontSize: `${editingText.fontSize}px`
                    }}
                  />
                )}
              </div>
            </Card>

            {/* Tool Instructions */}
            <p className="mt-3 text-center text-sm text-gray-500">
              {activeTool === TOOLS.SELECT && 'Click on text elements to edit them'}
              {activeTool === TOOLS.ERASER && 'Click and drag to draw white rectangles over content'}
              {activeTool === TOOLS.TEXT && 'Click anywhere to add text. Press Enter to confirm.'}
            </p>
          </div>
        </div>
      )}
    </ToolPageLayout>
  )
}
