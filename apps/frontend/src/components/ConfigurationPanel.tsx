import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import SelectApp from './SelectApp';
import SelectSubtype from './SelectSubtype';
import OAuthSetup from './OAuthSetup';
import SelectDynamicData from './SelectDynamicData';
import ConfirmSetup from './ConfirmSetup';
import { useWorkflow } from '@/contex/workflowContex';

interface ConfigurationPanelProps {
  selectedBlock: { type: string; index: number } | null;
}

const steps = ['Select App', 'Select Subtype', 'OAuth Setup', 'Select Dynamic Data', 'Confirm'];

export default function ConfigurationPanel({ selectedBlock }: ConfigurationPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { trigger, actions, setTrigger, addAction, updateAction } = useWorkflow();
  const [currentConfig, setCurrentConfig] = useState({ app: '', subtype: '', id: '' });

  useEffect(() => {
    console.log('Selected block:', selectedBlock);
    if (selectedBlock) {
      setCurrentStep(0);
      if (selectedBlock.type === 'trigger') {
        setCurrentConfig(trigger || { app: '', subtype: '', id: '' });
      } else if (selectedBlock.index < actions.length) {
        setCurrentConfig(actions[selectedBlock.index]);
      } else {
        setCurrentConfig({ app: '', subtype: '', id: '' });
      }
    }
  }, [selectedBlock, trigger, actions]);

  useEffect(() => {
    console.log('Updated currentConfig:', currentConfig);
  }, [currentConfig]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    if (selectedBlock) {
      if (selectedBlock.type === 'trigger') {
        setTrigger({ type: 'trigger', ...currentConfig });
      } else if (selectedBlock.index < actions.length) {
        updateAction(selectedBlock.index, currentConfig);
      } else {
        addAction({ type: 'action', ...currentConfig });
      }
    }
  };

  if (!selectedBlock) {
    return (
      <div className="w-2/3 p-4 bg-gray-100 shadow-md text-gray-700">
        <h2 className="text-2xl font-bold mb-4">Configuration</h2>
        <p>Please select a block to begin configuring it.</p>
        <p className="text-sm text-gray-500 mt-2">
          Choose a block type (e.g., Trigger or Action) from the workflow builder.
        </p>
      </div>
    );
  }

  return (
    <div className="w-2/3 p-4 bg-white shadow-md text-slate-900">
      <h2 className="text-2xl font-bold mb-4">Configure {selectedBlock.type}</h2>
      <div className="mb-4">
        {steps.map((step, index) => (
          <span key={step} className={`mr-2 ${index === currentStep ? 'font-bold' : ''}`}>
            {step} {index < steps.length - 1 ? '>' : ''}
          </span>
        ))}
      </div>
      <div className="mb-4">
        {currentStep === 0 && (
          <SelectApp
            type={selectedBlock.type}
            selectedApp={currentConfig}
            onSelectApp={(app: any) => {
              const updatedConfig = { ...app };
              console.log('New config received:', updatedConfig);
              setCurrentConfig(updatedConfig);
            }}
          />
        )}
        {currentStep === 1 && (
          <SelectSubtype
            type={selectedBlock.type}
            selectedApp={currentConfig}
            selectedSubtype={currentConfig.subtype}
            onSelectSubtype={(subtype) => setCurrentConfig({ ...currentConfig, subtype })}
          />
        )}
        {currentStep === 2 && <OAuthSetup selectedApp={currentConfig} />}
        {currentStep === 3 && <SelectDynamicData />}
        {currentStep === 4 && <ConfirmSetup onConfirm={handleConfirm} />}
      </div>
      <div className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
}
