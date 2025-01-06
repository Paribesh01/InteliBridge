

import { useState } from 'react'

import WorkflowBuilder from '@/components/WorkflowBuilder';
import { WorkflowProvider } from '@/contex/workflowContex';
import ConfigurationPanel from '@/components/ConfigurationPanel';

export default function ZapPage() {
  const [selectedBlock, setSelectedBlock] = useState<{ id:string|null,type: string; index: number,auth:boolean } | null>(null)
    console.log(selectedBlock?.type)
  return (
    <WorkflowProvider>
      <div className="flex h-screen bg-gray-100">
        <WorkflowBuilder onSelectBlock={(id,type, index,auth) => setSelectedBlock({ type, index,id,auth })} />
        <ConfigurationPanel selectedBlock={selectedBlock} />
      </div>
    </WorkflowProvider>
  )
}



