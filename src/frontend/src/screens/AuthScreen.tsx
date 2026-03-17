import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Shield, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type AuthView = "login" | "signup" | "otp";

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export default function AuthScreen({
  onAuthenticated: _onAuthenticated,
}: AuthScreenProps) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, isLoggingIn } = useInternetIdentity();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Minimum 6 characters";
    if (view === "signup") {
      if (!name) errs.name = "Name is required";
      if (password !== confirmPassword)
        errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    login();
  };

  const handleSignup = () => {
    if (!validate()) return;
    setView("otp");
    setOtpValue("123456");
  };

  const handleOtp = () => {
    if (otpValue.length < 6) {
      setErrors({ otp: "Enter 6-digit code" });
      return;
    }
    login();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Logo area */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-blue mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Smart Pay</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fast, secure digital payments
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
            data-ocid="auth.panel"
          >
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-1">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Sign in to your account
              </p>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="login-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    autoComplete="email"
                    data-ocid="auth.input"
                  />
                  {errors.email && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="login-password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      data-ocid="auth.input"
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-blue"
                  data-ocid="auth.submit_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("signup")}
                  className="text-blue-600 font-semibold hover:underline"
                  data-ocid="auth.link"
                >
                  Sign Up
                </button>
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Secured by Internet Identity
            </p>
          </motion.div>
        )}

        {view === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
            data-ocid="auth.panel"
          >
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-1">
                Create account
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Join Smart Pay today
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    data-ocid="auth.input"
                  />
                  {errors.name && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    autoComplete="email"
                    data-ocid="auth.input"
                  />
                  {errors.email && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="signup-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      data-ocid="auth.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="signup-confirm"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    data-ocid="auth.input"
                  />
                  {errors.confirmPassword && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleSignup}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-blue"
                  data-ocid="auth.submit_button"
                >
                  Create Account
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-blue-600 font-semibold hover:underline"
                  data-ocid="auth.link"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {view === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
            data-ocid="auth.panel"
          >
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground text-center mb-1">
                Verify your email
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp-input" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <Input
                    id="otp-input"
                    placeholder="123456"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.slice(0, 6))}
                    className="mt-1 text-center text-2xl tracking-widest font-bold"
                    maxLength={6}
                    data-ocid="auth.input"
                    onKeyDown={(e) => e.key === "Enter" && handleOtp()}
                  />
                  {errors.otp && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.otp}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleOtp}
                  disabled={isLoggingIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-blue"
                  data-ocid="auth.submit_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Demo code:{" "}
                <span className="font-bold text-blue-600">123456</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
