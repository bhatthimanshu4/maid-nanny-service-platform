export type AccountRole = "household" | "helper";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AccountRole | "admin";
};

type AuthResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  data?: unknown;
};

const TOKEN_KEY = "helper4u.auth.token";
const USER_KEY = "helper4u.auth.user";

export function normalizeAuthUser(value: unknown): AuthUser | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const id = candidate.id ?? candidate._id ?? candidate.userId;
  if (
    typeof id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    typeof candidate.role !== "string"
  ) {
    return null;
  }

  return {
    id,
    name: candidate.name,
    email: candidate.email,
    phone: typeof candidate.phone === "string" ? candidate.phone : "",
    role: candidate.role as AuthUser["role"],
  };
}

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredAuthUser() {
  try {
    const serializedUser = window.localStorage.getItem(USER_KEY);
    return serializedUser ? normalizeAuthUser(JSON.parse(serializedUser)) : null;
  } catch {
    return null;
  }
}

export function storeAuthSession(token: string, user: AuthUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

async function requestAuth(path: string, payload: Record<string, string>) {
  let response: Response;
  try {
    response = await fetch(`/api/backend/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Could not reach the backend. Check that it is running and configured.");
  }

  const result = (await response.json().catch(() => null)) as AuthResponse | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "The request could not be completed.");
  }

  if (!result.token || !result.data) {
    throw new Error("The backend response did not include a login session.");
  }

  const user = normalizeAuthUser(result.data);
  if (!user) throw new Error("The backend returned an incomplete account profile.");

  storeAuthSession(result.token, user);
  return user;
}

export function signIn(email: string, password: string) {
  return requestAuth("login", { email, password });
}

export function signUp(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: AccountRole;
  helperType?: "maid" | "nanny";
}) {
  const { role, helperType, ...accountDetails } = input;

  return requestAuth(role === "helper" ? "helper-register" : "signup", {
    ...accountDetails,
    ...(role === "helper" && helperType ? { helperType } : {}),
  });
}
