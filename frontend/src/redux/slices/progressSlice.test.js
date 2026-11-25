import { describe, it, expect } from "vitest";
import progressReducer, { clearAllProgress, setCertificateGenerated } from "./progressSlice.js";

describe("📈 Frontend Phase F2: progressSlice Redux Tests", () => {
  it("should reset course progress on clearAllProgress (logout / switch account)", () => {
    const populatedState = {
      courseProgress: { course_abc: { progressPercent: 100 } },
      resumeLecture: { _id: "lec1" },
      certificateGenerated: { course_abc: true },
      loading: false,
      error: null,
    };

    const nextState = progressReducer(populatedState, clearAllProgress());
    expect(nextState.courseProgress).toEqual({});
    expect(nextState.resumeLecture).toBeNull();
    expect(nextState.certificateGenerated).toEqual({});
  });

  it("should mark certificate as generated for a specific course", () => {
    const initialState = {
      courseProgress: {},
      resumeLecture: null,
      certificateGenerated: {},
      loading: false,
      error: null,
    };

    const nextState = progressReducer(
      initialState,
      setCertificateGenerated({ courseId: "course_101" })
    );

    expect(nextState.certificateGenerated["course_101"]).toBe(true);
  });
});
