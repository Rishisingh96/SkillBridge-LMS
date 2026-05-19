// import {configureStore} from "@reduxjs/toolkit"
// import userSlice from "./userSlice"
// import courseSlice from "./courseSlice"
// import lectureSlice from "./lectureSlice"

// export const store = configureStore({
//     reducer:{
//         user:userSlice,
//         course:courseSlice,
//         lecture:lectureSlice
//     }
// })


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

// Combine Reducers
const rootReducer = combineReducers({
  user: userSlice,
  course: courseSlice,
  lecture: lectureSlice,
  review: reviewSlice,
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

// Store
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);