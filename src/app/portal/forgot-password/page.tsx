"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../auth.module.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // @ts-ignore
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });

    if (error) {
      setError(error.message || "An error occurred");
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password: newPassword,
    });

    if (error) {
      setError(error.message || "An error occurred");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/portal/login"), 3000);
    }
    setLoading(false);
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
            <h2 className={styles.title}>
              {step === 1 ? "Reset Password" : "Check Your Email"}
            </h2>
            <p className={styles.subtitle}>
              {step === 1 
                ? "Enter your email address and we'll send you a 6-digit verification code." 
                : `We've sent a 6-digit code to ${email}. Please enter it below.`}
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={styles.errorAlert}
              >
                <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.successAlert}
              >
                <div className={styles.successIconContainer}>
                  <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className={styles.successTitle}>Password Reset Successfully!</h4>
                <p className={styles.successMessage}>Redirecting you to login momentarily...</p>
              </motion.div>
            ) : step === 1 ? (
              <motion.form 
                key="form-step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSendCode} 
                className={styles.form}
              >
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
                      Sending...
                    </div>
                  ) : "Send Reset Code"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form 
                key="form-step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyAndReset} 
                className={styles.form}
              >
                <div className={styles.formGroup}>
                  <label className={styles.label}>6-Digit Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    className={`${styles.input} ${styles.otpInput}`}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>New Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      className={styles.input}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                
                <div style={{ paddingTop: '0.5rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                    style={{ marginBottom: '0.75rem' }}
                  >
                    {loading ? "Resetting..." : "Set New Password"}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(null); }}
                    className={styles.secondaryBtn}
                  >
                    Didn&apos;t receive a code? Try again
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className={styles.footer}>
            <Link href="/portal/login" className={styles.footerLink}>
              <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
