import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

import userSlice from "./userSlice";
import courseSlice from "./courseSlice";
import lectureSlice from "./lectureSlice";
import reviewSlice from "./reviewSlice";
import moduleSlice from "./moduleSlice";
import dashboardSlice from "./dashboardSlice"; // ✅ Add kiya
import commentSlice from "./commentSlice";
import adminSlice from "./adminSlice"
// Combine Reducers
const rootReducer = combineReducers({
  user: userSlice,
  course: courseSlice,
  lecture: lectureSlice,
  module: moduleSlice,
  review: reviewSlice,
  dashboard: dashboardSlice, 
  comment: commentSlice,
  admin: adminSlice,
});

// Persist Config
const persistConfig = {
  key: "root",
  storage: storage,
};

// Persisted Reducer
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// 1. Store = Pure Global State Container
export const store = configureStore({  
  reducer: persistedReducer,   //Yahi main database hai frontend ka.

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


// Persistor
export const persistor = persistStore(store);


/*Store Contains
user state
course state
lecture state
module state
review state
dashboard state
Final Redux State Structure
{
  user:{},
  course:{},
  lecture:{},
  module:{},
  review:{},
  dashboard:{}
} */