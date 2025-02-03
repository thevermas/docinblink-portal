import { useState, useEffect } from "react";
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
import { MapPin } from "lucide-react";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  preferred_time: string;
  status: string;
  symptoms: string | null;
  fee: number | null;
  user_id: string;
}

interface AppointmentListProps {
  onPatientSelect?: (patientId: string) => void;
}

const AppointmentList = ({ onPatientSelect }: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: doctorData } = await supabase
        .from("doctors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!doctorData) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorData.id)
        .order("preferred_time", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch appointments");
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      ));
      
      toast.success(`Appointment ${status}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointmentId(appointment.id);
    onPatientSelect?.(appointment.user_id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>Manage your upcoming appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card 
              key={appointment.id}
              className={`cursor-pointer transition-colors ${
                selectedAppointmentId === appointment.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleAppointmentClick(appointment)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{appointment.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.email} • {appointment.phone}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {appointment.location}
                    </div>
                    {appointment.symptoms && (
                      <p className="mt-2 text-sm">
                        Symptoms: {appointment.symptoms}
                      </p>
                    )}
                    <p className="mt-1 text-sm">
                      Fee: ${appointment.fee || "Not set"}
                    </p>
                  </div>
                  <div className="space-x-2">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAppointmentStatus(appointment.id, "accepted");
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAppointmentStatus(appointment.id, "rejected");
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {appointments.length === 0 && (
            <p className="text-center text-muted-foreground">
              No appointments found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentList;