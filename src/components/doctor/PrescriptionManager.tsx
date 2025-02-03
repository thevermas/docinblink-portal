import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PrescriptionManagerProps {
  patientId: string;
  onSuccess?: () => void;
}

const PrescriptionManager = ({ patientId, onSuccess }: PrescriptionManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (doctorError || !doctorData) throw new Error("Doctor not found");

      const prescription = {
        doctor_id: doctorData.id,
        patient_id: patientId,
        medication_name: String(formData.get("medicationName")),
        dosage: String(formData.get("dosage")),
        frequency: String(formData.get("frequency")),
        duration: String(formData.get("duration")),
        notes: String(formData.get("notes")),
      };

      const { error } = await supabase
        .from("prescriptions")
        .insert(prescription);

      if (error) throw error;

      toast.success("Prescription added successfully");
      onSuccess?.();
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Prescription</CardTitle>
        <CardDescription>Create a new prescription for the patient</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medicationName">Medication Name</Label>
            <Input
              id="medicationName"
              name="medicationName"
              placeholder="Enter medication name"
              required
            />
          </div>
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              name="dosage"
              placeholder="e.g., 500mg"
              required
            />
          </div>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              name="frequency"
              placeholder="e.g., Twice daily"
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              placeholder="e.g., 7 days"
              required
            />
          </div>
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Enter any additional instructions or notes..."
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Prescription"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrescriptionManager;