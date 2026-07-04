"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../auth.module.css";

export default function PortalRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setError(error.message || "An error occurred");
      setLoading(false);
    } else {
      router.push("/portal/dashboard");
      router.refresh();
    }
  };

  return (
    <div className={styles.authPage}>
      {/* Background ambient blobs */}
      <div className={styles.blob}></div>
      <div className={styles.blob}></div>

      {/* Centered Form Card */}
      <div className={styles.formSection}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={styles.formContainer}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>Create Account</h2>
            <p className={styles.subtitle}>Join us and streamline your agricultural trade.</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.errorAlert}
            >
              <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.showPasswordBtn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.29c4.478 0 8.268 2.943 9.542 7a10.02 10.02 0 01-4.148 5.143l3.29 3.29" />
                    </svg>
                  ) : (
                    <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <div className={styles.loadingSpinner}>
                  <svg className={styles.spinnerIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : "Register"}
            </motion.button>
            
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/portal/dashboard"
                });
              }}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.72 17.57V20.34H19.29C21.38 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.01 19.29 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.72 16.7 5.86 14.11H2.18V16.97C3.99 20.57 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.86 14.11C5.64 13.45 5.51 12.74 5.51 12C5.51 11.26 5.64 10.55 5.86 9.89V7.03H2.18C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.18 16.97L5.86 14.11Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.03L19.38 3.85C17.46 2.06 14.97 1 12 1C7.7 1 3.99 3.43 2.18 7.03L5.86 9.89C6.72 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Already have an account?{" "}
              <Link href="/portal/login" className={styles.footerLink}>
                Sign In here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}