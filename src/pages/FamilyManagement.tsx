import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const FamilyManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    date_of_birth: "",
    health_issues: "",
    allergies: "",
  });

  useEffect(() => {
    checkUser();
    fetchFamilyMembers();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error("Error fetching family members:", error);
      toast.error("Failed to fetch family members");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("family_members")
        .insert([
          {
            ...formData,
            user_id: session.user.id,
          },
        ]);

      if (error) throw error;

      toast.success("Family member added successfully");
      setShowAddForm(false);
      setFormData({
        name: "",
        relationship: "",
        date_of_birth: "",
        health_issues: "",
        allergies: "",
      });
      fetchFamilyMembers();
    } catch (error) {
      console.error("Error adding family member:", error);
      toast.error("Failed to add family member");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Family member removed successfully");
      fetchFamilyMembers();
    } catch (error) {
      console.error("Error removing family member:", error);
      toast.error("Failed to remove family member");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Family</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Family Member"}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 max-w-md space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium mb-1">
              Relationship
            </label>
            <Input
              id="relationship"
              required
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="health_issues" className="block text-sm font-medium mb-1">
              Health Issues
            </label>
            <Textarea
              id="health_issues"
              value={formData.health_issues}
              onChange={(e) => setFormData({ ...formData, health_issues: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium mb-1">
              Allergies
            </label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>
          <Button type="submit">Add Family Member</Button>
        </form>
      )}

      <div className="grid gap-4">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">
                  Relationship: {member.relationship}
                </p>
                {member.date_of_birth && (
                  <p className="text-sm text-gray-600">
                    Date of Birth: {new Date(member.date_of_birth).toLocaleDateString()}
                  </p>
                )}
                {member.health_issues && (
                  <p className="mt-2">
                    <strong>Health Issues:</strong> {member.health_issues}
                  </p>
                )}
                {member.allergies && (
                  <p className="mt-2">
                    <strong>Allergies:</strong> {member.allergies}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDelete(member.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        {familyMembers.length === 0 && !showAddForm && (
          <p className="text-gray-500">No family members added yet.</p>
        )}
      </div>
    </div>
  );
};

export default FamilyManagement;