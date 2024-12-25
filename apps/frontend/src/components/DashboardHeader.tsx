import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-white">Your Bridges</h1>
        <p className="mt-2 text-xl text-blue-300">Manage your AI-powered automations</p>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="mr-2 h-4 w-4" />
        Create New Bridge
      </Button>
    </header>
  )
}

