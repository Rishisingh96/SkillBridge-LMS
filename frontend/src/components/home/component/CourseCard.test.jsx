import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CourseCard from "./CourseCard.jsx";

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("🎨 Frontend Phase F3: CourseCard Component UI Tests", () => {
  it("should render course title, category, and Free badge when price is 0", () => {
    render(
      <MemoryRouter>
        <CourseCard
          id="course_1"
          title="Git & GitHub Basics"
          category="Development"
          price={0}
          reviews={[]}
        />
      </MemoryRouter>
    );

    // Title appears (both copies in marquee)
    const titles = screen.getAllByText("Git & GitHub Basics");
    expect(titles.length).toBeGreaterThanOrEqual(1);

    // Category badge
    expect(screen.getByText("Development")).toBeInTheDocument();

    // Price badge for free course
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("should render formatted price ₹1499 when course is paid", () => {
    render(
      <MemoryRouter>
        <CourseCard
          id="course_2"
          title="Complete React Course"
          category="Frontend"
          price={1499}
          reviews={[{ rating: 5 }, { rating: 4 }]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("₹1499")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument(); // (5+4)/2 = 4.5 avg
  });

  it("should navigate to /course/:id when student clicks on card", () => {
    render(
      <MemoryRouter>
        <CourseCard
          id="course_99"
          title="Node.js Bootcamp"
          category="Backend"
          price={499}
          reviews={[]}
        />
      </MemoryRouter>
    );

    const card = screen.getByRole("article", { name: /View course: Node.js Bootcamp/i });
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/course/course_99");
  });
});
