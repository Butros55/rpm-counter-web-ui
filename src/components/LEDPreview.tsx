import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConfigFormData } from '@/lib/types'

interface LEDPreviewProps {
  config: ConfigFormData
}

export default function LEDPreview({ config }: LEDPreviewProps) {
  const segments = 30

  const getSegmentColor = (index: number): string => {
    const percent = ((index + 1) / segments) * 100

    if (percent <= config.greenEndPct) {
      return config.greenColor
    } else if (percent <= config.yellowEndPct) {
      return config.yellowColor
    } else {
      return config.redColor
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>LED Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 h-12 items-end">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-200"
              style={{
                backgroundColor: getSegmentColor(i),
                height: `${((i + 1) / segments) * 100}%`,
                opacity: config.brightness / 255,
              }}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span className="absolute left-1/2 -translate-x-1/2">{config.blinkStartPct}% (Blink)</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  )
}