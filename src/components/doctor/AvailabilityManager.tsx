import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const AvailabilityManager = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleAvailability = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("doctors")
        .update({ is_available: !isAvailable })
        .eq("user_id", user.id);

      if (error) throw error;

      setIsAvailable(!isAvailable);
      toast.success(`You are now ${!isAvailable ? "available" : "unavailable"} for appointments`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Status</CardTitle>
        <CardDescription>Toggle your availability for new appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isAvailable}
            onCheckedChange={toggleAvailability}
          />
          <span>
            {isAvailable ? "Available for appointments" : "Not available"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityManager;