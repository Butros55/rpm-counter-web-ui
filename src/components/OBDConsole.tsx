import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { PaperPlaneRight, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { StatusResponse } from '@/lib/types'

interface OBDConsoleProps {
  status: StatusResponse | null
}

interface LogEntry {
  type: 'tx' | 'rx' | 'info'
  message: string
  timestamp: number
}

export default function OBDConsole({ status }: OBDConsoleProps) {
  const [command, setCommand] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [autoLog, setAutoLog] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const logEndRef = useRef<HTMLDivElement>(null)
  const lastTxRef = useRef<string>('')
  const lastObdRef = useRef<string>('')

  useEffect(() => {
    if (autoLog && status) {
      if (status.lastTx && status.lastTx !== lastTxRef.current) {
        lastTxRef.current = status.lastTx
        addLog('tx', status.lastTx)
      }
      if (status.lastObd && status.lastObd !== lastObdRef.current) {
        lastObdRef.current = status.lastObd
        addLog('rx', status.lastObd)
      }
    }
  }, [status, autoLog])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const addLog = (type: LogEntry['type'], message: string) => {
    setLogs((prev) => [...prev, { type, message, timestamp: Date.now() }])
  }

  const handleSend = async () => {
    if (!command.trim()) return

    setIsSending(true)
    try {
      const response = await api.sendOBDCommand(command)
      addLog('tx', command)
      if (response.lastObd) {
        addLog('rx', response.lastObd)
      }
      setCommand('')
    } catch (error) {
      toast.error('Failed to send command')
      addLog('info', `Error sending command: ${command}`)
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleClear = () => {
    setLogs([])
    lastTxRef.current = ''
    lastObdRef.current = ''
  }

  const getLogColor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'tx':
        return 'text-accent'
      case 'rx':
        return 'text-primary'
      case 'info':
        return 'text-muted-foreground'
    }
  }

  const getLogPrefix = (type: LogEntry['type']): string => {
    switch (type) {
      case 'tx':
        return '>'
      case 'rx':
        return '<'
      case 'info':
        return '•'
    }
  }

  return (
    <Card className="border-accent/30">
      <CardHeader>
        <CardTitle className="text-accent">OBD Console</CardTitle>
        <CardDescription>Send raw commands to OBD-II adapter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoLog">Auto-Log</Label>
          <Switch id="autoLog" checked={autoLog} onCheckedChange={setAutoLog} />
        </div>

        <div className="bg-black/60 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
          {logs.length === 0 ? (
            <div className="text-muted-foreground">Console ready. Enter commands below.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className={getLogColor(log.type)}>
                <span className="text-muted-foreground mr-2">{getLogPrefix(log.type)}</span>
                {log.message}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isSending) {
                handleSend()
              }
            }}
            placeholder="e.g., 010C, 010D, ATZ"
            className="font-mono"
            disabled={isSending}
          />
          <Button onClick={handleSend} disabled={isSending || !command.trim()} size="icon">
            <PaperPlaneRight weight="fill" size={18} />
          </Button>
          <Button onClick={handleClear} variant="outline" size="icon">
            <Trash weight="fill" size={18} />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>Common commands:</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { cmd: '010C', desc: 'Engine RPM' },
              { cmd: '010D', desc: 'Vehicle Speed' },
              { cmd: '0100', desc: 'Supported PIDs' },
              { cmd: 'ATZ', desc: 'Reset Adapter' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => setCommand(item.cmd)}
                className="text-left p-2 rounded bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="font-mono text-accent">{item.cmd}</div>
                <div className="text-[10px]">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}