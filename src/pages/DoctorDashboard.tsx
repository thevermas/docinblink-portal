import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DoctorStats from "@/components/doctor/DoctorStats";
import AppointmentList from "@/components/doctor/AppointmentList";
import AvailabilityManager from "@/components/doctor/AvailabilityManager";
import PrescriptionManager from "@/components/doctor/PrescriptionManager";
import FeedbackSender from "@/components/doctor/FeedbackSender";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    const checkDoctorStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/doctor-auth");
          return;
        }

        const { data: isDoctor, error } = await supabase
          .rpc('is_doctor', { user_id: user.id });

        if (error || !isDoctor) {
          toast.error("Access denied. Doctor account required.");
          navigate("/doctor-auth");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking doctor status:", error);
        navigate("/doctor-auth");
      }
    };

    checkDoctorStatus();
  }, [navigate]);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
      
      <div className="space-y-6">
        <DoctorStats />
        
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[600px] rounded-lg border"
        >
          <ResizablePanel defaultSize={65}>
            <div className="p-4">
              <AppointmentList onPatientSelect={handlePatientSelect} />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={35}>
            <div className="p-4 space-y-4">
              <AvailabilityManager />
              
              {selectedPatientId && (
                <Tabs defaultValue="prescriptions">
                  <TabsList className="w-full">
                    <TabsTrigger value="prescriptions" className="flex-1">Prescriptions</TabsTrigger>
                    <TabsTrigger value="feedback" className="flex-1">Feedback</TabsTrigger>
                  </TabsList>
                  <TabsContent value="prescriptions">
                    <PrescriptionManager patientId={selectedPatientId} />
                  </TabsContent>
                  <TabsContent value="feedback">
                    <FeedbackSender patientId={selectedPatientId} />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DoctorDashboard;