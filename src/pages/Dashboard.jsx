import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Music, List } from "lucide-react";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profileData } = await supabase.from("profiles")
        .select("name, email, mahostav_id")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        if (!profileData.mahostav_id) {
          navigate("/generate-mahostav");
          return;
        }
        setProfile(profileData);
      }
    };

    checkAuth();
  }, [navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            Welcome, {profile.name}!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Your Mahostav ID: <span className="font-bold">{profile.mahostav_id}</span>
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <h2 className="text-xl font-semibold mb-4">Sports Events</h2>
              <Link to="/sports">
                <Button className="w-full">View Sports</Button>
              </Link>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Music className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h2 className="text-xl font-semibold mb-4">Cultural Events</h2>
              <Link to="/cultural">
                <Button className="w-full">View Cultural</Button>
              </Link>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <List className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h2 className="text-xl font-semibold mb-4">My Registrations</h2>
              <Link to="/my-registrations">
                <Button className="w-full">View Registrations</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
