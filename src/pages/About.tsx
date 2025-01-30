import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About DocInBlink</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bringing quality healthcare to your doorstep
            </p>
          </div>
          <div className="prose prose-lg mx-auto">
            <p>
              DocInBlink is a revolutionary healthcare service that brings qualified medical
              professionals directly to your home. Our mission is to make healthcare
              accessible, convenient, and efficient for everyone.
            </p>
            <h2>Our Mission</h2>
            <p>
              We believe that everyone deserves access to quality healthcare without the
              hassle of traveling when they're unwell. Our team of experienced doctors and
              medical professionals are available 24/7 to provide care right at your
              doorstep.
            </p>
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Quick response time (20-30 minutes)</li>
              <li>Qualified and experienced medical professionals</li>
              <li>24/7 availability</li>
              <li>Convenient home visits</li>
              <li>Digital health records</li>
              <li>Emergency services</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;