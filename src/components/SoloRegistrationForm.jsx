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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  participantName: z.string().min(1, "Participant name is required"),
  mahostav_id: z.string().min(1, "Mahostav ID is required"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Valid phone number required")
});

const SoloRegistrationForm = ({ eventId, eventName, open, onOpenChange, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participantName: "",
      mahostav_id: "",
      phoneNumber: ""
    }
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if already registered
      const { data: existing } = await supabase.from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .maybeSingle();

      if (existing) {
        toast({ title: "Error", description: "You have already registered for this event", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("registrations")
        .insert({
          user_id: user.id,
          event_id: eventId,
          participant_name: values.participantName,
          mahostav_id: values.mahostav_id,
          phone_number: values.phoneNumber
        });

      if (error) throw error;

      toast({ title: "Success", description: "Registration successful!" });

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to register", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registration for {eventName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="participantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant Name *</FormLabel>
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
                  <FormLabel>Mahostav ID *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SoloRegistrationForm;
