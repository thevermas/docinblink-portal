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

interface MedicalRecordFormProps {
  patientId: string;
  onSuccess?: () => void;
}

const MedicalRecordForm = ({ patientId, onSuccess }: MedicalRecordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const record = {
      patient_id: patientId,
      record_type: String(formData.get("recordType")),
      doctor_name: String(formData.get("doctorName")),
      description: String(formData.get("description")),
      record_date: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from("medical_records")
        .insert(record);

      if (error) throw error;

      toast.success("Medical record added successfully");
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
        <CardTitle>Add Medical Record</CardTitle>
        <CardDescription>Create a new medical record for the patient</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recordType">Record Type</Label>
            <Input
              id="recordType"
              name="recordType"
              placeholder="e.g., Prescription, Test Results"
              required
            />
          </div>
          <div>
            <Label htmlFor="doctorName">Doctor Name</Label>
            <Input
              id="doctorName"
              name="doctorName"
              placeholder="Dr. John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter medical record details..."
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Record"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordForm;