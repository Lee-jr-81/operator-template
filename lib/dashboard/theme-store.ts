import {
  DASHBOARD_THEME_KEY,
  parseDashboardTheme,
  type DashboardTheme,
} from "@/lib/dashboard/theme";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeDashboardTheme(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getDashboardThemeSnapshot(): DashboardTheme {
  return parseDashboardTheme(window.localStorage.getItem(DASHBOARD_THEME_KEY));
}

export function getDashboardThemeServerSnapshot(): DashboardTheme {
  return "light";
}

export function setDashboardTheme(theme: DashboardTheme) {
  window.localStorage.setItem(DASHBOARD_THEME_KEY, theme);
  document.documentElement.setAttribute("data-dash-theme", theme);
  notify();
}
