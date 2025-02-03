import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeedbackSenderProps {
  patientId: string;
  onSuccess?: () => void;
}

const FeedbackSender = ({ patientId, onSuccess }: FeedbackSenderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (doctorError || !doctorData) throw new Error("Doctor not found");

      const { error } = await supabase
        .from("doctor_feedback")
        .insert({
          doctor_id: doctorData.id,
          patient_id: patientId,
          message,
        });

      if (error) throw error;

      toast.success("Feedback sent successfully");
      setMessage("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Feedback</CardTitle>
        <CardDescription>Send feedback to the patient</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your feedback message..."
              required
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackSender;