import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { useNavigate } from "react-router-dom";


const loginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(1).optional(),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
 const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


const form = useForm<Partial<LoginFormValues>>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
    rememberMe: false,
  },
});




const onSubmit = async (data: Partial<LoginFormValues>) => {
  setIsLoading(true);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Login data:", data);
  setIsLoading(false);

  navigate("/dashboard");
};



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-dark dark:text-light hover:text-dark/70 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Travel AI
        </Link>

        {/* Login Card */}
        <div className=" rounded-2xl shadow-md bg-dark/50 dark:bg-primary p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[url(/vector---0.svg)] bg-[100%_100%]" />
              <h1 className="font-bold text-2xl font-['Plus_Jakarta_Sans',Helvetica]">
                Travel AI
              </h1>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-green">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 border-primary bg-dark/50 dark:bg-dark transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 pr-12 border-primary bg-dark/50 dark:bg-dark transition-colors"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-green bg-dark/50 dark:bg-dark transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  to="/forgot-password"
                  className="text-sm hover:text-green font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 hover:bg-green font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className=" hover:text-green font-medium bg-secondary dark:bg-secondary"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};