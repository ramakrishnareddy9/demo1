import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";

const TeamRegistrationForm = ({ eventId, eventName, minPlayers, open, onOpenChange, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerCount, setPlayerCount] = useState(minPlayers);
  const { toast } = useToast();

  const playerSchema = z.object({
    name: z.string().min(1, "Player name is required"),
    collegeId: z.string().optional(),
    contact: z.string().optional()
  });

  const formSchema = z.object({
    teamTitle: z.string().min(1, "Team title is required"),
    collegeName: z.string().min(1, "College name is required"),
    mahostav_id: z.string().min(1, "Mahostav ID is required"),
    leaderName: z.string().min(1, "Team leader name is required"),
    leaderPhone: z.string().regex(/^[0-9]{10}$/, "Valid phone number required"),
    leaderEmail: z.string().email("Valid email required"),
    players: z.array(playerSchema).min(minPlayers, `Minimum ${minPlayers} players required`)
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamTitle: "",
      collegeName: "",
      mahostav_id: "",
      leaderName: "",
      leaderPhone: "",
      leaderEmail: "",
      players: Array(minPlayers).fill({ name: "", collegeId: "", contact: "" })
    }
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check for duplicate registrations in the same sport
      const { data: existingTeams } = await supabase.from("team_registrations")
        .select("team_members(player_name)")
        .eq("event_id", eventId);

      const existingPlayerNames = existingTeams?.flatMap(team =>
        team.team_members?.map((m) => m.player_name.toLowerCase()) || []
      ) || [];

      const newPlayerNames = values.players.map(p => p.name.toLowerCase());
      const duplicates = newPlayerNames.filter(name => existingPlayerNames.includes(name));

      if (duplicates.length > 0) {
        toast({
          title: "Duplicate Registration",
          description: `Players: ${duplicates.join(", ")} already registered in another team for this sport.`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Generate team ID
      const { data: teamId, error: teamIdError } = await supabase.rpc("generate_team_id");
      if (teamIdError) throw teamIdError;

      // Create team registration
      const { data: teamData, error: teamError } = await supabase
        .from("team_registrations")
        .insert({
          team_id: teamId,
          event_id: eventId,
          team_title: values.teamTitle,
          college_name: values.collegeName,
          leader_mahostav_id: values.mahostav_id,
          leader_name: values.leaderName,
          leader_phone: values.leaderPhone,
          leader_email: values.leaderEmail,
          user_id: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Insert team members
      const membersData = values.players.map(player => ({
        team_registration_id: teamData.id,
        player_name: player.name,
        college_id: player.collegeId,
        contact: player.contact
      }));

      const { error: membersError } = await supabase
        .from("team_members")
        .insert(membersData);

      if (membersError) throw membersError;

      toast({ title: "Success", description: "Team registered successfully!" });

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to register team", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPlayer = () => {
    const currentPlayers = form.getValues("players");
    form.setValue("players", [...currentPlayers, { name: "", collegeId: "", contact: "" }]);
    setPlayerCount(playerCount + 1);
  };

  const removePlayer = (index) => {
    if (playerCount > minPlayers) {
      const currentPlayers = form.getValues("players");
      form.setValue("players", currentPlayers.filter((_, i) => i !== index));
      setPlayerCount(playerCount - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registration for {eventName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="teamTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Title *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collegeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mahostav_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mahostav ID (Team Leader) *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="font-semibold">Team Leader Details</h3>

              <FormField
                control={form.control}
                name="leaderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaderPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Player Details (Minimum {minPlayers} required)</h3>
                <Button type="button" onClick={addPlayer} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              </div>

              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    {playerCount > minPlayers && (
                      <Button
                        type="button"
                        onClick={() => removePlayer(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <h4 className="font-medium">Player {index + 1}</h4>
                  </div>

                  <FormField
                    control={form.control}
                    name={`players.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`players.${index}.collegeId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College ID (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`players.${index}.contact`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Register Team"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRegistrationForm;
