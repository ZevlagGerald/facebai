export type PostValidationErrorCode = "body_required" | "body_too_long";

export type PostValidationResult =
  | { ok: true; value: { body: string } }
  | { ok: false; code: PostValidationErrorCode };

export const POST_BODY_MAX_LENGTH = 5000;

export function validatePostBody(input: string): PostValidationResult {
  const body = input.trim();
  if (!body) return { ok: false, code: "body_required" };
  if (body.length > POST_BODY_MAX_LENGTH) return { ok: false, code: "body_too_long" };
  return { ok: true, value: { body } };
}
