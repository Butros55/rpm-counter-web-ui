import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Download, FileHtml, FileCss, FileJs, CheckCircle, Eye } from '@phosphor-icons/react'
import { generateVanillaExport, downloadFile, downloadAllFiles } from '@/lib/export-generator'
import { toast } from 'sonner'

export default function ExportButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<{ name: string; content: string } | null>(null)
  const [files, setFiles] = useState<ReturnType<typeof generateVanillaExport> | null>(null)

  const handleGenerate = () => {
    const exportedFiles = generateVanillaExport()
    setFiles(exportedFiles)
    toast.success('Files generated successfully!')
  }

  const handleDownloadAll = () => {
    if (!files) return
    downloadAllFiles(files)
    toast.success('Downloading all files...')
  }

  const handleDownloadSingle = (filename: string) => {
    if (!files) return
    downloadFile(filename, files[filename as keyof typeof files])
    toast.success(`Downloaded ${filename}`)
  }

  const handlePreview = (filename: string) => {
    if (!files) return
    setPreviewFile({ name: filename, content: files[filename as keyof typeof files] })
  }

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.html')) return <FileHtml size={20} weight="duotone" />
    if (filename.endsWith('.css')) return <FileCss size={20} weight="duotone" />
    if (filename.endsWith('.js')) return <FileJs size={20} weight="duotone" />
    return <Download size={20} />
  }

  const getFileSize = (content: string) => {
    const bytes = new Blob([content]).size
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2" onClick={handleGenerate}>
            <Download weight="bold" size={18} />
            Export for ESP32
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Export Vanilla HTML/CSS/JS Files</DialogTitle>
            <DialogDescription>
              Download standalone files ready to upload to your ESP32 device. These files work without any build tools or dependencies.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} weight="fill" className="text-accent" />
                <span className="font-medium">4 files generated</span>
              </div>
              <Button onClick={handleDownloadAll} size="sm">
                Download All
              </Button>
            </div>

            <div className="space-y-2">
              {files && Object.entries(files).map(([filename, content]) => (
                <Card key={filename}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          {getFileIcon(filename)}
                        </div>
                        <div>
                          <div className="font-mono text-sm font-medium">{filename}</div>
                          <div className="text-xs text-muted-foreground">
                            {getFileSize(content)} • {content.split('\n').length} lines
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(filename)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadSingle(filename)}
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Deployment Instructions</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Download all 4 files to your computer</li>
                <li>Upload to ESP32 using LittleFS or SPIFFS file system</li>
                <li>Ensure files are in the root directory of the file system</li>
                <li>ESP32 web server should serve index.html at the root path</li>
                <li>Access the interface by navigating to your ESP32's IP address</li>
              </ol>
            </div>

            <div className="bg-card border border-border p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Technical Details</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Pure vanilla JavaScript - no frameworks or build tools required</li>
                <li>• Mobile-first responsive design</li>
                <li>• Dark theme optimized for automotive use</li>
                <li>• All API endpoints match your existing ESP32 backend</li>
                <li>• Auto-polling for real-time status updates every 2.5 seconds</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewFile && getFileIcon(previewFile.name)}
              <span className="font-mono">{previewFile?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Preview of generated code - {previewFile && getFileSize(previewFile.content)} • {previewFile?.content.split('\n').length} lines
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-border bg-background">
            <pre className="h-full overflow-auto p-4 text-xs font-mono leading-relaxed">
              <code>{previewFile?.content}</code>
            </pre>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewFile(null)}>
              Close
            </Button>
            {previewFile && (
              <Button onClick={() => handleDownloadSingle(previewFile.name)}>
                <Download size={16} />
                Download {previewFile.name}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
