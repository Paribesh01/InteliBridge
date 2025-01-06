import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import SelectApp from './SelectApp';
import SelectSubtype from './SelectSubtype';
import OAuthSetup from './OAuthSetup';
import SelectDynamicData from './SelectDynamicData';
import ConfirmSetup from './ConfirmSetup';
import { useWorkflow } from '@/contex/workflowContex';
import {  useParams } from 'react-router-dom';
import axios from 'axios';

interface ConfigurationPanelProps {
  selectedBlock: { id:string|null,type: string; index: number } | null;
}

const steps = ['Select App', 'Select Subtype', 'OAuth Setup', 'Select Dynamic Data', 'Confirm'];

export default function ConfigurationPanel({ selectedBlock }: ConfigurationPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { trigger, actions, setTrigger, addAction, updateAction } = useWorkflow();
  const [currentConfig, setCurrentConfig] = useState({ app: '', subtype: '', id: '',auth:false });

const {id} = useParams()

  


  useEffect(() => {
  
    const fetchZapData = async () => {
      try {
        const res:any = await axios.get(`http://localhost:8000/api/v1/zap/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (res.data && res.data.zap) {
          const zapData = res.data.zap;
  
          if (zapData.trigger) {
            setTrigger({
              type: "trigger",
              app: zapData.trigger.type.name,
              subtype: zapData.trigger.metaData.subType,
              id: zapData.trigger.id,
              auth:zapData.trigger.auth
            });
          }
  
          if (zapData.workflows && zapData.workflows.length > 0) {
            zapData.workflows.forEach((workflow: any) =>{

                console.log("this ooooooo",workflow.metaData)
                addAction({
                    type: "action",
                    app: workflow.type.name || "",
                    subtype: workflow.metaData.set.subType || "",
                    id: workflow.id,
                    auth:workflow.auth
                })
            }
            );
          }
  
          console.log("Fetched Zap Data:", zapData);
        }
      } catch (error) {
        console.error("Error fetching zap data:", error);
      }
    };
  
    fetchZapData();
  }, [id, selectedBlock]); 
  

  useEffect(() => {
    console.log('Selected block:', selectedBlock);



    if (selectedBlock) {


        if(selectedBlock.id==null){

            
            setCurrentStep(0);
            if (selectedBlock.type === 'trigger') {
                setCurrentConfig(trigger || { app: '', subtype: '', id: '',auth:false });
            } else if (selectedBlock.index < actions.length) {
                setCurrentConfig(actions[selectedBlock.index]);
            } else {
                setCurrentConfig({ app: '', subtype: '', id: '',auth:false });
            }
        }else {
            const fetchData = async () => {
                try {
                    let url = '';
                    if (selectedBlock.type === 'trigger') {
                        url = `http://localhost:8000/api/v1/zap/trigger/${selectedBlock.id}`;
                    } else if (selectedBlock.type === 'action') {
                        url = `http://localhost:8000/api/v1/zap/workflow/${selectedBlock.id}`;
                    }
                    
                    const res: any = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (res.data) {
                        if (selectedBlock.type === 'trigger') {

                            console.log("here is the here ",res.data)

                            setCurrentConfig({
                                app: res.data.trigger.type.name,
                                subtype: res.data.trigger.metaData.subType,
                                id: res.data.trigger.id,
                                auth:res.data.trigger.auth
                            });
                        } else if (selectedBlock.type === 'action') {
                            setCurrentConfig({
                                app: res.data.workflow.app,
                                subtype: res.data.workflow.subtype,
                                id: res.data.workflow.id,
                                auth:res.data.trigger.auth
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();


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
        {currentStep === 3 && <SelectDynamicData             selectedApp={currentConfig}
 />}
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
