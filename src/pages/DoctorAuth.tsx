
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope } from "lucide-react";
import { validateDoctorForm } from "@/utils/validation";
import { createDoctorProfile, handleAuthError } from "@/services/doctorAuth";
import { RegistrationForm } from "@/components/doctor/RegistrationForm";

const DoctorAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [lastSignupAttempt, setLastSignupAttempt] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    specialization: "",
    qualification: "",
    experienceYears: "",
    consultationFee: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const validationError = validateDoctorForm(formData, isSignUp, lastSignupAttempt);
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      const trimmedEmail = formData.email.trim().toLowerCase();

      if (isSignUp) {
        setLastSignupAttempt(Date.now());
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
          setError(handleAuthError(signUpError));
          setIsLoading(false);
          return;
        }

        if (signUpData.user) {
          try {
            await createDoctorProfile(signUpData.user.id, formData);
            toast.success("Registration successful! Please check your email.");
            setIsSignUp(false);
            setFormData({
              email: trimmedEmail,
              password: "",
              fullName: "",
              specialization: "",
              qualification: "",
              experienceYears: "",
              consultationFee: "",
            });
          } catch (error: any) {
            console.error("Failed to create doctor profile:", error);
            setError("Failed to create doctor profile. Please try again.");
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error("Error signing out:", signOutError);
            }
          }
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: formData.password,
        });
        
        if (signInError) {
          setError(handleAuthError(signInError));
          setIsLoading(false);
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
        
        toast.success("Successfully signed in!");
        navigate("/doctor-dashboard");
      }
    } catch (error: any) {
      setError(handleAuthError(error));
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
            <RegistrationForm formData={formData} onChange={handleFormChange} />
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
              onChange={(e) => handleFormChange("email", e.target.value.trim())}
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
              onChange={(e) => handleFormChange("password", e.target.value)}
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
