export type AuthField =
  | "full_name"
  | "username"
  | "date_of_birth"
  | "email"
  | "password"
  | "confirm_password"
  | "accept_terms"
  | "security";

export type AuthErrorCode =
  | "full_name_invalid"
  | "username_invalid"
  | "email_invalid"
  | "password_too_short"
  | "passwords_mismatch"
  | "adult_required"
  | "terms_required"
  | "security_required"
  | "registration_failed"
  | "login_failed"
  | "verification_resend_failed"
  | "recovery_failed"
  | "password_update_failed"
  | "session_expired";

export type AuthSuccessCode = "recovery_sent" | "verification_sent" | "password_updated";

export type AuthSafeValues = {
  full_name?: string;
  username?: string;
  date_of_birth?: string;
  email?: string;
  accept_terms?: boolean;
  next?: string;
};

export type AuthActionState = {
  status: "idle" | "error" | "success";
  revision: number;
  formError?: AuthErrorCode;
  fieldErrors?: Partial<Record<AuthField, AuthErrorCode>>;
  successCode?: AuthSuccessCode;
  values?: AuthSafeValues;
};

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {
  status: "idle",
  revision: 0,
};

export function authErrorState(
  previous: AuthActionState,
  input: {
    formError?: AuthErrorCode;
    fieldErrors?: Partial<Record<AuthField, AuthErrorCode>>;
    values?: AuthSafeValues;
  },
): AuthActionState {
  return {
    status: "error",
    revision: previous.revision + 1,
    ...input,
  };
}

export function authSuccessState(
  previous: AuthActionState,
  successCode: AuthSuccessCode,
  values?: AuthSafeValues,
): AuthActionState {
  return {
    status: "success",
    revision: previous.revision + 1,
    successCode,
    values,
  };
}
