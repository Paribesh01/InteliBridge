import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"

export default function SelectDynamicData() {
  const [selectedData, setSelectedData] = useState<string[]>([])
  const handleToggle = (value: string) => {
    setSelectedData(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }






  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select Dynamic Data</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="subject" onCheckedChange={() => handleToggle('subject')} />
          <label htmlFor="subject">Subject</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="body" onCheckedChange={() => handleToggle('body')} />
          <label htmlFor="body">Body</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sender" onCheckedChange={() => handleToggle('sender')} />
          <label htmlFor="sender">Sender</label>
        </div>
      </div>
    </div>
  )
}

