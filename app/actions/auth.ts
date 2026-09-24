"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdult, normalizeUsername, USERNAME_PATTERN } from "@/lib/auth/validation";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function register(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const dateOfBirth = String(formData.get("date_of_birth") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const accepted = formData.get("accept_terms") === "on";

  if (fullName.length < 2 || fullName.length > 80) fail("/register", "Enter your real display name.");
  if (!USERNAME_PATTERN.test(username)) fail("/register", "Username must be 3–30 lowercase letters, numbers, dots, or underscores.");
  if (!email.includes("@")) fail("/register", "Enter a valid email address.");
  if (password.length < 10) fail("/register", "Use a password with at least 10 characters.");
  if (password !== confirmPassword) fail("/register", "Passwords do not match.");
  if (!isAdult(dateOfBirth)) fail("/register", "FaceBai private beta currently requires users to be 18 or older.");
  if (!accepted) fail("/register", "You must accept the Terms and Privacy Notice.");

  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin,
      data: {
        full_name: fullName,
        username,
        date_of_birth: dateOfBirth,
      },
    },
  });

  if (error) fail("/register", error.message);
  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const requestedNext = String(formData.get("next") ?? "/tambayan");
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/tambayan";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) fail("/login", "Incorrect email or password.");
  redirect(next);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
