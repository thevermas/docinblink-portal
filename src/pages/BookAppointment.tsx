import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import AddressFields from "@/components/AddressFields";
import type { Database } from "@/integrations/supabase/types";

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<AppointmentInsert, 'id' | 'created_at' | 'status' | 'user_id'>>({
    name: "",
    email: "",
    phone: "",
    symptoms: "",
    location: "",
    needs_ambulance: false,
    medical_history: "",
    preferred_time: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleAddressChange = (addressData: {
    address1: string;
    address2: string;
    pincode: string;
    city: string;
    state: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      address1: addressData.address1,
      address2: addressData.address2,
      pincode: addressData.pincode,
      city: addressData.city,
      state: addressData.state,
      location: `${addressData.address1}${addressData.address2 ? ', ' + addressData.address2 : ''}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                  Symptoms
                </label>
                <Textarea
                  id="symptoms"
                  required
                  value={formData.symptoms || ""}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <AddressFields onAddressChange={handleAddressChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ambulance"
                  checked={formData.needs_ambulance || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, needs_ambulance: checked })}
                />
                <label htmlFor="ambulance" className="text-sm font-medium text-gray-700">
                  Need an Ambulance?
                </label>
              </div>
              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                  Previous Medical History
                </label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medical_history || ""}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                  Preferred Appointment Time
                </label>
                <Input
                  id="preferredTime"
                  type="datetime-local"
                  required
                  value={formData.preferred_time}
                  onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookAppointment;