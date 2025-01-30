import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Registration successful! Please check your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {isSignUp && (
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
                setFormData({ ...formData, email: e.target.value })
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
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isSignUp
                ? "Sign Up"
                : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:text-primary/90"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;