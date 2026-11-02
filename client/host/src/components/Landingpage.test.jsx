import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Landingpage from "./Landingpage";

// Displays the current URL so we can verify navigation.
const LocationDisplay = () => {
  const location = useLocation();

  return (
    <div data-testid="current-location">
      {location.pathname + location.search}
    </div>
  );
};

const renderLandingpage = () => {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="*" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Landingpage", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the landing page and email input", () => {
    renderLandingpage();

    expect(
      screen.getByRole("heading", {
        name: /GearUp fashion Lifestyle with GenZTrends/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Let's Go" })
    ).toBeInTheDocument();
  });

  test("shows an alert when the email is invalid", () => {
    const alertMock = jest
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    renderLandingpage();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Let's Go" }));

    expect(alertMock).toHaveBeenCalledWith(
      "Please enter a valid email address."
    );
  });

  test("navigates to register when the email is valid", () => {
    renderLandingpage();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "akhil@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Let's Go" }));

    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/register?email=akhil%40example.com"
    );
  });
});