import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleBookAppointment = () => {
    navigate("/book-appointment");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-primary animate-fade-in"
            >
              DocInBlink
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors"
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
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Button
                variant="default"
                className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-2"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
