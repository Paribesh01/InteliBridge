"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateZapForm } from "@/components/create-zap-form";

export function CreateZapButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <span>New Zap</span>
      </Button>
      
      <CreateZapForm open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
} 