"use server";

import { redirect } from "next/navigation";
import {
  type AuthActionState,
  type AuthField,
  type AuthSafeValues,
  authErrorState,
  authSuccessState,
} from "@/lib/auth/action-state";
import { createClient } from "@/lib/supabase/server";
import { isAdult, normalizeUsername, USERNAME_PATTERN } from "@/lib/auth/validation";
import { canonicalSiteUrl, FACEBAI_LEGAL_VERSION, safeLocalPath, turnstileRequired } from "@/lib/auth/security";

function captchaToken(formData: FormData) {
  return String(formData.get("cf-turnstile-response") ?? "").trim();
}

function hasFieldErrors(errors: Partial<Record<AuthField, unknown>>) {
  return Object.keys(errors).length > 0;
}

export async function register(previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const dateOfBirth = String(formData.get("date_of_birth") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const acceptedTerms = formData.get("accept_terms") === "on";
  const token = captchaToken(formData);

  const values: AuthSafeValues = {
    full_name: fullName,
    username,
    date_of_birth: dateOfBirth,
    email,
    accept_terms: acceptedTerms,
  };

  const fieldErrors: Partial<Record<AuthField, import("@/lib/auth/action-state").AuthErrorCode>> = {};
  if (fullName.length < 2 || fullName.length > 80) fieldErrors.full_name = "full_name_invalid";
  if (!USERNAME_PATTERN.test(username)) fieldErrors.username = "username_invalid";
  if (!isAdult(dateOfBirth)) fieldErrors.date_of_birth = "adult_required";
  if (!email.includes("@")) fieldErrors.email = "email_invalid";
  if (password.length < 10) fieldErrors.password = "password_too_short";
  if (password !== confirmPassword) fieldErrors.confirm_password = "passwords_mismatch";
  if (!acceptedTerms) fieldErrors.accept_terms = "terms_required";
  if (turnstileRequired() && !token) fieldErrors.security = "security_required";

  if (hasFieldErrors(fieldErrors)) {
    return authErrorState(previous, { fieldErrors, values });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken: token || undefined,
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

  if (error) return authErrorState(previous, { formError: "registration_failed", values });
  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}

export async function resendSignupConfirmation(previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = captchaToken(formData);
  const values: AuthSafeValues = { email };
  const fieldErrors: Partial<Record<AuthField, import("@/lib/auth/action-state").AuthErrorCode>> = {};

  if (!email.includes("@")) fieldErrors.email = "email_invalid";
  if (turnstileRequired() && !token) fieldErrors.security = "security_required";
  if (hasFieldErrors(fieldErrors)) return authErrorState(previous, { fieldErrors, values });

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { captchaToken: token || undefined },
  });

  if (error) return authErrorState(previous, { formError: "verification_resend_failed", values });
  return authSuccessState(previous, "verification_sent", values);
}

export async function login(previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeLocalPath(String(formData.get("next") ?? "/tambayan"));
  const token = captchaToken(formData);
  const values: AuthSafeValues = { email, next };
  const fieldErrors: Partial<Record<AuthField, import("@/lib/auth/action-state").AuthErrorCode>> = {};

  if (!email.includes("@")) fieldErrors.email = "email_invalid";
  if (!password) fieldErrors.password = "login_failed";
  if (turnstileRequired() && !token) fieldErrors.security = "security_required";
  if (hasFieldErrors(fieldErrors)) return authErrorState(previous, { fieldErrors, values });

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken: token || undefined },
  });

  if (error) return authErrorState(previous, { formError: "login_failed", values });
  redirect(next);
}

export async function requestPasswordReset(previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = captchaToken(formData);
  const values: AuthSafeValues = { email };
  const fieldErrors: Partial<Record<AuthField, import("@/lib/auth/action-state").AuthErrorCode>> = {};

  if (!email.includes("@")) fieldErrors.email = "email_invalid";
  if (turnstileRequired() && !token) fieldErrors.security = "security_required";
  if (hasFieldErrors(fieldErrors)) return authErrorState(previous, { fieldErrors, values });

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${canonicalSiteUrl()}/auth/recover`,
    captchaToken: token || undefined,
  });

  // Keep account-existence behavior opaque while still surfacing operational failures.
  if (error) return authErrorState(previous, { formError: "recovery_failed", values });
  return authSuccessState(previous, "recovery_sent", values);
}

export async function updatePassword(previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const fieldErrors: Partial<Record<AuthField, import("@/lib/auth/action-state").AuthErrorCode>> = {};

  if (password.length < 10) fieldErrors.password = "password_too_short";
  if (password !== confirmPassword) fieldErrors.confirm_password = "passwords_mismatch";
  if (hasFieldErrors(fieldErrors)) return authErrorState(previous, { fieldErrors });

  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !data?.claims?.sub) {
    return authErrorState(previous, { formError: "session_expired" });
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return authErrorState(previous, { formError: "password_update_failed" });

  await supabase.auth.signOut();
  redirect("/login?status=password-updated");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
