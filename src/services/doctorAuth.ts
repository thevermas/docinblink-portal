
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const handleAuthError = (error: AuthError) => {
  console.error("Auth error:", error);
  
  if (error.status === 429) {
    return "Too many attempts. Please wait a few seconds before trying again.";
  }

  switch (error.message) {
    case "Email address is invalid":
    case "Email address invalid":
      return "Please enter a valid email address. Test emails are not allowed.";
    case "User already registered":
      return "An account with this email already exists. Please sign in instead.";
    case "Invalid login credentials":
      return "Invalid email or password. Please try again.";
    case "For security purposes, you can only request this after 7 seconds.":
      return "Please wait 7 seconds before trying again.";
    default:
      return error.message || "An unexpected error occurred. Please try again.";
  }
};

export const createDoctorProfile = async (userId: string, doctorData: {
  fullName: string;
  specialization: string;
  qualification: string;
  experienceYears: string;
  consultationFee: string;
}) => {
  try {
    // Wait briefly for session to be established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify session exists
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session error:", sessionError);
      throw new Error("Failed to verify session");
    }
    
    if (!session) {
      throw new Error("No active session found");
    }

    const { error: doctorError } = await supabase
      .from('doctors')
      .insert([
        {
          user_id: userId,
          full_name: doctorData.fullName,
          specialization: doctorData.specialization,
          qualification: doctorData.qualification,
          experience_years: parseInt(doctorData.experienceYears),
          consultation_fee: parseFloat(doctorData.consultationFee),
        },
      ]);

    if (doctorError) {
      console.error("Doctor profile creation error:", doctorError);
      throw new Error(doctorError.message);
    }
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    throw error;
  }
};
