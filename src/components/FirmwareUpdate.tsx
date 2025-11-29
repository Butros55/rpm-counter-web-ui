import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, Warning, CheckCircle, X } from '@phosphor-icons/react'

interface FirmwareUpdateProps {
  devMode?: boolean
}

export default function FirmwareUpdate({ devMode = false }: FirmwareUpdateProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validExtensions = ['.bin', '.elf']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Please select a .bin or .elf file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 2MB')
      return
    }

    setSelectedFile(file)
    setUploadStatus('idle')
    setErrorMessage('')
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setUploadStatus('idle')
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('firmware', selectedFile)

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setUploadStatus('success')
          setUploadProgress(100)
          toast.success('Firmware uploaded successfully! ESP32 is rebooting...')
          
          setTimeout(() => {
            toast.info('Reconnecting to ESP32...', { duration: 5000 })
          }, 2000)
        } else {
          setUploadStatus('error')
          const errorText = xhr.responseText || 'Upload failed'
          setErrorMessage(errorText)
          toast.error('Upload failed: ' + errorText)
        }
        setIsUploading(false)
      })

      xhr.addEventListener('error', () => {
        setUploadStatus('error')
        setErrorMessage('Network error during upload')
        toast.error('Network error during upload')
        setIsUploading(false)
      })

      xhr.addEventListener('timeout', () => {
        setUploadStatus('error')
        setErrorMessage('Upload timeout - ESP32 may be rebooting')
        toast.error('Upload timeout')
        setIsUploading(false)
      })

      xhr.open('POST', '/update')
      xhr.timeout = 60000
      xhr.send(formData)

    } catch (error) {
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      toast.error('Upload failed')
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload weight="duotone" size={24} />
          Firmware Update
        </CardTitle>
        <CardDescription>
          Upload new firmware to update your ESP32 device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Warning weight="fill" size={20} className="text-yellow-500" />
          <AlertDescription>
            <strong>Warning:</strong> Do not disconnect power or close this page during the update process.
            The ESP32 will reboot automatically after the update completes.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Label htmlFor="firmware-file">Select Firmware File (.bin)</Label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              id="firmware-file"
              type="file"
              accept=".bin,.elf"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="flex-1 text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {selectedFile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                disabled={isUploading}
              >
                <X weight="bold" size={20} />
              </Button>
            )}
          </div>

          {selectedFile && (
            <div className="p-3 bg-secondary rounded-md space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-muted-foreground">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
          )}
        </div>

        {uploadStatus === 'uploading' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading firmware...</span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {uploadStatus === 'success' && (
          <Alert className="border-green-500 bg-green-500/10">
            <CheckCircle weight="fill" size={20} className="text-green-500" />
            <AlertDescription className="text-green-500">
              <strong>Success!</strong> Firmware uploaded successfully. The ESP32 is rebooting...
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && errorMessage && (
          <Alert className="border-destructive bg-destructive/10">
            <Warning weight="fill" size={20} className="text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>Error:</strong> {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1"
          >
            <Upload weight="fill" size={16} />
            {isUploading ? 'Uploading...' : 'Upload Firmware'}
          </Button>
        </div>

        {devMode && (
          <div className="pt-4 border-t border-border">
            <details className="space-y-2">
              <summary className="text-sm font-medium cursor-pointer hover:text-primary">
                Advanced Information
              </summary>
              <div className="mt-2 space-y-2 text-xs text-muted-foreground pl-4">
                <p>• Firmware files should be compiled for ESP32 with appropriate partition scheme</p>
                <p>• Maximum file size: 2MB</p>
                <p>• Supported formats: .bin (binary), .elf (executable)</p>
                <p>• Update endpoint: POST /update</p>
                <p>• The ESP32 will reboot automatically after successful upload</p>
                <p>• Connection will be lost during reboot (typically 5-10 seconds)</p>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
