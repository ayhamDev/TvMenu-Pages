import { useDispatch, useSelector } from "react-redux";
import {
  BreadcrumbLink,
  resetBreadcrumbs,
  setBreadcrumbs,
} from "@/store/slice/BreadcrumpsSlice";
import { RootState } from "@/store/Store";
import { useLayoutEffect } from "react";

const useBreadcrumbs = (InitLink?: BreadcrumbLink[]) => {
  const dispatch = useDispatch();

  // Select the current breadcrumbs from the Redux state
  const breadcrumbs = useSelector(
    (state: RootState) => state.BreadcrumpsSlice.links
  );

  // Function to set new breadcrumbs
  const updateBreadcrumbs = (links: BreadcrumbLink[]) => {
    dispatch(setBreadcrumbs(links));
  };

  // Function to reset breadcrumbs
  const clearBreadcrumbs = () => {
    dispatch(resetBreadcrumbs());
  };
  useLayoutEffect(() => {
    if (InitLink) {
      updateBreadcrumbs([...InitLink]);
    }
  }, []);

  return {
    breadcrumbs,
    updateBreadcrumbs,
    clearBreadcrumbs,
  };
};

export default useBreadcrumbs;
