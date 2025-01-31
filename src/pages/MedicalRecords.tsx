import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchRecords();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchRecords = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("medical_records")
        .select(`
          *,
          family_members (
            name,
            relationship
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Failed to fetch medical records");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Medical Records</h1>
      <div className="grid gap-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {record.family_members?.name} ({record.family_members?.relationship})
                </h3>
                <p className="text-sm text-gray-600">
                  Record Type: {record.record_type}
                </p>
                <p className="text-sm text-gray-600">
                  Doctor: {record.doctor_name}
                </p>
                <p className="mt-2">{record.description}</p>
              </div>
              {record.file_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(record.file_url, '_blank')}
                >
                  View File
                </Button>
              )}
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <p className="text-gray-500">No medical records found.</p>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;