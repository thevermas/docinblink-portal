import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import AppointmentForm from "@/components/booking/AppointmentForm";
import type { Database } from "@/integrations/supabase/types";

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentFormData = Omit<AppointmentInsert, 'id' | 'created_at' | 'status' | 'user_id'>;

const BookAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: AppointmentFormData) => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to book an appointment");
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert([{
          user_id: user.id,
          ...formData,
          needs_ambulance: formData.needs_ambulance,
          medical_history: formData.medical_history,
          preferred_time: new Date(formData.preferred_time).toISOString(),
        }]);

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <img
              src="/lovable-uploads/961492f6-6f5c-4df0-ab56-ff34ba4ed973.png"
              alt="DocInBlink Logo"
              className="h-16 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book an Appointment
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fill out the form below to schedule a home visit
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <AppointmentForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookAppointment;