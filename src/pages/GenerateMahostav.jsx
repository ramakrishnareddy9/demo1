import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { IdCard, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GenerateMahostav = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData?.mahostav_id) {
        navigate("/dashboard");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);
      setRole(roleData?.role || "");
    };

    checkAuth();
  }, [navigate]);

  const generateId = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to generate a MAHOSTAV ID",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.rpc("generate_mahostav_id", {
        _user_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Your MAHOSTAV ID has been generated: ${data}`,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate MAHOSTAV ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 flex items-center justify-center">
          <p className="text-2xl font-semibold">Loading...</p>
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
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <IdCard className="w-16 h-16 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Generate Your MAHOSTAV ID
                </h1>
                <p className="text-gray-600">
                  Get your unique MAHOSTAV ID to register for events
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-semibold">{profile.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold">{profile.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="font-semibold capitalize">{role || "Not Set"}</p>
                </div>
              </div>

              <Button 
                onClick={generateId} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  "Generating..."
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate MAHOSTAV ID
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GenerateMahostav;
