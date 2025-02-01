import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope } from "lucide-react";

const DoctorAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    specialization: "",
    qualification: "",
    experienceYears: "",
    consultationFee: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const validateForm = () => {
    const trimmedEmail = formData.email.trim();
    
    if (!trimmedEmail || !formData.password) {
      setError("Email and password are required");
      return false;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    
    if (isSignUp) {
      if (!formData.fullName || !formData.specialization || !formData.qualification) {
        setError("All fields are required for registration");
        return false;
      }
      
      if (isNaN(Number(formData.experienceYears)) || Number(formData.experienceYears) < 0) {
        setError("Please enter valid years of experience");
        return false;
      }
      
      if (isNaN(Number(formData.consultationFee)) || Number(formData.consultationFee) <= 0) {
        setError("Please enter valid consultation fee");
        return false;
      }
    }
    
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const trimmedEmail = formData.email.trim().toLowerCase();

      if (isSignUp) {
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              is_doctor: true,
            },
          },
        });
        
        if (signUpError) {
          console.error("Signup error:", signUpError);
          setError(signUpError.message);
          toast.error("Failed to sign up. Please try again.");
          return;
        }

        if (user) {
          const { error: doctorError } = await supabase.from('doctors').insert([
            {
              user_id: user.id,
              full_name: formData.fullName,
              specialization: formData.specialization,
              qualification: formData.qualification,
              experience_years: parseInt(formData.experienceYears),
              consultation_fee: parseFloat(formData.consultationFee),
            },
          ]);

          if (doctorError) {
            console.error("Doctor profile creation error:", doctorError);
            setError("Failed to create doctor profile");
            return;
          }
        }
        
        toast.success("Registration successful! Please check your email.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: formData.password,
        });
        
        if (signInError) {
          console.error("Signin error:", signInError);
          setError(signInError.message);
          toast.error("Failed to sign in. Please check your credentials.");
          return;
        }
        
        const { data: doctorData, error: doctorError } = await supabase
          .rpc('is_doctor', { user_id: (await supabase.auth.getUser()).data.user?.id });

        if (doctorError) {
          console.error("Doctor check error:", doctorError);
          setError("Error verifying doctor status");
          return;
        }

        if (!doctorData) {
          setError("This account is not registered as a doctor");
          await supabase.auth.signOut();
          return;
        }
        
        navigate("/doctor-dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/961492f6-6f5c-4df0-ab56-ff34ba4ed973.png"
            alt="DocInBlink Logo"
            className="h-12 w-auto mb-6"
          />
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {isSignUp ? "Register as a Doctor" : "Doctor Sign In"}
            </h2>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {isSignUp && (
            <>
              <div>
                <label htmlFor="fullName" className="sr-only">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="specialization" className="sr-only">
                  Specialization
                </label>
                <Input
                  id="specialization"
                  type="text"
                  required
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="qualification" className="sr-only">
                  Qualification
                </label>
                <Input
                  id="qualification"
                  type="text"
                  required
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="experienceYears" className="sr-only">
                  Years of Experience
                </label>
                <Input
                  id="experienceYears"
                  type="number"
                  required
                  min="0"
                  placeholder="Years of Experience"
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceYears: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="consultationFee" className="sr-only">
                  Consultation Fee
                </label>
                <Input
                  id="consultationFee"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="Consultation Fee"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({ ...formData, consultationFee: e.target.value })
                  }
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value.trim() })
              }
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isSignUp
                ? "Sign Up as Doctor"
                : "Sign In as Doctor"}
            </Button>
          </div>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setFormData({
                email: "",
                password: "",
                fullName: "",
                specialization: "",
                qualification: "",
                experienceYears: "",
                consultationFee: "",
              });
            }}
            className="text-primary hover:text-primary/90"
          >
            {isSignUp
              ? "Already registered as a doctor? Sign In"
              : "New doctor? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAuth;