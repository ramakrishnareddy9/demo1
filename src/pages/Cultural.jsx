import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Cultural = () => {
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

      // Fetch cultural events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("type", "cultural");

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

  // Default cultural events data if database is empty
  const defaultCultural = [
    { id: "1", name: "Classical Dance", type: "cultural", description: "Traditional dance performance" },
    { id: "2", name: "Drama Competition", type: "cultural", description: "Stage drama competition" },
    { id: "3", name: "Music Concert", type: "cultural", description: "Live music performance" },
    { id: "4", name: "Stand-up Comedy", type: "cultural", description: "Comedy show" },
    { id: "5", name: "Fashion Show", type: "cultural", description: "Fashion and modeling" },
    { id: "6", name: "Singing Competition", type: "cultural", description: "Solo and group singing" },
    { id: "7", name: "Painting Exhibition", type: "cultural", description: "Art and painting display" },
    { id: "8", name: "Poetry Recitation", type: "cultural", description: "Poetry and literature" },
  ];

  const displayEvents = events.length > 0 ? events : defaultCultural;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cultural Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Showcase your talent in our cultural competitions
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

export default Cultural;
