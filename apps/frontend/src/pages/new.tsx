import { NewBridgeForm } from "@/components/NewBridgeForm";
import { MovingLight } from "./login";
import { TriggerWorkflowCard } from "@/components/TriggerWorkflowCard";

export default function New() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <MovingLight />
        </div>
      </div>
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">Create New Bridge</h1>
          <p className="mt-2 text-xl text-blue-300">
            Set up your new AI-powered automation
          </p>
        </header>
        <main>
          <NewBridgeForm />
        </main>
      </div>
      <div className="absolute right-20 top-48">
        <TriggerWorkflowCard />
      </div>
    </div>
  );
}
