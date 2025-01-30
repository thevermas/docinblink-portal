import {
  Clock,
  Home,
  Stethoscope,
  Phone,
  Ambulance,
  ClipboardCheck,
} from "lucide-react";

const services = [
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get medical attention within 20-30 minutes of your request",
  },
  {
    icon: Home,
    title: "Home Visits",
    description: "Professional medical care in the comfort of your home",
  },
  {
    icon: Stethoscope,
    title: "Expert Doctors",
    description: "Qualified and experienced medical professionals",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Round-the-clock medical assistance and consultation",
  },
  {
    icon: Ambulance,
    title: "Emergency Service",
    description: "Immediate response for urgent medical situations",
  },
  {
    icon: ClipboardCheck,
    title: "Digital Records",
    description: "Secure electronic health records for better care",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed around your needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 bg-primary-light rounded-xl group-hover:scale-110 transition-transform">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;