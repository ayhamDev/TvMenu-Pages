"use client";

import { LeavingDialog } from "@/components/custom/LeavingDialog";
import { AnchorIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type PreventNavigationProps = {
  isDirty: boolean;
  backHref: string;
};

export const PreventNavigation = ({
  isDirty,
  backHref,
}: PreventNavigationProps) => {
  const [leavingPage, setLeavingPage] = useState(false);
  const router = useRouter();

  /**
   * Function that will be called when the user selects `yes` in the confirmation modal,
   * redirected to the selected page.
   */
  const confirmationFn = useRef<() => void>(() => {});

  // Push a dummy state to ensure popstate is triggered for back navigation
  if (typeof window !== "undefined") {
    window.history.pushState(null, document.title, window.location.href);
  }

  useEffect(() => {
    /**
     * Used to prevent navigation when clicking on navigation `<Link />` or `<a />`.
     * @param event The triggered event.
     */
    const handleClick = (event: MouseEvent) => {
      let target = event.target as HTMLElement;

      // Traverse up to find the nearest <a> element
      while (target && target.tagName !== "A") {
        target = target.parentElement as HTMLElement;
      }

      const anchor = target as HTMLAnchorElement;

      if (anchor && anchor.href && isDirty) {
        event.preventDefault();

        confirmationFn.current = () => {
          router.push(anchor.href);
        };

        setLeavingPage(true);
      }
    };

    /**
     * Used to prevent navigation when using the browser's back button.
     */
    const handlePopState = () => {
      if (isDirty) {
        setLeavingPage(true);

        confirmationFn.current = () => {
          console.log(true);
        };
      } else {
        // Allow the browser to handle the back navigation
        window.history.go(-1);
      }
    };

    /**
     * Used to prevent navigation when reloading the page or navigating to another page.
     * @param event The triggered event.
     */
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = true;
      }
    };

    // Attach listeners
    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup listeners
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, backHref, router]);

  return (
    <>
      <LeavingDialog
        isOpen={leavingPage}
        noCallback={() => {
          setLeavingPage(false);
          confirmationFn.current = () => {};
        }}
        yesCallback={() => {
          if (confirmationFn.current) {
            confirmationFn.current();
            confirmationFn.current = () => {}; // Reset after execution
          }
          setLeavingPage(false);
        }}
      />
    </>
  );
};
