import { 
  Header, 
  UploadZone, 
  ImagePreview, 
  ProgressBar, 
  ActionButtons, 
  Alert, 
  FeatureCards 
} from './components'
import { useImageProcessor } from './hooks/useImageProcessor'

export default function App() {
  const {
    imageFile,
    imagePreview,
    isProcessing,
    progress,
    pdfBlob,
    error,
    isDragging,
    conversionMode,
    fileInputRef,
    canvasRef,
    processImage,
    handleInputChange,
    downloadPdf,
    reset,
    openFilePicker,
    dragHandlers
  } = useImageProcessor()

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <canvas ref={canvasRef} className="hidden" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-3xl">
        <Header />
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
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
                previewUrl={imagePreview}
                onRemove={reset}
                isProcessing={isProcessing}
              />
              {error && <Alert type="error" message={error} />}
              {isProcessing && <ProgressBar progress={progress} />}
              <ActionButtons 
                pdfBlob={pdfBlob}
                isProcessing={isProcessing}
                onProcess={processImage}
                onDownload={downloadPdf}
                onReset={reset}
              />
              {pdfBlob && (
                <Alert 
                  type="success" 
                  pageCount={progress.total}
                  conversionMode={conversionMode}
                />
              )}
            </div>
          )}
        </div>
        <FeatureCards />
      </div>
    </div>
  )
}
