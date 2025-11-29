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
import { Download, FileHtml, FileCss, FileJs, CheckCircle } from '@phosphor-icons/react'
import { generateVanillaExport, downloadFile, downloadAllFiles } from '@/lib/export-generator'
import { toast } from 'sonner'

export default function ExportButton() {
  const [isOpen, setIsOpen] = useState(false)
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadSingle(filename)}
                    >
                      <Download size={16} />
                    </Button>
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
  )
}
