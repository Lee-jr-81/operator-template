import { describe, expect, it } from "vitest";
import {
  DASHBOARD_THEME_KEY,
  parseDashboardTheme,
} from "@/lib/dashboard/theme";

describe("dashboard theme", () => {
  it("accepts light and dark, and treats anything else as light", () => {
    expect(parseDashboardTheme("light")).toBe("light");
    expect(parseDashboardTheme("dark")).toBe("dark");
    expect(parseDashboardTheme(null)).toBe("light");
    expect(parseDashboardTheme("system")).toBe("light");
    expect(parseDashboardTheme("nope")).toBe("light");
  });

  it("uses a dashboard-only storage key", () => {
    expect(DASHBOARD_THEME_KEY).toBe("operatortemplate-dashboard-theme");
  });
});
