"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required className="input" autoFocus aria-invalid={!!state?.error} aria-describedby="login-err" />
      </label>
      {state?.error && <p id="login-err" role="alert" className="text-sm text-signal-soft">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">{pending ? "Checking…" : "Sign in"}</button>
    </form>
  );
}
