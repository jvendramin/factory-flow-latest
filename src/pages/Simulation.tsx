
import React, { useState } from "react";
import FactoryEditor from "@/components/factory/FactoryEditor";
import EquipmentPanel from "@/components/factory/EquipmentPanel";
import SimulationPanel from "@/components/factory/SimulationPanel";
import { Button } from "@/components/ui/button";
import { Share2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import AddEquipmentForm from "@/components/factory/AddEquipmentForm";

const Simulation = () => {
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulationMode, setSimulationMode] = React.useState<"instant" | "play-by-play">("instant");
  const [addEquipmentOpen, setAddEquipmentOpen] = useState(false);
  
  const handleShareFactory = () => {
    const shareableLink = `${window.location.origin}/share/${btoa(Date.now().toString())}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({
        title: "Link copied to clipboard",
        description: "Share this link to let others view your factory design"
      });
    });
  };
  
  return (
    <div className="h-[calc(100vh-8rem)] flex -m-6">
      {/* Left Equipment Panel */}
      <div className="w-64 border-r border-border bg-card">
        <EquipmentPanel addProposedMode={true} />
      </div>
      
      {/* Factory Editor */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Popover open={addEquipmentOpen} onOpenChange={setAddEquipmentOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus size={16} />
                Add Equipment
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <AddEquipmentForm 
                onEquipmentAdded={() => setAddEquipmentOpen(false)}
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 size={16} />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">Share your factory design</h3>
                <p className="text-sm text-muted-foreground">Generate a link that allows others to view your factory design in read-only mode.</p>
                <Button onClick={handleShareFactory} className="w-full">
                  Generate shareable link
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="h-full w-full">
          <FactoryEditor isSimulating={isSimulating} simulationMode={simulationMode} simulationSpeed={1} onUnitPositionUpdate={() => {}} />
        </div>
      </div>
      
      {/* Right Simulation Panel */}
      <div className="w-80 border-l border-border bg-card overflow-hidden">
        <SimulationPanel isSimulating={isSimulating} setIsSimulating={setIsSimulating} simulationMode={simulationMode} setSimulationMode={setSimulationMode} />
      </div>
    </div>
  );
};

export default Simulation;
