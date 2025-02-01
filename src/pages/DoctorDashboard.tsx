import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DoctorStats from "@/components/doctor/DoctorStats";
import AppointmentList from "@/components/doctor/AppointmentList";
import AvailabilityManager from "@/components/doctor/AvailabilityManager";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
              <AppointmentList />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={35}>
            <div className="p-4">
              <AvailabilityManager />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DoctorDashboard;