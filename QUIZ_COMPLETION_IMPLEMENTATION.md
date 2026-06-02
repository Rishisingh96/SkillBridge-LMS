# Quiz Completion Feature Implementation

This document provides a complete step-by-step implementation guide for the quiz completion feature that ensures users must complete both lecture video AND quiz (if present) before unlocking the next lecture.

---

## Overview

The quiz completion feature adds the following functionality:
- Track quiz completion status per lecture
- Lock next lecture until both video AND quiz are completed
- Display quiz completion status in the module list
- Auto-jump to next lecture only when both are completed
- "Unlock Next Video" button in quiz result section

---

## Backend Implementation

### Step 1: Add `isQuizCompleted` Field to Lecture Model

**File:** `backend/models/lectureModel.js`

Add the `isQuizCompleted` field after `isLectureCompleted`:

```javascript
isLectureCompleted: {
  type: Boolean,
  default: false,
},

isQuizCompleted: {
  type: Boolean,
  default: false,
},
```

**Explanation:** This field tracks whether a user has completed the quiz for a specific lecture. Default is `false`.

---

### Step 2: Create API Endpoint to Mark Quiz as Completed

**File:** `backend/controller/lectureController.js`

Add the `markQuizCompleted` function after `markLectureCompleted`:

```javascript
// Mark quiz as completed
export const markQuizCompleted = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    lecture.isQuizCompleted = true;
    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Quiz marked as completed",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Mark quiz completed error: ${error.message}`,
    });
  }
};
```

**Explanation:** This API endpoint sets `isQuizCompleted = true` for a lecture when called.

---

### Step 3: Add Route for Quiz Completion API

**File:** `backend/routes/courseRoute.js`

1. Import the new function:

```javascript
import { createLecture, editLecture, getCourseLectures, removeLecture, removeLectureVideo, markLectureCompleted, markQuizCompleted } from "../controller/lectureController.js";
```

2. Add the route after `mark-lecture-completed`:

```javascript
courseRoute.put("/mark-lecture-completed/:lectureId", isAuth, markLectureCompleted);
courseRoute.put("/mark-quiz-completed/:lectureId", isAuth, markQuizCompleted);
```

**Explanation:** This creates the API endpoint `PUT /api/course/mark-quiz-completed/:lectureId` that can be called from the frontend.

---

## Frontend Implementation

### Step 4: Update Module List Locking Logic

**File:** `frontend/src/components/lecture/ModuleList.jsx`

Update the lecture mapping to check both lecture and quiz completion before unlocking next lecture:

```javascript
{module.lectures?.map(
  (lecture, lectureIndex) => {

    const isActive =
      selectedLecture?._id ===
      lecture?._id;

    // Check if previous lecture is fully completed (both lecture AND quiz)
    const previousLecture = lectureIndex > 0 
      ? module.lectures[lectureIndex - 1] 
      : null;
    
    const isPreviousFullyCompleted = previousLecture
      ? (previousLecture.isLectureCompleted === true && 
         (previousLecture.quizQuestions?.length === 0 || previousLecture.isQuizCompleted === true))
      : true; // First lecture is always unlocked if enrolled

    const isLocked =
      (!isEnrolled && !lecture.isPreviewFree) || 
      (isEnrolled && lectureIndex > 0 && !isPreviousFullyCompleted);

    const isCompleted =
      lectureProgress[lecture._id]?.completed || lecture.isLectureCompleted === true;
    
    const isQuizCompleted = lecture.isQuizCompleted === true;
```

**Explanation:** 
- Checks if the previous lecture is fully completed (both video AND quiz)
- If quiz doesn't exist for previous lecture, only checks video completion
- Locks current lecture if previous is not fully completed

---

### Step 5: Update Module List UI to Show Quiz Completion Status

**File:** `frontend/src/components/lecture/ModuleList.jsx`

Update the badge section to show quiz completion status:

```javascript
{/* BADGE */}
<div
  className={`
    px-3
    py-1.5
    rounded-full
    text-xs
    font-semibold
    shrink-0
    ${
      isLocked
        ? "bg-gray-200 text-gray-600"
        : isCompleted && isQuizCompleted
        ? "bg-green-100 text-green-700"
        : isCompleted
        ? "bg-blue-100 text-blue-700"
        : isActive
        ? "bg-white text-black"
        : "bg-violet-100 text-violet-700"
    }
  `}
>

  {isLocked
    ? "Locked"
    : isCompleted && isQuizCompleted
    ? "Done"
    : isCompleted
    ? "Video Done"
    : "Watch"}

</div>
```

**Explanation:**
- "Locked" - if not enrolled or previous lecture not fully completed
- "Done" (green) - if both lecture AND quiz completed
- "Video Done" (blue) - if only lecture video completed
- "Watch" - if not started

---

### Step 6: Update Auto-Jump Logic

**File:** `frontend/src/pages/student/Student/ViewLecture.jsx`

Update `handleLectureComplete` to check both lecture and quiz completion:

```javascript
// Auto-switch to next lecture when current lecture completes
const handleLectureComplete = async () => {
  if (!moduleData || !selectedLecture) return;

  // Refetch modules to get updated isLectureCompleted and isQuizCompleted status
  await fetchModules();

  // Refetch course progress to update progress stats
  await fetchCourseProgress();

  // Find current lecture position
  let currentModuleIndex = -1;
  let currentLectureIndex = -1;

  for (let i = 0; i < moduleData.length; i++) {
    const lectureIndex = moduleData[i].lectures?.findIndex(
      (l) => l._id === selectedLecture._id
    );
    if (lectureIndex !== -1) {
      currentModuleIndex = i;
      currentLectureIndex = lectureIndex;
      break;
    }
  }

  // Check if current lecture is fully completed (both lecture AND quiz)
  const currentLecture = moduleData[currentModuleIndex]?.lectures?.[currentLectureIndex];
  const isFullyCompleted = currentLecture?.isLectureCompleted === true && 
                         (currentLecture?.quizQuestions?.length === 0 || currentLecture?.isQuizCompleted === true);

  // Only jump to next lecture if current lecture is fully completed
  if (!isFullyCompleted) {
    console.log("Current lecture not fully completed (lecture + quiz), not jumping to next");
    return;
  }

  // Try to get next lecture in same module
  if (currentModuleIndex !== -1 && currentLectureIndex !== -1) {
    const nextLectureInModule = moduleData[currentModuleIndex].lectures?.[currentLectureIndex + 1];
    if (nextLectureInModule) {
      setSelectedLecture(nextLectureInModule);
      return;
    }

    // Try to get first lecture of next module
    const nextModule = moduleData[currentModuleIndex + 1];
    if (nextModule && nextModule.lectures?.[0]) {
      setSelectedLecture(nextModule.lectures[0]);
    }
  }
};
```

**Explanation:** Video player only auto-jumps to next lecture when both video AND quiz are completed (or if no quiz exists).

---

### Step 7: Add Quiz Completion Handler

**File:** `frontend/src/pages/student/Student/ViewLecture.jsx`

Add `handleQuizComplete` function after `handleLectureComplete`:

```javascript
// Handle quiz completion - refresh modules and try to jump to next lecture
const handleQuizComplete = async () => {
  // Refetch modules to get updated isQuizCompleted status
  await fetchModules();

  // Refetch course progress to update progress stats
  await fetchCourseProgress();

  // Find current lecture position
  let currentModuleIndex = -1;
  let currentLectureIndex = -1;

  for (let i = 0; i < moduleData.length; i++) {
    const lectureIndex = moduleData[i].lectures?.findIndex(
      (l) => l._id === selectedLecture._id
    );
    if (lectureIndex !== -1) {
      currentModuleIndex = i;
      currentLectureIndex = lectureIndex;
      break;
    }
  }

  // Check if current lecture is fully completed (both lecture AND quiz)
  const currentLecture = moduleData[currentModuleIndex]?.lectures?.[currentLectureIndex];
  const isFullyCompleted = currentLecture?.isLectureCompleted === true && 
                         (currentLecture?.quizQuestions?.length === 0 || currentLecture?.isQuizCompleted === true);

  // Only jump to next lecture if current lecture is fully completed
  if (!isFullyCompleted) {
    console.log("Current lecture not fully completed (lecture + quiz), not jumping to next");
    return;
  }

  // Try to get next lecture in same module
  if (currentModuleIndex !== -1 && currentLectureIndex !== -1) {
    const nextLectureInModule = moduleData[currentModuleIndex].lectures?.[currentLectureIndex + 1];
    if (nextLectureInModule) {
      setSelectedLecture(nextLectureInModule);
      return;
    }

    // Try to get first lecture of next module
    const nextModule = moduleData[currentModuleIndex + 1];
    if (nextModule && nextModule.lectures?.[0]) {
      setSelectedLecture(nextModule.lectures[0]);
    }
  }
};
```

**Explanation:** This function is called when quiz is completed to refresh modules and auto-jump if both video and quiz are done.

---

### Step 8: Pass Quiz Handler to Lecture Player

**File:** `frontend/src/pages/student/Student/ViewLecture.jsx`

Update the LecturePlayer component call:

```javascript
{/* LEFT — Video Player */}
<LecturePlayer lecture={selectedLecture} onLectureComplete={handleLectureComplete} onQuizComplete={handleQuizComplete} />
```

**Explanation:** Pass the quiz completion handler to LecturePlayer component.

---

### Step 9: Update Lecture Player to Accept Quiz Handler

**File:** `frontend/src/components/lecture/LecturePlayer.jsx`

1. Add the prop:

```javascript
const LecturePlayer = ({
  lecture,
  onLectureComplete,
  onQuizComplete,
}) => {
```

2. Pass it to QuizResult:

```javascript
{activeTab === "quiz" && (
  <QuizResult lectureId={lecture} onQuizComplete={onQuizComplete} />
)}
```

**Explanation:** LecturePlayer now accepts and passes the quiz completion handler to QuizResult.

---

### Step 10: Add Unlock Button in Quiz Result

**File:** `frontend/src/components/lecture/QuizResult.jsx`

1. Add imports:

```javascript
import {
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaArrowLeft,
  FaRedo,
  FaLockOpen,
} from "react-icons/fa";

import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
```

2. Add prop:

```javascript
const QuizResult = ({ lectureId, onQuizComplete }) => {
```

3. Add handler function:

```javascript
// =========================================================
// UNLOCK NEXT VIDEO
// =========================================================

const handleUnlockNextVideo = async () => {
  if (!lectureId?._id) return;

  try {
    const response = await axios.put(
      `${serverUrl}/api/course/mark-quiz-completed/${lectureId._id}`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      toast.success("Quiz completed! Next video unlocked.");
      
      // Call parent callback to refresh modules
      if (onQuizComplete) {
        onQuizComplete();
      }
    }
  } catch (error) {
    console.error("Error marking quiz as completed:", error);
    toast.error(error.response?.data?.message || "Failed to unlock next video");
  }
};
```

4. Add button in result section (after Retry Quiz button):

```javascript
{/* RETRY */}
<button
  onClick={handleRetry}
  className={`
    mt-7
    inline-flex
    items-center
    gap-2
    px-6
    py-3
    rounded-2xl
    ${isDark ? 'bg-white text-black' : 'bg-black text-white'}
    font-semibold
    hover:scale-105
    transition-all
  `}
>

  <FaRedo />

  Retry Quiz

</button>

{/* UNLOCK NEXT VIDEO */}
<button
  onClick={handleUnlockNextVideo}
  className={`
    mt-4
    inline-flex
    items-center
    gap-2
    px-6
    py-3
    rounded-2xl
    bg-gradient-to-r
    from-green-500
    to-emerald-600
    text-white
    font-semibold
    hover:scale-105
    transition-all
    shadow-xl
  `}
>

  <FaLockOpen />

  Unlock Next Video

</button>
```

**Explanation:** 
- User completes quiz and sees result
- Clicks "Unlock Next Video" button
- API marks `isQuizCompleted = true`
- Modules refresh to unlock next lecture
- Auto-jumps if both video and quiz completed

---

## Complete Flow

1. **User watches lecture video** → Video ends → `isLectureCompleted = true`
2. **User takes quiz** → Completes all questions → Sees result
3. **User clicks "Unlock Next Video"** → API call → `isQuizCompleted = true`
4. **Module data refreshes** → Next lecture unlocks (if both completed)
5. **Auto-jump to next lecture** (if both video and quiz completed)

---

## API Endpoints

### Mark Lecture as Completed
```
PUT /api/course/mark-lecture-completed/:lectureId
```

### Mark Quiz as Completed
```
PUT /api/course/mark-quiz-completed/:lectureId
```

---

## Database Schema Changes

### Lecture Model
```javascript
{
  isLectureCompleted: Boolean (default: false),
  isQuizCompleted: Boolean (default: false)
}
```

---

## UI States

| State | Badge Color | Badge Text |
|-------|-------------|------------|
| Locked | Gray | "Locked" |
| Video Only Completed | Blue | "Video Done" |
| Both Completed | Green | "Done" |
| Not Started | Violet | "Watch" |

---

## Notes

- If a lecture has no quiz questions, only video completion is required
- First lecture is always unlocked if user is enrolled
- Lectures remain locked until previous lecture is fully completed
- Auto-jump only happens when both video and quiz are completed
