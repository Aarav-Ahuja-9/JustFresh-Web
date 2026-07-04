import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { db } from "./db";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                console.log("=== SEND VERIFICATION OTP CALLED ===");
                console.log("Email:", email, "OTP:", otp, "Type:", type);
                
                if (type === "forget-password" || type === "sign-in") {
                    console.log("Attempting to send email via Resend...");
                    const res = await resend.emails.send({
                        from: 'onboarding@resend.dev',
                        to: email,
                        subject: 'Your Password Reset Code',
                        html: `
                            <h2>Password Reset Code</h2>
                            <p>Hi there,</p>
                            <p>You requested a password reset. Please enter the following 6-digit code to continue:</p>
                            <div style="font-size: 32px; font-weight: bold; padding: 10px; background-color: #f3f4f6; text-align: center; letter-spacing: 4px; border-radius: 8px; margin: 20px 0;">
                                ${otp}
                            </div>
                            <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
                        `
                    });
                    console.log("Resend API Response:", res);
                }
            }
        })
    ]
});
