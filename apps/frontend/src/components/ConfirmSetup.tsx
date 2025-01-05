import { Button } from "@/components/ui/button"

interface ConfirmSetupProps {
  onConfirm: () => void
}

export default function ConfirmSetup({ onConfirm }: ConfirmSetupProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Confirm Setup</h3>
      <p className="mb-4">Please review your configuration and click the button below to confirm.</p>
      <Button onClick={onConfirm}>Confirm Setup</Button>
    </div>
  )
}

