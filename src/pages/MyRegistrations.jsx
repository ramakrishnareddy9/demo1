import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Trash2 } from "lucide-react";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { 
    const fetchRegistrations = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("registrations")
        .select(`
          id,
          event_id,
          registered_at,
          events (
            name,
            type,
            description,
            date_time,
            venue
          )
        `)
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching registrations", error);
      } else if (data) {
        setRegistrations(data);
      }

      setLoading(false);
    };

    fetchRegistrations();
  }, [navigate]);

  const handleUnregister = async (registrationId) => {
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", registrationId);

      if (error) throw error;

      setRegistrations(registrations.filter(r => r.id !== registrationId));
      toast({
        title: "Success",
        description: "Successfully unregistered from the event",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unregister from the event",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Loading...</h1>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My Registrations
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View and manage all your event registrations
            </p>
          </div>

          {registrations.length === 0 ? (
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">No Registrations Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't registered for any events. Browse our events and register now!
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/sports")}>
                  View Sports Events
                </Button>
                <Button onClick={() => navigate("/cultural")} variant="outline">
                  View Cultural Events
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((reg) => (
                <Card key={reg.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reg.events.type === "solo" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                        {reg.events.type.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{reg.events.name}</h3>

                    <p className="text-gray-600 mb-4">{reg.events.description}</p>

                    {reg.events.date_time && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {reg.events.date_time}
                      </div>
                    )}

                    {reg.events.venue && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        {reg.events.venue}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mb-4">
                      Registered on: {new Date(reg.registered_at).toLocaleDateString()}
                    </p>

                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleUnregister(reg.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Unregister
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyRegistrations;
