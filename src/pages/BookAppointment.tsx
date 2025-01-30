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

const BookAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    symptoms: "",
    location: "",
    needsAmbulance: false,
    medicalHistory: "",
    preferredTime: "",
  });

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

      const { error } = await supabase.from("appointments").insert([
        {
          user_id: user.id,
          ...formData,
          preferred_time: new Date(formData.preferredTime).toISOString(),
        },
      ]);

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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="symptoms"
                  className="block text-sm font-medium text-gray-700"
                >
                  Symptoms
                </label>
                <Textarea
                  id="symptoms"
                  required
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ambulance"
                  checked={formData.needsAmbulance}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, needsAmbulance: checked })
                  }
                />
                <label
                  htmlFor="ambulance"
                  className="text-sm font-medium text-gray-700"
                >
                  Need an Ambulance?
                </label>
              </div>
              <div>
                <label
                  htmlFor="medicalHistory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Previous Medical History
                </label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalHistory: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="preferredTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Preferred Appointment Time
                </label>
                <Input
                  id="preferredTime"
                  type="datetime-local"
                  required
                  value={formData.preferredTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTime: e.target.value })
                  }
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