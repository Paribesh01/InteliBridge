

import { useState } from 'react'

import WorkflowBuilder from '@/components/WorkflowBuilder';
import { WorkflowProvider } from '@/contex/workflowContex';
import ConfigurationPanel from '@/components/ConfigurationPanel';

export default function ZapPage() {
  const [selectedBlock, setSelectedBlock] = useState<{ type: string; index: number } | null>(null)
    console.log(selectedBlock?.type)
  return (
    <WorkflowProvider>
      <div className="flex h-screen bg-gray-100">
        <WorkflowBuilder onSelectBlock={(type, index) => setSelectedBlock({ type, index })} />
        <ConfigurationPanel selectedBlock={selectedBlock} />
      </div>
    </WorkflowProvider>
  )
}



