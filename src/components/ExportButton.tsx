import { useState, useEffect } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, FileHtml, FileCss, FileJs, CheckCircle, Eye, Copy, Check, Folder, FolderOpen, FileZip, Package, Warning } from '@phosphor-icons/react'
import { generateVanillaExport, downloadFile, downloadAllFiles, saveFilesToDirectory } from '@/lib/export-generator'
import { createReactBuildZip, downloadZipFile, estimateBuildSize, formatBytes } from '@/lib/react-build-export'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

export default function ExportButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('vanilla')
  const [previewFile, setPreviewFile] = useState<{ name: string; content: string } | null>(null)
  const [files, setFiles] = useState<ReturnType<typeof generateVanillaExport> | null>(null)
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [exportFolderName, setExportFolderName] = useKV<string>('export-folder-name', 'webserver')
  const [hasFileSystemAccess, setHasFileSystemAccess] = useState(false)
  const [isGeneratingZip, setIsGeneratingZip] = useState(false)

  useEffect(() => {
    setHasFileSystemAccess('showDirectoryPicker' in window)
  }, [])

  const handleGenerate = () => {
    const exportedFiles = generateVanillaExport()
    setFiles(exportedFiles)
    setActiveTab('vanilla')
    toast.success('Vanilla files generated successfully!')
  }

  const handleGenerateReactBuild = async () => {
    setIsGeneratingZip(true)
    try {
      const zip = await createReactBuildZip(true)
      downloadZipFile(zip, 'esp32-react-build-setup.zip')
      toast.success('React build setup downloaded!')
    } catch (error) {
      toast.error('Failed to generate React build package')
      console.error(error)
    } finally {
      setIsGeneratingZip(false)
    }
  }

  const handleDownloadAll = () => {
    if (!files) return
    downloadAllFiles(files)
    toast.success('Downloading all files...')
  }

  const handleSelectFolder = async () => {
    if (!files) return
    
    try {
      const folderName = await saveFilesToDirectory(files)
      setExportFolderName(folderName)
      toast.success(`Files saved to folder: ${folderName}`)
    } catch (error: any) {
      if (error.message !== 'Folder selection cancelled') {
        toast.error('Failed to save files to folder')
        console.error(error)
      }
    }
  }

  const handleExportToFolder = async () => {
    if (!files) return
    
    if (!exportFolderName) {
      await handleSelectFolder()
      return
    }

    try {
      const folderName = await saveFilesToDirectory(files)
      setExportFolderName(folderName)
      toast.success(`Files updated in: ${folderName}`)
    } catch (error: any) {
      if (error.message === 'Folder selection cancelled') {
        return
      }
      toast.error('Failed to save files. Please select folder again.')
      setExportFolderName('')
    }
  }

  const handleChangeFolder = () => {
    setExportFolderName('')
    toast.info('Export folder cleared. Select a new folder on next export.')
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

  const handleCopyToClipboard = async (filename: string) => {
    if (!files) return
    const content = files[filename as keyof typeof files]
    try {
      await navigator.clipboard.writeText(content)
      setCopiedFile(filename)
      toast.success(`Copied ${filename} to clipboard`)
      setTimeout(() => setCopiedFile(null), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const getLanguage = (filename: string): string => {
    if (filename.endsWith('.html')) return 'markup'
    if (filename.endsWith('.css')) return 'css'
    if (filename.endsWith('.js')) return 'javascript'
    return 'markup'
  }

  useEffect(() => {
    if (previewFile) {
      setTimeout(() => Prism.highlightAll(), 0)
    }
  }, [previewFile])

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
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Export for ESP32</DialogTitle>
            <DialogDescription>
              Choose between vanilla HTML/CSS/JS (recommended) or full React build (advanced)
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vanilla" className="gap-2">
                <FileHtml size={18} weight="duotone" />
                Vanilla Export
              </TabsTrigger>
              <TabsTrigger value="react" className="gap-2">
                <Package size={18} weight="duotone" />
                React Build
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vanilla" className="space-y-4 mt-4">
              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={24} weight="fill" className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Recommended for ESP32</h4>
                      <p className="text-sm text-muted-foreground">
                        Lightweight vanilla files (~20KB total) that work on any ESP32 with minimal storage. 
                        Provides ~95% visual match to the React version.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                  <span className="font-medium">4 files generated</span>
                </div>
                <div className="flex gap-2">
                  {hasFileSystemAccess && (
                    <Button 
                      onClick={handleExportToFolder} 
                      size="sm"
                      className="gap-2"
                    >
                      {exportFolderName ? (
                        <>
                          <FolderOpen size={16} weight="fill" />
                          Export to {exportFolderName}
                        </>
                      ) : (
                        <>
                          <Folder size={16} weight="fill" />
                          Select Folder
                        </>
                      )}
                    </Button>
                  )}
                  <Button onClick={handleDownloadAll} size="sm" variant="outline">
                    Download All
                  </Button>
                </div>
              </div>

              {hasFileSystemAccess && exportFolderName && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <Folder size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Export folder: <span className="font-medium text-foreground">{exportFolderName}</span>
                    </span>
                  </div>
                  <Button 
                    onClick={handleChangeFolder} 
                    size="sm" 
                    variant="ghost"
                    className="h-7 text-xs"
                  >
                    Change
                  </Button>
                </div>
              )}

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
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyToClipboard(filename)}
                          title="Copy to clipboard"
                        >
                          {copiedFile === filename ? (
                            <Check size={16} className="text-accent" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(filename)}
                          title="Preview code"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadSingle(filename)}
                          title="Download file"
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Deployment Instructions</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Download all 4 files or export to your <code className="text-xs bg-background px-1 py-0.5 rounded">webserver</code> folder</li>
                  <li>Upload to ESP32 using LittleFS or SPIFFS file system</li>
                  <li>Ensure files are in the root directory of the file system</li>
                  <li>ESP32 web server should serve index.html at the root path</li>
                  <li>Access the interface by navigating to your ESP32's IP address</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="react" className="space-y-4 mt-4">
              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Warning size={24} weight="fill" className="text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Advanced Option</h4>
                      <p className="text-sm text-muted-foreground">
                        Full React build provides 100% identical appearance but requires ~500KB storage and 
                        manual build process. Recommended only for ESP32-S3 or boards with ample storage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Uncompressed</div>
                    <div className="text-2xl font-bold">{formatBytes(estimateBuildSize().totalUncompressed)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Gzipped (est.)</div>
                    <div className="text-2xl font-bold text-accent">{formatBytes(estimateBuildSize().estimatedGzipped)}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-card/50 border border-border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Comparison: Vanilla vs React Build</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4">Feature</th>
                        <th className="text-left py-2 px-4">Vanilla</th>
                        <th className="text-left py-2 pl-4">React Build</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">File Size</td>
                        <td className="py-2 px-4">~20KB</td>
                        <td className="py-2 pl-4">~500KB</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">Appearance</td>
                        <td className="py-2 px-4">95% match</td>
                        <td className="py-2 pl-4">100% identical</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">Animations</td>
                        <td className="py-2 px-4">CSS</td>
                        <td className="py-2 pl-4">Framer Motion</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4">Setup</td>
                        <td className="py-2 px-4">Simple</td>
                        <td className="py-2 pl-4">Moderate</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">ESP32 Storage</td>
                        <td className="py-2 px-4">Minimal</td>
                        <td className="py-2 pl-4">1-2MB required</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-sm">What's Included</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    README.md with complete deployment guide
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    esp32-server.ino Arduino sketch template
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    platformio.ini configuration for PlatformIO
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent" />
                    BUILD_INSTRUCTIONS.md with manual build steps
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Warning size={18} className="text-yellow-500" />
                  Manual Build Required
                </h4>
                <p className="text-sm text-muted-foreground">
                  This package contains setup files only. You must run <code className="text-xs bg-background px-1 py-0.5 rounded">npm run build</code> 
                  in your development environment to generate the actual React build files. See BUILD_INSTRUCTIONS.md for details.
                </p>
              </div>

              <Button 
                onClick={handleGenerateReactBuild} 
                className="w-full gap-2"
                disabled={isGeneratingZip}
              >
                {isGeneratingZip ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Generating Package...
                  </>
                ) : (
                  <>
                    <FileZip size={18} weight="fill" />
                    Download React Build Setup Package
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="border-t border-border pt-4 mt-4">
            <div className="text-xs text-muted-foreground">
              <strong>Tip:</strong> For production ESP32 devices with limited storage, we strongly recommend the Vanilla Export option.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-[85vw] w-[85vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card/50">
            <DialogTitle className="flex items-center gap-2">
              {previewFile && getFileIcon(previewFile.name)}
              <span className="font-mono">{previewFile?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Preview of generated code - {previewFile && getFileSize(previewFile.content)} • {previewFile?.content.split('\n').length} lines
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-6 py-4 custom-scrollbar">
            <div className="rounded-lg border border-border bg-[#1d1f21] overflow-hidden">
              <pre className="overflow-auto p-4 text-sm leading-relaxed m-0 custom-scrollbar" style={{ background: '#1d1f21' }}>
                <code className={`language-${previewFile ? getLanguage(previewFile.name) : 'markup'}`}>
                  {previewFile?.content}
                </code>
              </pre>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 px-6 py-4 border-t border-border bg-card/50">
            <Button 
              variant="outline" 
              onClick={() => previewFile && handleCopyToClipboard(previewFile.name)}
              className="gap-2"
            >
              {copiedFile === previewFile?.name ? (
                <>
                  <Check size={16} className="text-accent" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewFile(null)}>
                Close
              </Button>
              {previewFile && (
                <Button onClick={() => handleDownloadSingle(previewFile.name)} className="gap-2">
                  <Download size={16} />
                  Download {previewFile.name}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
