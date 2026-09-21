export const DASHBOARD_THEME_KEY = "operatortemplate-dashboard-theme";

export const DASHBOARD_THEMES = ["light", "dark"] as const;

export type DashboardTheme = (typeof DASHBOARD_THEMES)[number];

export function isDashboardTheme(value: string | null): value is DashboardTheme {
  return DASHBOARD_THEMES.includes(value as DashboardTheme);
}

export function parseDashboardTheme(value: string | null): DashboardTheme {
  return isDashboardTheme(value) ? value : "light";
}

export const DASHBOARD_THEME_SCRIPT = `(function(){try{var k=${JSON.stringify(DASHBOARD_THEME_KEY)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark")t="light";document.documentElement.setAttribute("data-dash-theme",t);}catch(e){document.documentElement.setAttribute("data-dash-theme","light");}})();`;
