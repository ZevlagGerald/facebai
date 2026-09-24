"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdult, normalizeUsername, USERNAME_PATTERN } from "@/lib/auth/validation";
import { canonicalSiteUrl, FACEBAI_LEGAL_VERSION, safeLocalPath, turnstileRequired } from "@/lib/auth/security";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function captchaToken(formData: FormData, path: string) {
  const token = String(formData.get("cf-turnstile-response") ?? "").trim();
  if (turnstileRequired() && !token) fail(path, "Please complete the security check.");
  return token || undefined;
}

export async function register(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const dateOfBirth = String(formData.get("date_of_birth") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const acceptedTerms = formData.get("accept_terms") === "on";
  const token = captchaToken(formData, "/register");

  if (fullName.length < 2 || fullName.length > 80) fail("/register", "Enter your real display name.");
  if (!USERNAME_PATTERN.test(username)) fail("/register", "Username must be 3–30 lowercase letters, numbers, dots, or underscores.");
  if (!email.includes("@")) fail("/register", "Enter a valid email address.");
  if (password.length < 10) fail("/register", "Use a password with at least 10 characters.");
  if (password !== confirmPassword) fail("/register", "Passwords do not match.");
  if (!isAdult(dateOfBirth)) fail("/register", "FaceBai private beta currently requires users to be 18 or older.");
  if (!acceptedTerms) fail("/register", "You must accept the Terms and Privacy Notice.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken: token,
      data: {
        full_name: fullName,
        username,
        date_of_birth: dateOfBirth,
        accepted_terms: true,
        accepted_privacy: true,
        legal_version: FACEBAI_LEGAL_VERSION,
      },
    },
  });

  if (error) fail("/register", "Registration could not be completed. Check your details and try again.");
  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeLocalPath(String(formData.get("next") ?? "/tambayan"));
  const token = captchaToken(formData, "/login");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken: token },
  });

  if (error) fail("/login", "Incorrect email or password.");
  redirect(next);
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = captchaToken(formData, "/forgot-password");
  if (!email.includes("@")) fail("/forgot-password", "Enter a valid email address.");

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${canonicalSiteUrl()}/auth/recover`,
    captchaToken: token,
  });

  redirect("/forgot-password?sent=1");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (password.length < 10) fail("/auth/update-password", "Use a password with at least 10 characters.");
  if (password !== confirmPassword) fail("/auth/update-password", "Passwords do not match.");

  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !data?.claims?.sub) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) fail("/auth/update-password", "Password could not be updated. Request a new recovery link and try again.");

  await supabase.auth.signOut();
  redirect("/login?message=Password%20updated.%20Please%20sign%20in%20again.");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
