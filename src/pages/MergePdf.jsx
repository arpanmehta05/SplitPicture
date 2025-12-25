import { ToolPageLayout, ToolHeader } from '../components/layout'
import { Card, Button, Spinner, Alert } from '../components/ui'
import { MergeIcon, CloudUploadIcon } from '../components/icons'
import { FeatureGrid, MERGE_FEATURES } from '../components/shared'
import { DraggableFileList, usePdfMerger } from '../features/merger'

export default function MergePdf() {
  const {
    files,
    isDragging,
    isMerging,
    progress,
    error,
    draggedIndex,
    fileInputRef,
    dropHandlers,
    handleInputChange,
    openFilePicker,
    reorderHandlers,
    removeFile,
    clearAll,
    mergePdfs,
    canMerge
  } = usePdfMerger()

  return (
    <ToolPageLayout maxWidth="max-w-4xl">
      <ToolHeader
        icon={MergeIcon}
        iconBgColor="bg-blue-100"
        iconColor="text-[#1A73E8]"
        title="Merge PDF Files"
        description="Combine multiple PDF documents into a single file"
      />

      {/* Main Card */}
      <Card variant="outlined" padding="none" className="overflow-hidden">
        {/* Drop Zone */}
        <div
          {...dropHandlers}
          onClick={openFilePicker}
          className={`
            p-8 border-b border-gray-100 cursor-pointer transition-all
            ${isDragging ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center text-center">
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors
              ${isDragging ? 'bg-[#1A73E8] text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              <CloudUploadIcon className="w-7 h-7" />
            </div>
            <p className="font-medium text-gray-900 mb-1">
              {isDragging ? 'Drop PDFs here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">PDF files only</p>
          </div>
        </div>

        {/* File List */}
        <DraggableFileList
          files={files}
          draggedIndex={draggedIndex}
          reorderHandlers={reorderHandlers}
          onRemove={removeFile}
        />

        {/* Actions Footer */}
        {files.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            {/* Error Alert */}
            {error && (
              <Alert variant="error" className="mb-3" dismissible>
                {error}
              </Alert>
            )}
            
            {/* Progress */}
            {progress && (
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                {isMerging && <Spinner size="sm" />}
                <span>{progress}</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearAll}
                disabled={isMerging}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                onClick={mergePdfs}
                disabled={!canMerge}
                loading={isMerging}
                leftIcon={<MergeIcon />}
                fullWidth
              >
                {isMerging ? 'Merging...' : `Merge ${files.length} PDFs`}
              </Button>
            </div>
            
            {/* Warning */}
            {files.length < 2 && (
              <p className="text-xs text-amber-600 mt-2 text-center">
                Add at least 2 PDF files to merge
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Features */}
      <FeatureGrid features={MERGE_FEATURES} />
    </ToolPageLayout>
  )
}
