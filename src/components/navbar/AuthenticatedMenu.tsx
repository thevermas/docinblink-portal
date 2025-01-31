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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onSignOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
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