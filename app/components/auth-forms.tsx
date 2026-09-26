"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  login,
  register,
  requestPasswordReset,
  resendSignupConfirmation,
  updatePassword,
} from "@/app/actions/auth";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";
import {
  INITIAL_AUTH_ACTION_STATE,
  type AuthActionState,
  type AuthField,
} from "@/lib/auth/action-state";
import type { Locale } from "@/lib/i18n/config";
import { getAuthInteractionCopy } from "@/lib/i18n/auth-interaction";
import { getTranslations } from "@/lib/i18n/messages";
import styles from "./auth-interaction.module.css";

function FormStatus({ state, locale }: { state: AuthActionState; locale: Locale }) {
  const copy = getAuthInteractionCopy(locale);
  if (state.status === "error" && state.formError) {
    return (
      <div className="auth-status auth-status-error" role="alert" aria-live="assertive" aria-atomic="true">
        <span className="auth-status-icon" aria-hidden="true">×</span>
        <div>
          <strong>{copy.attentionTitle}</strong>
          <div className="auth-status-copy">{copy.errors[state.formError]}</div>
        </div>
      </div>
    );
  }

  if (state.status === "success" && state.successCode) {
    return (
      <div className="auth-status auth-status-success" role="status" aria-live="polite" aria-atomic="true">
        <span className="auth-status-icon" aria-hidden="true">✓</span>
        <div>
          <strong>{copy.successTitle}</strong>
          <div className="auth-status-copy">{copy.successes[state.successCode]}</div>
        </div>
      </div>
    );
  }

  return null;
}

function FieldError({
  state,
  field,
  locale,
  id,
  className,
}: {
  state: AuthActionState;
  field: AuthField;
  locale: Locale;
  id: string;
  className?: string;
}) {
  const code = state.fieldErrors?.[field];
  if (!code) return null;
  const copy = getAuthInteractionCopy(locale);
  return <small id={id} className={[styles.fieldError, className].filter(Boolean).join(" ")}>{copy.errors[code]}</small>;
}

function invalidClass(state: AuthActionState, field: AuthField) {
  return state.fieldErrors?.[field] ? styles.inputInvalid : undefined;
}

function describedBy(...ids: Array<string | false | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}

export function LoginForm({ locale, next }: { locale: Locale; next: string }) {
  const t = getTranslations(locale);
  const [state, formAction] = useActionState(login, INITIAL_AUTH_ACTION_STATE);
  const emailError = "login-email-error";
  const passwordError = "login-password-error";
  const securityError = "login-security-error";

  return (
    <>
      <FormStatus state={state} locale={locale} />
      <form action={formAction} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label>
          <span>{t("auth.email")}</span>
          <input
            key={`login-email-${state.revision}`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state.values?.email ?? ""}
            className={invalidClass(state, "email")}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? emailError : undefined}
            required
          />
          <FieldError state={state} field="email" locale={locale} id={emailError} />
        </label>
        <label>
          <span>{t("auth.password")}</span>
          <input
            key={`login-password-${state.revision}`}
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder={t("auth.passwordPlaceholder")}
            className={invalidClass(state, "password")}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={state.fieldErrors?.password ? passwordError : undefined}
            required
          />
          <FieldError state={state} field="password" locale={locale} id={passwordError} />
        </label>
        <div className="auth-inline-link"><Link href="/forgot-password">{t("auth.forgotPassword")}</Link></div>
        <TurnstileField key={`login-turnstile-${state.revision}`} action="login" locale={locale} />
        <FieldError state={state} field="security" locale={locale} id={securityError} className={styles.securityError} />
        <AuthSubmitButton idleLabel={t("auth.signIn")} pendingLabel={t("auth.signingIn")} />
      </form>
    </>
  );
}

export function RegisterForm({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const [state, formAction] = useActionState(register, INITIAL_AUTH_ACTION_STATE);
  const errorId = (field: AuthField) => `register-${field}-error`;

  return (
    <>
      <FormStatus state={state} locale={locale} />
      <form action={formAction} className="auth-form">
        <label>
          <span>{t("auth.fullName")}</span>
          <input
            key={`register-full-name-${state.revision}`}
            name="full_name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            placeholder="Dodong Pinagtibay"
            defaultValue={state.values?.full_name ?? ""}
            className={invalidClass(state, "full_name")}
            aria-invalid={Boolean(state.fieldErrors?.full_name)}
            aria-describedby={state.fieldErrors?.full_name ? errorId("full_name") : undefined}
            required
          />
          <FieldError state={state} field="full_name" locale={locale} id={errorId("full_name")} />
        </label>
        <label>
          <span>{t("auth.username")}</span>
          <input
            key={`register-username-${state.revision}`}
            name="username"
            type="text"
            autoCapitalize="none"
            autoComplete="username"
            pattern="[A-Za-z0-9][A-Za-z0-9._]{2,29}"
            placeholder="Oskar"
            defaultValue={state.values?.username ?? ""}
            className={invalidClass(state, "username")}
            aria-invalid={Boolean(state.fieldErrors?.username)}
            aria-describedby={describedBy("username-help", state.fieldErrors?.username && errorId("username"))}
            required
          />
          <small id="username-help">{t("auth.usernameHelp")}</small>
          <FieldError state={state} field="username" locale={locale} id={errorId("username")} />
        </label>
        <label>
          <span>{t("auth.dateOfBirth")}</span>
          <input
            key={`register-dob-${state.revision}`}
            name="date_of_birth"
            type="date"
            autoComplete="bday"
            defaultValue={state.values?.date_of_birth ?? ""}
            className={invalidClass(state, "date_of_birth")}
            aria-invalid={Boolean(state.fieldErrors?.date_of_birth)}
            aria-describedby={describedBy("dob-help", state.fieldErrors?.date_of_birth && errorId("date_of_birth"))}
            required
          />
          <small id="dob-help">{t("auth.ageHelp")}</small>
          <FieldError state={state} field="date_of_birth" locale={locale} id={errorId("date_of_birth")} />
        </label>
        <label>
          <span>{t("auth.email")}</span>
          <input
            key={`register-email-${state.revision}`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state.values?.email ?? ""}
            className={invalidClass(state, "email")}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? errorId("email") : undefined}
            required
          />
          <FieldError state={state} field="email" locale={locale} id={errorId("email")} />
        </label>
        <label>
          <span>{t("auth.password")}</span>
          <input
            key={`register-password-${state.revision}`}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            placeholder="At least 10 characters"
            className={invalidClass(state, "password")}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={describedBy("password-help", state.fieldErrors?.password && errorId("password"))}
            required
          />
          <small id="password-help">{t("auth.newPasswordHelp")}</small>
          <FieldError state={state} field="password" locale={locale} id={errorId("password")} />
        </label>
        <label>
          <span>{t("auth.confirmPassword")}</span>
          <input
            key={`register-confirm-password-${state.revision}`}
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            className={invalidClass(state, "confirm_password")}
            aria-invalid={Boolean(state.fieldErrors?.confirm_password)}
            aria-describedby={state.fieldErrors?.confirm_password ? errorId("confirm_password") : undefined}
            required
          />
          <FieldError state={state} field="confirm_password" locale={locale} id={errorId("confirm_password")} />
        </label>
        <label className="check-row">
          <input
            key={`register-terms-${state.revision}`}
            name="accept_terms"
            type="checkbox"
            defaultChecked={state.values?.accept_terms ?? false}
            aria-invalid={Boolean(state.fieldErrors?.accept_terms)}
            aria-describedby={state.fieldErrors?.accept_terms ? errorId("accept_terms") : undefined}
            required
          />
          <span>{t("auth.agreePrefix")} <Link href="/terms">{t("auth.terms")}</Link> {t("auth.and")} <Link href="/privacy">{t("auth.privacy")}</Link>.</span>
          <FieldError state={state} field="accept_terms" locale={locale} id={errorId("accept_terms")} className={styles.checkError} />
        </label>
        <TurnstileField key={`register-turnstile-${state.revision}`} action="register" locale={locale} />
        <FieldError state={state} field="security" locale={locale} id={errorId("security")} className={styles.securityError} />
        <AuthSubmitButton idleLabel={t("auth.createAccount")} pendingLabel={t("auth.creatingAccount")} />
      </form>
    </>
  );
}

export function ForgotPasswordForm({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const [state, formAction] = useActionState(requestPasswordReset, INITIAL_AUTH_ACTION_STATE);
  const emailError = "recovery-email-error";
  const securityError = "recovery-security-error";

  if (state.status === "success") {
    return <div className={styles.completion}><FormStatus state={state} locale={locale} /></div>;
  }

  return (
    <>
      <FormStatus state={state} locale={locale} />
      <form action={formAction} className="auth-form">
        <label>
          <span>{t("auth.email")}</span>
          <input
            key={`recovery-email-${state.revision}`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state.values?.email ?? ""}
            className={invalidClass(state, "email")}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? emailError : undefined}
            required
          />
          <FieldError state={state} field="email" locale={locale} id={emailError} />
        </label>
        <TurnstileField key={`recovery-turnstile-${state.revision}`} action="password-reset" locale={locale} />
        <FieldError state={state} field="security" locale={locale} id={securityError} className={styles.securityError} />
        <AuthSubmitButton idleLabel={t("auth.sendRecovery")} pendingLabel={t("auth.sendingRecovery")} />
      </form>
    </>
  );
}

export function ResendVerificationForm({ locale, email }: { locale: Locale; email: string }) {
  const t = getTranslations(locale);
  const [state, formAction] = useActionState(resendSignupConfirmation, INITIAL_AUTH_ACTION_STATE);
  const securityError = "resend-security-error";

  if (state.status === "success") {
    const returnPath = `/auth/check-email?email=${encodeURIComponent(email)}`;
    return (
      <div className={styles.completion}>
        <FormStatus state={state} locale={locale} />
        <div className="auth-action-stack">
          <Link className="secondary-button auth-button-link" href={returnPath}>{t("auth.resendVerification")}</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <FormStatus state={state} locale={locale} />
      <form action={formAction} className="auth-form">
        <input name="email" type="hidden" value={email} />
        <TurnstileField key={`resend-turnstile-${state.revision}`} action="resend-confirmation" locale={locale} />
        <FieldError state={state} field="security" locale={locale} id={securityError} className={styles.securityError} />
        <AuthSubmitButton idleLabel={t("auth.resendVerification")} pendingLabel={t("auth.sendingVerification")} />
      </form>
    </>
  );
}

export function UpdatePasswordForm({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const [state, formAction] = useActionState(updatePassword, INITIAL_AUTH_ACTION_STATE);
  const passwordError = "update-password-error";
  const confirmationError = "update-confirm-password-error";

  return (
    <>
      <FormStatus state={state} locale={locale} />
      <form action={formAction} className="auth-form">
        <label>
          <span>{t("auth.newPassword")}</span>
          <input
            key={`update-password-${state.revision}`}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            placeholder="At least 10 characters"
            className={invalidClass(state, "password")}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={state.fieldErrors?.password ? passwordError : undefined}
            required
          />
          <FieldError state={state} field="password" locale={locale} id={passwordError} />
        </label>
        <label>
          <span>{t("auth.confirmNewPassword")}</span>
          <input
            key={`update-confirm-password-${state.revision}`}
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            placeholder={t("auth.newPasswordAgain")}
            className={invalidClass(state, "confirm_password")}
            aria-invalid={Boolean(state.fieldErrors?.confirm_password)}
            aria-describedby={state.fieldErrors?.confirm_password ? confirmationError : undefined}
            required
          />
          <FieldError state={state} field="confirm_password" locale={locale} id={confirmationError} />
        </label>
        <AuthSubmitButton idleLabel={t("auth.updatePassword")} pendingLabel={t("auth.updatingPassword")} />
      </form>
    </>
  );
}
