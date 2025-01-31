import { User, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthenticatedMenuProps {
  onSignOut: () => void;
  isMobile?: boolean;
}

const AuthenticatedMenu = ({ onSignOut, isMobile = false }: AuthenticatedMenuProps) => {
  const handleSignOut = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("No active session found");
        onSignOut();
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        if (error.message.includes("session_not_found")) {
          // If session not found, still trigger sign out UI update
          toast.success("Signed out successfully");
          onSignOut();
          return;
        }
        toast.error("Error signing out");
        return;
      }

      toast.success("Signed out successfully");
      onSignOut();
    } catch (error) {
      console.error("Error in sign out process:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const menuItems = [
    { to: "/account", icon: User, text: "Account" },
    { to: "/medical-records", icon: Heart, text: "Medical Records" },
    { to: "/family", icon: Users, text: "My Family" },
  ];

  if (isMobile) {
    return (
      <>
        {menuItems.map(({ to, icon: Icon, text }) => (
          <Link
            key={to}
            to={to}
            className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
          >
            <Icon className="inline-block mr-2" size={18} />
            {text}
          </Link>
        ))}
        <Button
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-2"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </>
    );
  }

  return (
    <>
      {menuItems.map(({ to, icon: Icon, text }) => (
        <Link
          key={to}
          to={to}
          className="text-gray-700 hover:text-primary transition-colors"
        >
          <Icon className="inline-block mr-1" size={18} />
          {text}
        </Link>
      ))}
      <Button
        variant="outline"
        className="border-primary text-primary hover:bg-primary hover:text-white"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </>
  );
};

export default AuthenticatedMenu;