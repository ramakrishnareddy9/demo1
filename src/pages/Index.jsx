import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";
import heroImage from "@/assets/hero-festival.jpg";
import { Trophy, Music, Calendar, MapPin } from "lucide-react";

const Index = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              MAHOSTAV 2026
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              The Ultimate College Festival Experience
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signin">
                <Button size="lg" className="text-lg px-8">
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Festival Countdown
          </h2>
          <CountdownTimer targetDate="2026-03-15T00:00:00" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            About MAHOSTAV 2026
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <Trophy className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Sports Events</h3>
              <p className="text-gray-600">
                Compete in 9 exciting sports including Cricket, Volleyball, Badminton, Table Tennis,
                and more. Show your athletic prowess and team spirit!
              </p>
            </Card>
            <Card className="p-6">
              <Music className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Cultural Events</h3>
              <p className="text-gray-600">
                Showcase your talents in Dance, Singing, Drama, Fashion Show, and many more cultural
                activities. Express your creativity!
              </p>
            </Card>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            MAHOSTAV 2026 is the premier college festival celebrating talent, creativity, and
            sportsmanship. Join thousands of students from across the country for three days of
            unforgettable experiences, competitions, and memories that will last a lifetime.
          </p>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Event Categories
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h3 className="text-2xl font-semibold mb-2">Sports Events</h3>
              <p className="text-gray-600">
                9 competitive sports events
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Music className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-2xl font-semibold mb-2">Cultural Events</h3>
              <p className="text-gray-600">
                8 creative cultural activities
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Previous Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Previous Year Highlights
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <p className="text-gray-600">Participants</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">17</div>
              <p className="text-gray-600">Events</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">3 Days</div>
              <p className="text-gray-600">Non-stop Fun</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Get in Touch
          </h2>
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-semibold">Event Dates</p>
                    <p className="text-gray-600">March 15-17, 2026</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-600">University Campus, Main Auditorium</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="font-semibold mb-2">Have questions?</p>
                <p className="text-gray-600">
                  Email: mahostav2026@university.edu<br />
                  Phone: +91 1234567890
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
