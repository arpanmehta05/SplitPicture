import { 
  Header, 
  UploadZone, 
  ImagePreview, 
  ActionButtons, 
  FeatureCards,
  ImageEditor,
  useImageProcessor,
  STAGES
} from '../features/splitter'
import { ToolPageLayout } from '../components/layout'
import { Button, Card, Alert, ProgressBar } from '../components/ui'
import { SplitIcon, PencilIcon, CheckIcon } from '../components/icons'

export default function SplitPdf() {
  const {
    imageFile,
    imagePreview,
    isProcessing,
    progress,
    pdfBlob,
    error,
    isDragging,
    conversionMode,
    stage,
    editedImageUrl,
    fileInputRef,
    canvasRef,
    editorRef,
    processImage,
    handleInputChange,
    downloadPdf,
    reset,
    openFilePicker,
    dragHandlers,
    startEditing,
    applyEdits,
    cancelEditing
  } = useImageProcessor()

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Navigation */}
      <ToolPageLayout maxWidth={stage === STAGES.EDIT ? 'max-w-5xl' : 'max-w-3xl'}>
        <Header />
        
        {/* Editor Mode - Full Width */}
        {stage === STAGES.EDIT && imagePreview && (
          <Card variant="outlined" className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Quick Edit Mode</h2>
                <p className="text-sm text-gray-500">Make edits before converting to PDF</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={applyEdits}
                  leftIcon={<CheckIcon />}
                >
                  Apply Edits
                </Button>
              </div>
            </div>
            <ImageEditor 
              ref={editorRef}
              imageUrl={imagePreview}
            />
          </Card>
        )}
        
        {/* Upload / Preview / Processing Mode */}
        {stage !== STAGES.EDIT && (
          <Card variant="outlined">
            {!imageFile && (
              <UploadZone 
                ref={fileInputRef}
                isDragging={isDragging}
                dragHandlers={dragHandlers}
                onInputChange={handleInputChange}
                onClick={openFilePicker}
              />
            )}
            {imageFile && (
              <div className="space-y-5">
                <ImagePreview 
                  file={imageFile}
                  previewUrl={editedImageUrl || imagePreview}
                  onRemove={reset}
                  isProcessing={isProcessing}
                />
                
                {/* Edit Badge if edited */}
                {editedImageUrl && (
                  <Alert variant="success">
                    <div className="flex items-center justify-between w-full">
                      <span>Image has been edited</span>
                      <button 
                        onClick={startEditing}
                        className="text-green-700 hover:text-green-800 underline font-medium"
                      >
                        Edit again
                      </button>
                    </div>
                  </Alert>
                )}
                
                {error && <Alert variant="error">{error}</Alert>}
                
                {isProcessing && (
                  <ProgressBar 
                    value={(progress.current / progress.total) * 100} 
                    showLabel 
                    label={`Processing page ${progress.current} of ${progress.total}`}
                  />
                )}
                
                {/* Action Buttons with Quick Edit */}
                {!pdfBlob && !isProcessing && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="secondary"
                      onClick={startEditing}
                      leftIcon={<PencilIcon />}
                      fullWidth
                    >
                      Quick Edit
                    </Button>
                    <Button
                      variant="primary"
                      onClick={processImage}
                      leftIcon={<SplitIcon />}
                      fullWidth
                      className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                    >
                      Convert to PDF
                    </Button>
                  </div>
                )}
                
                {/* Download / Reset buttons after processing */}
                {pdfBlob && (
                  <ActionButtons 
                    pdfBlob={pdfBlob}
                    isProcessing={isProcessing}
                    onProcess={processImage}
                    onDownload={downloadPdf}
                    onReset={reset}
                  />
                )}
                
                {pdfBlob && (
                  <Alert variant="success" title="PDF Created Successfully!">
                    Your {progress.total}-page PDF is ready to download.
                  </Alert>
                )}
              </div>
            )}
          </Card>
        )}
        <FeatureCards />
      </ToolPageLayout>
    </div>
  )
}
