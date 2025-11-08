import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import TeamRegistrationForm from "./TeamRegistrationForm";
import SoloRegistrationForm from "./SoloRegistrationForm";

const EventCard = ({ 
  event,
  onRegister,
  isRegistered = false,
  hasMahostav = true
}) => {
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showSoloForm, setShowSoloForm] = useState(false);

  // Determine if this is a team event based on team size
  const teamSize = event.team_size || "";
  const isTeamEvent = teamSize && !teamSize.toLowerCase().includes("individual");
  const minPlayers = teamSize ? parseInt(teamSize.match(/\d+/)?.[0] || "1") : 1;

  const handleRegisterClick = () => {
    if (isTeamEvent) {
      setShowTeamForm(true);
    } else {
      setShowSoloForm(true);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3">{event.name}</h3>
          <p className="text-gray-600 mb-4">{event.description}</p>
          
          {event.date_time && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              {event.date_time}
            </div>
          )}
          
          {event.venue && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              {event.venue}
            </div>
          )}
          
          {teamSize && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Users className="w-4 h-4 mr-2" />
              Team Size: {teamSize}
            </div>
          )}
          
          {event.fees && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <DollarSign className="w-4 h-4 mr-2" />
              Fees: ₹{event.fees}
            </div>
          )}
          
          {!hasMahostav ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Please generate your MAHOSTAV ID to continue
              </p>
            </div>
          ) : null}
          
          {isRegistered ? (
            <Button className="w-full" disabled>
              Already Registered
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleRegisterClick}
              disabled={!hasMahostav}
            >
              {!hasMahostav ? "Generate ID Required" : "Register"}
            </Button>
          )}
        </div>
      </Card>
      
      {isTeamEvent && (
        <TeamRegistrationForm
          eventId={event.id}
          eventName={event.name}
          minPlayers={minPlayers}
          open={showTeamForm}
          onOpenChange={setShowTeamForm}
          onSuccess={() => {
            setShowTeamForm(false);
            onRegister();
          }}
        />
      )}
      
      {!isTeamEvent && (
        <SoloRegistrationForm
          eventId={event.id}
          eventName={event.name}
          open={showSoloForm}
          onOpenChange={setShowSoloForm}
          onSuccess={() => {
            setShowSoloForm(false);
            onRegister();
          }}
        />
      )}
    </>
  );
};

export default EventCard;
