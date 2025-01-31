import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UnauthenticatedMenuProps {
  isMobile?: boolean;
}

const UnauthenticatedMenu = ({ isMobile = false }: UnauthenticatedMenuProps) => {
  const navigate = useNavigate();

  const handleSignIn = () => navigate("/auth");
  const handleBookAppointment = () => navigate("/book-appointment");

  if (isMobile) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
    </>
  );
};

export default UnauthenticatedMenu;