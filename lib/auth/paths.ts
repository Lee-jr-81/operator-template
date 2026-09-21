export function isProtectedDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export function isLoginPath(pathname: string) {
  return pathname === "/login";
}
