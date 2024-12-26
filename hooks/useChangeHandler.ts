import { useNavigationGuard } from "@/lib/next-navigation-guard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const msg = "are you sure you want to leave before saving ?";
const useChangeHandler = () => {
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [IsSaving, SetIsSaving] = useState<boolean>(false);
  const NavGuard = useNavigationGuard({ enabled: ShowChangeActions });
  // const PreventPageUnloadBeforeSave = (event: BeforeUnloadEvent) => {
  //   if (IsSaving || ShowChangeActions) {
  //     event.preventDefault();
  //     return (event.returnValue = msg);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("beforeunload", PreventPageUnloadBeforeSave);
  //   return () => {
  //     setTimeout(() => {
  //       window.removeEventListener("beforeunload", PreventPageUnloadBeforeSave);
  //     }, 100);
  //   };
  // }, [ShowChangeActions, IsSaving]);

  return {
    ShowChangeActions,
    SetShowChangeActions,
    IsSaving,
    SetIsSaving,
    NavGuard,
  };
};

export default useChangeHandler;
