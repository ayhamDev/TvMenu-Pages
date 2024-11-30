import { configureStore } from "@reduxjs/toolkit";
import AdminAuthSlice from "./slice/AdminAuthSlice";
import ClientAuthSlice from "./slice/ClientAuthSlice";
import BreadcrumpsSlice from "./slice/BreadcrumpsSlice";

export const store = configureStore({
  reducer: {
    clientAuth: ClientAuthSlice,
    adminAuth: AdminAuthSlice,
    BreadcrumpsSlice: BreadcrumpsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
