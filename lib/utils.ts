import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFirebaseError(err: any): string {
  if (!err) return "An unexpected error occurred. Please try again.";
  
  const msg = typeof err === "string" ? err : err?.message || err?.code || "";
  const code = err?.code || "";

  // Exact Firebase Auth error mappings
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email address or password. Please double-check your credentials and try again.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please log in instead or use a different email.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Your password must be at least 6 characters long.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Access is temporarily paused for your security. Please try again in a few minutes.";
    case "auth/network-request-failed":
      return "Unable to reach server. Please check your internet connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact system support.";
    case "auth/popup-closed-by-user":
      return "Authentication process was cancelled. Please try again.";
    case "permission-denied":
    case "firestore/permission-denied":
      return "Access restricted: You do not have permission to perform this action.";
  }

  if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")) {
    return "Invalid email address or password. Please double-check your credentials and try again.";
  }
  if (msg.includes("auth/email-already-in-use")) {
    return "An account with this email address already exists. Please log in instead.";
  }
  if (msg.includes("permission-denied")) {
    return "Access restricted: You do not have permission to perform this action.";
  }

  // Strip raw Firebase wrappers like 'Firebase: Error (auth/...)'
  let cleaned = msg
    .replace(/^Firebase:\s*/i, "")
    .replace(/^Error\s*\(?/i, "")
    .replace(/^FirebaseError:\s*/i, "")
    .replace(/Firebase:\s*Error\s*\(auth\/[^)]+\)\.?/i, "")
    .replace(/\(auth\/[^)]+\)/g, "")
    .replace(/\(firestore\/[^)]+\)/g, "")
    .trim();

  if (cleaned.startsWith("(") && cleaned.endsWith(")")) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  if (cleaned.length > 0) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return "An unexpected error occurred. Please try again.";
}

