import { describe, it, expect } from "vitest";
import userReducer, { setUserData, clearUserData } from "./userSlice.js";

describe("🧑‍💻 Frontend Phase F2: userSlice Redux Tests", () => {
  const initialState = {
    userData: null,
    loading: false,
    error: null,
    fetched: false,
    initialLoading: true,
  };

  it("should return the initial state by default", () => {
    const state = userReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state.userData).toBeNull();
    expect(state.loading).toBe(false);
  });

  it("should handle setUserData and store student user profile", () => {
    const dummyUser = {
      _id: "user123",
      name: "Rishi",
      email: "rishi@example.com",
      role: "student",
    };

    const nextState = userReducer(initialState, setUserData(dummyUser));
    expect(nextState.userData).toEqual(dummyUser);
    expect(nextState.userData.role).toBe("student");
  });

  it("should handle clearUserData on logout to prevent state leakage", () => {
    const loggedInState = {
      userData: { _id: "user123", name: "Rishi", role: "admin" },
      loading: false,
      error: null,
      fetched: true,
      initialLoading: false,
    };

    const nextState = userReducer(loggedInState, clearUserData());
    expect(nextState.userData).toBeNull();
  });
});
