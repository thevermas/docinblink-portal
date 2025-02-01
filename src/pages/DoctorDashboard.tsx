import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Doctor Dashboard</h1>
      <p className="text-gray-600">Welcome to your dashboard. More features coming soon!</p>
    </div>
  );
};

export default DoctorDashboard;