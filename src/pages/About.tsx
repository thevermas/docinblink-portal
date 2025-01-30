import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Clock,
  Home,
  Stethoscope,
  Phone,
  Ambulance,
  ClipboardCheck,
} from "lucide-react";

const whyChooseUs = [
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get medical attention within 20-30 minutes of your request.",
  },
  {
    icon: Home,
    title: "Home Visits",
    description: "Professional medical care in the comfort of your home.",
  },
  {
    icon: Stethoscope,
    title: "Expert Doctors",
    description: "Qualified and experienced medical professionals.",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Round-the-clock medical assistance and consultation.",
  },
  {
    icon: Ambulance,
    title: "Emergency Service",
    description: "Immediate response for urgent medical situations.",
  },
  {
    icon: ClipboardCheck,
    title: "Digital Records",
    description: "Secure electronic health records for better care.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-primary">DocInBlink</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bringing quality healthcare to your doorstep.
            </p>
          </div>

          {/* About Section */}
          <div className="prose prose-lg mx-auto text-center max-w-3xl">
            <p>
              <strong>DocInBlink</strong> is a revolutionary healthcare service that brings
              qualified medical professionals directly to your home. Our mission is to
              make healthcare accessible, convenient, and efficient for everyone.
            </p>
          </div>

          {/* Mission Section */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe that everyone deserves access to quality healthcare without
              the hassle of traveling when they're unwell. Our team of experienced
              doctors and medical professionals are available 24/7 to provide care
              right at your doorstep.
            </p>
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-6 bg-primary-light rounded-xl group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
