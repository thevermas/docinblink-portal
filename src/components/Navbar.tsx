import { useState, useEffect } from "react";
import { Menu, X, User, Heart, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavLinks from "./navbar/NavLinks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const setupAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', currentSession.user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
          toast.success(`Hi ${profile.full_name}, Welcome to DocInBlink!`);
        }
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setIsMobileMenuOpen(false);
      setUserName("");
      navigate("/");
    } catch (error) {
      console.error("Error in Navbar signOut:", error);
    }
  };

  const menuItems = [
    { to: "/account", icon: User, text: "Account" },
    { to: "/medical-records", icon: Heart, text: "Medical Records" },
    { to: "/family", icon: Users, text: "My Family" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary animate-fade-in flex items-center">
              <img
                src="/lovable-uploads/961492f6-6f5c-4df0-ab56-ff34ba4ed973.png"
                alt="DocInBlink Logo"
                className="h-8 w-auto mr-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-primary font-medium">Hi, {userName}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Menu className="h-6 w-6 text-primary hover:text-primary/90 transition-colors" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {menuItems.map(({ to, icon: Icon, text }) => (
                      <DropdownMenuItem key={to} asChild>
                        <Link to={to} className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{text}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-primary hover:text-primary/90 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/book-appointment"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary hover:text-primary/90 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLinks isMobile />
              {session ? (
                <>
                  <div className="px-3 py-2 text-primary font-medium">Hi, {userName}</div>
                  {menuItems.map(({ to, icon: Icon, text }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{text}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 p-2">
                  <Link
                    to="/auth"
                    className="block w-full text-center bg-white text-primary border border-primary px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/book-appointment"
                    className="block w-full text-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;