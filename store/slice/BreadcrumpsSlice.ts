import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the BreadcrumbLink type
export interface BreadcrumbLink {
  label: string;
  href: string;
}

// Define the state interface
export interface BreadcrumpsSliceState {
  links: BreadcrumbLink[]; // Array of breadcrumb links
}

// Initial state
const initialState: BreadcrumpsSliceState = {
  links: [], // Start with an empty array of breadcrumb links
};

export const BreadcrumpsSlice = createSlice({
  name: "breadcrumps",
  initialState,
  reducers: {
    // Add breadcrumbs to the state
    setBreadcrumbs(state, action: PayloadAction<BreadcrumbLink[]>) {
      state.links = action.payload;
    },
    // Reset breadcrumbs to an empty array
    resetBreadcrumbs(state) {
      state.links = [];
    },
  },
});

// Export actions
export const { setBreadcrumbs, resetBreadcrumbs } = BreadcrumpsSlice.actions;

// Export the reducer
export default BreadcrumpsSlice.reducer;
