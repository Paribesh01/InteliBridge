import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { X, ArrowLeft, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import StepAppSelect from "./sidebarConfigSteps/StepAppSelect";
import StepActionSelect from "./sidebarConfigSteps/StepActionSelect";

interface SidebarConfigProps {
  type: "trigger" | "workflow";
  onClose: () => void;
  onBack?: () => void;
  step?: number;
  onComplete?: () => void;
  zapId: string;
  selectedId?: string | null;
}

export interface AppOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ActionOption {
  id: string;
  name: string;
  description: string;
}

const mockApps: AppOption[] = [
  { id: "discord", name: "Discord", icon: "D", color: "bg-indigo-500" },
  { id: "slack", name: "Slack", icon: "S", color: "bg-emerald-500" },
  { id: "gmail", name: "Gmail", icon: "G", color: "bg-red-500" },
  { id: "notion", name: "Notion", icon: "N", color: "bg-gray-900" },
  { id: "github", name: "GitHub", icon: "G", color: "bg-gray-700" },
  { id: "twitter", name: "Twitter", icon: "T", color: "bg-blue-500" },
  { id: "zapier", name: "Zapier", icon: "Z", color: "bg-orange-500" },
  { id: "airtable", name: "Airtable", icon: "A", color: "bg-green-500" },
];

const discordActions: ActionOption[] = [
  {
    id: "new-message",
    name: "New Message",
    description: "Triggers when a new message is posted in a channel",
  },
  {
    id: "user-joins",
    name: "User Joins",
    description: "Triggers when a new user joins the server",
  },
  {
    id: "reaction-added",
    name: "Reaction Added",
    description: "Triggers when a reaction is added to a message",
  },
];

const SidebarConfig: React.FC<SidebarConfigProps> = ({
  type,
  onClose,
  onBack,
  step = 1,
  onComplete,
  zapId,
  selectedId,
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionOption | null>(
    null
  );

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleStepBackward = () => {};

  const handleActionSelect = (action: ActionOption) => {
    setSelectedAction(action);
    if (step === 2) {
      onComplete?.();
    }
  };

  const handleConnect = () => {
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1500);
  };

  const handleTest = () => {
    setTesting(true);
    // Simulate testing process
    setTimeout(() => {
      setTesting(false);
      setTestSuccess(true);
    }, 2000);
  };

  const handleSaveConfig = () => {
    // onComplete?.({
    //   app: selectedApp,
    //   action: selectedAction,
    //   config: { configured: true },
    // });
    onClose();
  };

  // Render step content based on current step
  const renderStepContent = () => {
    console.log("step", step);
    switch (step) {
      case 1:
        return (
          <StepAppSelect
            zapId={zapId}
            onComplete={() => {
              onComplete?.();
            }}
            type={type}
            selectedId={selectedId || null}
          />
        );

      case 2:
        if (!selectedId) return null;

        return (
          <StepActionSelect
            type={type}
            onComplete={() => {
              onComplete?.();
            }}
            selectedAppId={selectedId}
            zapId={zapId}
          />
        );

      // case 3: // Account Connection
      //   return (
      //     <div className="animate-fade-in">
      //       <div className="mb-6">
      //         <h2 className="text-lg font-medium">Connect Account</h2>
      //         <p className="text-sm text-gray-500">
      //           Connect your {selectedApp?.name} account to continue
      //         </p>
      //       </div>

      //       <div className="p-4 border rounded-md mb-6">
      //         <div className="flex items-center gap-3 mb-3">
      //           {selectedApp && (
      //             <div
      //               className={cn(
      //                 "w-10 h-10 rounded-md flex items-center justify-center text-white font-bold",
      //                 selectedApp.color
      //               )}
      //             >
      //               {selectedApp.icon}
      //             </div>
      //           )}
      //           <div>
      //             <h3 className="font-medium">{selectedApp?.name}</h3>
      //             <p className="text-xs text-gray-500">OAuth Connection</p>
      //           </div>
      //         </div>

      //         {!connected ? (
      //           <Button
      //             onClick={handleConnect}
      //             className="w-full"
      //             disabled={connecting}
      //           >
      //             {connecting ? (
      //               <>
      //                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      //                 Connecting...
      //               </>
      //             ) : (
      //               <>Connect {selectedApp?.name} Account</>
      //             )}
      //           </Button>
      //         ) : (
      //           <div className="flex items-center gap-2 text-green-600 mt-4">
      //             <Check size={16} />
      //             <span className="text-sm font-medium">
      //               Connected successfully
      //             </span>
      //           </div>
      //         )}
      //       </div>

      //       <div className="flex justify-end gap-2">
      //         <Button variant="outline" onClick={handleStepBackward}>
      //           Back
      //         </Button>
      //         <Button onClick={onComplete} disabled={!connected}>
      //           Continue
      //         </Button>
      //       </div>
      //     </div>
      //   );

      // case 4:
      //   return (
      //     <div className="animate-fade-in">
      //       <div className="mb-6">
      //         <h2 className="text-lg font-medium">Configure Options</h2>
      //         <p className="text-sm text-gray-500">
      //           Set up the specific details for this {type}
      //         </p>
      //       </div>

      //       <div className="space-y-4 mb-6">
      //         <div className="space-y-2">
      //           <label className="text-sm font-medium">Channel</label>
      //           <select className="w-full p-2 border rounded-md">
      //             <option value="">Select a channel</option>
      //             <option value="general">#general</option>
      //             <option value="random">#random</option>
      //             <option value="development">#development</option>
      //           </select>
      //         </div>

      //         <div className="space-y-2">
      //           <label className="text-sm font-medium">Event Type</label>
      //           <select className="w-full p-2 border rounded-md">
      //             <option value="all">All Messages</option>
      //             <option value="mention">Mentions Only</option>
      //             <option value="bot">Bot Messages</option>
      //           </select>
      //         </div>
      //       </div>

      //       <div className="flex justify-end gap-2">
      //         <Button variant="outline" onClick={handleStepBackward}>
      //           Back
      //         </Button>
      //         <Button onClick={onComplete}>Continue</Button>
      //       </div>
      //     </div>
      //   );

      // case 5: // Test
      //   return (
      //     <div className="animate-fade-in">
      //       <div className="mb-6">
      //         <h2 className="text-lg font-medium">Test your {type}</h2>
      //         <p className="text-sm text-gray-500">
      //           Run a quick test to make sure everything works
      //         </p>
      //       </div>

      //       <div className="p-4 border rounded-md mb-6">
      //         {!testSuccess ? (
      //           <>
      //             <p className="text-sm mb-4">
      //               {type === "trigger"
      //                 ? "Testing this trigger will request a sample from Discord to make sure it's working correctly."
      //                 : "Testing this action will send a test message to verify it's working correctly."}
      //             </p>

      //             <Button
      //               onClick={handleTest}
      //               className="w-full"
      //               disabled={testing}
      //             >
      //               {testing ? (
      //                 <>
      //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      //                   Running test...
      //                 </>
      //               ) : (
      //                 <>Run Test</>
      //               )}
      //             </Button>
      //           </>
      //         ) : (
      //           <div className="space-y-3">
      //             <div className="flex items-center gap-2 text-green-600">
      //               <Check size={16} />
      //               <span className="text-sm font-medium">
      //                 Test successful!
      //               </span>
      //             </div>

      //             <div className="bg-gray-50 p-3 rounded-md">
      //               <h4 className="text-xs font-semibold mb-1">Sample Data:</h4>
      //               <pre className="text-xs overflow-x-auto">
      //                 {JSON.stringify(
      //                   {
      //                     message_id: "123456789",
      //                     user: "username#1234",
      //                     content: "Hello world!",
      //                     channel: "#general",
      //                     timestamp: new Date().toISOString(),
      //                   },
      //                   null,
      //                   2
      //                 )}
      //               </pre>
      //             </div>
      //           </div>
      //         )}
      //       </div>

      //       <div className="flex justify-end gap-2">
      //         <Button variant="outline" onClick={handleStepBackward}>
      //           Back
      //         </Button>
      //         <Button onClick={handleSaveConfig} disabled={!testSuccess}>
      //           Save & Continue
      //         </Button>
      //       </div>
      //     </div>
      //   );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      {/* <div className="p-4 border-b flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleStepBackward}>
          {step > 1 && selectedApp ? <ArrowLeft size={18} /> : <X size={18} />}
        </Button>

        <h2 className="text-lg font-medium">
          {step === 1
            ? `Configure ${type === "trigger" ? "Trigger" : "Action"}`
            : selectedApp?.name}
        </h2>
      </div> */}

      {/* Steps indicator */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          {["App", "Event", "Account", "Configure", "Test"].map(
            (stepName, idx) => {
              const stepNumber = idx + 1;
              const isActive = step === stepNumber;
              const isCompleted = step > stepNumber;

              return (
                <React.Fragment key={stepNumber}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1",
                        isActive
                          ? "bg-primary text-white"
                          : isCompleted
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {isCompleted ? <Check size={12} /> : stepNumber}
                    </div>
                    <span
                      className={cn(
                        "text-[10px]",
                        isActive ? "text-primary" : "text-gray-500"
                      )}
                    >
                      {stepName}
                    </span>
                  </div>

                  {stepNumber < 5 && (
                    <Separator
                      className={cn(
                        "w-full max-w-[30px] mx-1 h-0.5",
                        isCompleted ? "bg-green-300" : "bg-gray-200"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            }
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{renderStepContent()}</div>
    </div>
  );
};

export default SidebarConfig;
