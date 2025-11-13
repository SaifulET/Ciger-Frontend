// utils/utility.ts

/**
 * Handles unauthorized responses (HTTP 401)
 * Clears all stored data and redirects user to /login
 */
export function unauthorized(code: number): void {
  if (typeof window !== "undefined" && code === 401) {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  }
}

/**
 * Save user email to sessionStorage
 */
export function setEmail(email: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("email", email);
  }
}

/**
 * Retrieve user email from sessionStorage
 */
export function getEmail(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("email");
  }
  return null;
}
