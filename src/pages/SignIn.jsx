import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Navbar from "@/components/Navbar";

const signInSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["university", "outside"])
});

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "university",
    universityRollNo: "",
    collegeName: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validated = signInSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            university_roll_no: formData.universityRollNo,
            college_name: formData.collegeName
          }
        }
      });

      if (error) throw error;

      toast({ title: "Success", description: "Registration successful! Please check your email to verify your account." });

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message || "Failed to register", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 flex items-center justify-center py-12">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register for MAHOSTAV 2026
            </h1>
            <p className="text-gray-600">
              Create your account to participate
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Student Type</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="university"
                    checked={formData.role === "university"}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mr-2"
                  />
                  University Student
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="outside"
                    checked={formData.role === "outside"}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mr-2"
                  />
                  Outside Student
                </label>
              </div>
            </div>

            {formData.role === "university" ? (
              <div>
                <Label htmlFor="universityRollNo">University Roll Number</Label>
                <Input
                  id="universityRollNo"
                  type="text"
                  value={formData.universityRollNo}
                  onChange={(e) => setFormData({ ...formData, universityRollNo: e.target.value })}
                  required={formData.role === "university"}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="collegeName">College/Institute Name</Label>
                <Input
                  id="collegeName"
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  required={formData.role === "outside"}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SignIn;
