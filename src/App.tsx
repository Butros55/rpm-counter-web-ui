import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Gauge, Gear } from '@phosphor-icons/react'
import ShiftLightPage from '@/components/ShiftLightPage'
import SettingsPage from '@/components/SettingsPage'

function App() {
  const [activeTab, setActiveTab] = useState('shiftlight')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">RPM Counter</h1>
          <p className="text-muted-foreground">ESP32 Shift Light Configuration</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="shiftlight" className="gap-2">
              <Gauge weight="duotone" size={20} />
              <span>ShiftLight Setup</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Gear weight="duotone" size={20} />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shiftlight">
            <ShiftLightPage />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App