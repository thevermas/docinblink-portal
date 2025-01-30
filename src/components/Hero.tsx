import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-light to-white">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <span className="inline-block animate-fade-in px-4 py-1.5 mb-6 text-sm font-semibold text-primary bg-primary-light rounded-full">
          Healthcare at Your Doorstep
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
          Get a doctor at your doorstep
          <br />
          <span className="text-primary">in 20-30 minutes</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 animate-fade-in max-w-2xl mx-auto">
          Experience healthcare reimagined. Our qualified doctors are ready to
          provide immediate medical attention right at your home.
        </p>
        <Button
          size="lg"
          className="animate-fade-in bg-primary hover:bg-primary/90 text-white group"
        >
          Book Appointment
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;