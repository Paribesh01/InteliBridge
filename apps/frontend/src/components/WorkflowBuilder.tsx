import { Button } from "@/components/ui/button"
import { useWorkflow } from "@/contex/workflowContex"
import { PlusCircle, Trash2 } from 'lucide-react'

interface WorkflowBuilderProps {
  onSelectBlock: (id:string|null,blockType: string, index: number,auth:boolean) => void
}

export default function WorkflowBuilder({ onSelectBlock }: WorkflowBuilderProps) {
  const { trigger, actions, removeAction } = useWorkflow()

  return (
    <div className="w-1/3 p-4 bg-white shadow-md overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Build Your Workflow</h2>
      <div className="space-y-4">
        {trigger ? (
          <Button 
            className="w-full justify-start" 
            variant="outline"
            onClick={() => onSelectBlock(trigger.id,'trigger', -1,false)}
          >
            Trigger: {trigger.app} - {trigger.subtype}
          </Button>
        ) : (
          <Button 
            className="w-full justify-start" 
            variant="outline"
            onClick={() =>{ onSelectBlock(null,'trigger', -1,false)
                console.log("trigger is selected")
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trigger
          </Button>
        )}
        {actions.map((action, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Button 
              className="flex-grow justify-start" 
              variant="outline"
              onClick={() => onSelectBlock(action.id,'action', index,false)}
            >
              Action: {action.app} - {action.subtype}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeAction(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onSelectBlock(null,'action', actions.length,false)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Action
        </Button>
      </div>
    </div>
  )
}

