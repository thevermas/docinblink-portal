
export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  const invalidTestDomains = ['test.com', 'example.com'];
  const domain = trimmedEmail.split('@')[1];
  if (invalidTestDomains.includes(domain)) {
    return false;
  }
  
  return true;
};

export const validateDoctorForm = (formData: {
  email: string;
  password: string;
  fullName?: string;
  specialization?: string;
  qualification?: string;
  experienceYears?: string;
  consultationFee?: string;
}, isSignUp: boolean, lastSignupAttempt: number) => {
  const trimmedEmail = formData.email.trim();
  
  if (!trimmedEmail || !formData.password) {
    return "Email and password are required";
  }
  
  if (!validateEmail(trimmedEmail)) {
    return "Please enter a valid email address. Test emails are not allowed.";
  }
  
  if (formData.password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  
  if (isSignUp) {
    if (!formData.fullName || !formData.specialization || !formData.qualification) {
      return "All fields are required for registration";
    }
    
    if (isNaN(Number(formData.experienceYears)) || Number(formData.experienceYears) < 0) {
      return "Please enter valid years of experience";
    }
    
    if (isNaN(Number(formData.consultationFee)) || Number(formData.consultationFee) <= 0) {
      return "Please enter valid consultation fee";
    }

    const now = Date.now();
    if (now - lastSignupAttempt < 7000) {
      return "Please wait a few seconds before trying to sign up again";
    }
  }
  
  return null;
};
