import { configureStore } from "@reduxjs/toolkit";
import AdminAuthSlice from "./slice/AdminAuthSlice";
import ClientAuthSlice from "./slice/ClientAuthSlice";
import Page from "./slice/Page";

export const store = configureStore({
  reducer: {
    clientAuth: ClientAuthSlice,
    adminAuth: AdminAuthSlice,
    Page: Page,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
