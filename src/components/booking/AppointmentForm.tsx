import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import AddressFields from "@/components/AddressFields";
import type { Database } from "@/integrations/supabase/types";

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentFormData = Omit<AppointmentInsert, 'id' | 'created_at' | 'status' | 'user_id'>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  isLoading: boolean;
}

const AppointmentForm = ({ onSubmit, isLoading }: AppointmentFormProps) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
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
      ...addressData,
      location: `${addressData.address1}${addressData.address2 ? ', ' + addressData.address2 : ''}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
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
  );
};

export default AppointmentForm;