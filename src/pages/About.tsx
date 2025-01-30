import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/doctor-home-visit.jpg"
                alt="Doctor visiting home"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="prose prose-lg">
              <p>
                DocInBlink is a revolutionary healthcare service that brings
                qualified medical professionals directly to your home. Our mission is to
                make healthcare accessible, convenient, and efficient for everyone.
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 mt-4">Our Mission</h2>
              <p>
                We believe that everyone deserves access to quality healthcare without
                the hassle of traveling when they're unwell. Our team of experienced
                doctors and medical professionals are available 24/7 to provide care
                right at your doorstep.
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Quick response time (20-30 minutes)",
                "Qualified and experienced medical professionals",
                "24/7 availability",
                "Convenient home visits",
                "Digital health records",
                "Emergency services",
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center"
                >
                  <p className="text-gray-700 text-lg">{item}</p>
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
