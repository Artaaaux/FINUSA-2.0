/**
 * Helper to verify whether a user has administrative privileges.
 * Supports dual-check:
 * 1. Environment variable: ADMIN_EMAILS (comma-separated list of admin emails)
 * 2. Database profile: system_role in ('admin', 'super_admin') or role in ('admin', 'super_admin')
 */

export function isUserAdmin(
  email?: string | null,
  systemRole?: string | null,
  role?: string | null
): boolean {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check ADMIN_EMAILS from environment variables
  const envAdminEmails = (
    process.env.ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    ""
  )
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAdminEmails.includes(normalizedEmail)) {
    return true;
  }

  // 2. Check profile system_role or role
  const normalizedSystemRole = (systemRole || "").trim().toLowerCase();
  const normalizedRole = (role || "").trim().toLowerCase();

  return (
    normalizedSystemRole === "admin" ||
    normalizedSystemRole === "super_admin" ||
    normalizedRole === "admin" ||
    normalizedRole === "super_admin"
  );
}

export function getAdminEmails(): string[] {
  return (
    process.env.ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    ""
  )
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
