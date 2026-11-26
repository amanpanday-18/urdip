import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Index } from "@/routes/index";

// The credits screen must always show the supervisor and every registered team member.
describe("Home credits screen", () => {
  it("lists the supervisor and all six team members with their registration numbers", () => {
    render(<Index />);

    expect(screen.getByText("Dr. Velmurugan")).toBeInTheDocument();

    for (const reg of [
      "24BEY10038",
      "24MIP10143",
      "24BCE10080",
      "24BEY10178",
      "24BCE11394",
      "24MIM10067",
    ]) {
      expect(screen.getByText(reg)).toBeInTheDocument();
    }

    for (const name of [
      "Aman Panday",
      "Somya Tiwari",
      "Pranav Kumar",
      "Himesh Jham",
      "Aarshi Jaiswal",
      "Suhana Bisht",
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });
});
