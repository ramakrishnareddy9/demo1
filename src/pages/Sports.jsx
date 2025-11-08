import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Sports = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hasMahostav, setHasMahostav] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      setUserId(session.user.id);

      // Check if user has MAHOSTAV ID
      const { data: profileData } = await supabase
        .from("profiles")
        .select("mahostav_id")
        .eq("id", session.user.id)
        .single();

      setHasMahostav(!!profileData?.mahostav_id);

      // Fetch sports events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("type", "sports");

      if (eventsData) {
        setEvents(eventsData);
      }

      // Fetch user's registrations
      const { data: regsData } = await supabase
        .from("registrations")
        .select("event_id")
        .eq("user_id", session.user.id);

      if (regsData) {
        setRegistrations(regsData.map(r => r.event_id));
      }

    };

    checkAuth();
  }, [navigate]);

  const handleRegister = async (eventId) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("registrations")
        .insert({ user_id: userId, event_id: eventId });

      if (error) throw error;

      setRegistrations([...registrations, eventId]);
      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for the event.",
        variant: "destructive",
      });
    }
  };

  // Default sports data if database is empty
  const defaultSports = [
    { id: "1", name: "Basketball", type: "sports", description: "5v5 basketball tournament" },
    { id: "2", name: "Football", type: "sports", description: "11v11 football match" },
    { id: "3", name: "Cricket", type: "sports", description: "Cricket tournament" },
    { id: "4", name: "Badminton", type: "sports", description: "Singles and doubles badminton" },
    { id: "5", name: "Table Tennis", type: "sports", description: "Table tennis competition" },
    { id: "6", name: "Volleyball", type: "sports", description: "6v6 volleyball match" },
    { id: "7", name: "Chess", type: "sports", description: "Chess tournament" },
    { id: "8", name: "Athletics", type: "sports", description: "Track and field events" },
    { id: "9", name: "Swimming", type: "sports", description: "Swimming competition" },
  ];

  const displayEvents = events.length > 0 ? events : defaultSports;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sports Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compete in our exciting sports competitions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={() => {
                  handleRegister(event.id);
                  setRegistrations([...registrations, event.id]);
                }}
                isRegistered={registrations.includes(event.id)}
                hasMahostav={hasMahostav}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Sports;
