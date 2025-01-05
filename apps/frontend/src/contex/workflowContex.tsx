'use client'

import React, { createContext, useState, useContext } from 'react'

interface WorkflowStep {
  type: 'trigger' | 'action'
  app: string
  subtype: string
  id :string
}

interface WorkflowContextType {
  trigger: WorkflowStep | null
  actions: WorkflowStep[]
  setTrigger: (trigger: WorkflowStep) => void
  addAction: (action: WorkflowStep) => void
  updateAction: (index: number, action: Partial<WorkflowStep>) => void
  removeAction: (index: number) => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [trigger, setTrigger] = useState<WorkflowStep | null>(null)
  const [actions, setActions] = useState<WorkflowStep[]>([])

  const addAction = (action: WorkflowStep) => {
    setActions(prev => [...prev, action])
  }

  const updateAction = (index: number, action: Partial<WorkflowStep>) => {
    setActions(prev => prev.map((a, i) => i === index ? { ...a, ...action } : a))
  }

  const removeAction = (index: number) => {
    setActions(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <WorkflowContext.Provider value={{ trigger, actions, setTrigger, addAction, updateAction, removeAction }}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}

