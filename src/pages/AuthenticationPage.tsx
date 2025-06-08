import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type RegisterFormData = z.infer<typeof registerSchema>;

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors, isSubmitting: isLoginSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "user@example.com", password: "password123" } // Default credentials for easy navigation
  });

  const { register: registerRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  console.log('AuthenticationPage loaded');

  const onLogin: SubmitHandler<LoginFormData> = async (data) => {
    console.log('Login attempt:', data);
    setAuthError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.email === "user@example.com" && data.password === "password123") {
      toast.success("Login successful! Redirecting...");
      navigate('/dashboard');
    } else {
      setAuthError("Invalid email or password. Please try again.");
      toast.error("Login failed: Invalid email or password.");
    }
  };

  const onRegister: SubmitHandler<RegisterFormData> = async (data) => {
    console.log('Registration attempt:', data);
    setAuthError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Registration successful! Please log in.");
    // Ideally, switch to login tab or navigate, here just a message
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><LogIn className="mr-2 h-5 w-5" />Login to Your Account</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit(onLogin)}>
              <CardContent className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="login-email" type="email" placeholder="m@example.com" {...loginRegister("email")} className="pl-10" />
                  </div>
                  {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...loginRegister("password")} className="pl-10 pr-10" />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                  </div>
                  {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <Link to="/forgot-password" // Assuming a forgot password page might exist
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoginSubmitting}>
                  {isLoginSubmitting ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><UserPlus className="mr-2 h-5 w-5" />Create an Account</CardTitle>
              <CardDescription>Fill in the details below to register.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegisterSubmit(onRegister)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                   <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="register-email" type="email" placeholder="m@example.com" {...registerRegister("email")} className="pl-10"/>
                  </div>
                  {registerErrors.email && <p className="text-sm text-red-500">{registerErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input id="register-password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...registerRegister("password")} className="pl-10 pr-10"/>
                     <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                  </div>
                  {registerErrors.password && <p className="text-sm text-red-500">{registerErrors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...registerRegister("confirmPassword")} className="pl-10 pr-10"/>
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                  </div>
                  {registerErrors.confirmPassword && <p className="text-sm text-red-500">{registerErrors.confirmPassword.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isRegisterSubmitting}>
                   {isRegisterSubmitting ? "Registering..." : "Register"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;