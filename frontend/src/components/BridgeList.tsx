'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react'

type Bridge = {
  id: string
  name: string
  description: string
  active: boolean
  type: 'AI' | 'Integration' | 'Automation'
  runCount: number
  lastRun: string
  createdAt: string
}

const initialBridges: Bridge[] = [
  { id: '1', name: 'Email Summarizer', description: 'Summarize incoming emails using AI', active: true, type: 'AI', runCount: 1234, lastRun: '2 hours ago', createdAt: '2023-05-15' },
  { id: '2', name: 'Task Scheduler', description: 'Automatically schedule tasks from Slack messages', active: false, type: 'Integration', runCount: 567, lastRun: '1 day ago', createdAt: '2023-06-01' },
  { id: '3', name: 'Data Sync', description: 'Sync data between CRM and marketing tools', active: true, type: 'Automation', runCount: 890, lastRun: '3 hours ago', createdAt: '2023-04-22' },
  { id: '4', name: 'Lead Scorer', description: 'Score leads based on website activity', active: true, type: 'AI', runCount: 456, lastRun: '30 minutes ago', createdAt: '2023-07-10' },
  { id: '5', name: 'Invoice Generator', description: 'Automatically generate invoices from project data', active: false, type: 'Automation', runCount: 789, lastRun: '2 days ago', createdAt: '2023-03-05' },
]

export default function BridgeList() {
  const [bridges, setBridges] = useState<Bridge[]>(initialBridges)

  const toggleBridge = (id: string) => {
    setBridges(bridges.map(bridge => 
      bridge.id === id ? { ...bridge, active: !bridge.active } : bridge
    ))
  }

  return (
    <div className="space-y-6">
      {bridges.map((bridge, index) => (
        <motion.div
          key={bridge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-2xl font-bold text-white">{bridge.name}</CardTitle>
                <CardDescription className="text-gray-400">{bridge.description}</CardDescription>
              </div>
              <Badge variant={bridge.type === 'AI' ? 'default' : bridge.type === 'Integration' ? 'secondary' : 'outline'}>
                {bridge.type}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Created on: {bridge.createdAt}</p>
                  <p className="text-sm text-gray-400">Total runs: {bridge.runCount.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Last run: {bridge.lastRun}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />

                    {/* <Switch
                      checked={bridge.active}
                      onCheckedChange={() => toggleBridge(bridge.id)}
                      aria-label={`Toggle ${bridge.name}`}
                    /> */}
                    <span className="text-sm font-medium text-gray-300">
                      {bridge.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

