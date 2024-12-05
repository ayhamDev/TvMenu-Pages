import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface IChangesHandlerProps {
  SetShowChangeActions?: React.Dispatch<React.SetStateAction<boolean>>;
  ShowChangeActions: boolean;
  IsSaving: boolean;
  onCancel: () => void;
}

const ChangesHandler = ({
  ShowChangeActions,
  IsSaving,
  onCancel,
}: IChangesHandlerProps) => {
  return (
    <AnimatePresence mode="sync">
      <motion.div
        initial={{ y: 80, opacity: 0.5 }}
        animate={ShowChangeActions ? "visable" : "hidden"}
        transition={{ duration: 0.2, ease: "circInOut" }}
        className="w-full px-4 py-4 bg-background border-t-2 flex gap-4 absolute bottom-0"
        variants={{
          hidden: {
            y: 80,
            opacity: 0.5,
          },
          visable: {
            y: 0,
            opacity: 1,
          },
        }}
      >
        <Button
          tabIndex={!ShowChangeActions ? -1 : undefined}
          type="button"
          onClick={onCancel}
          className="w-full"
          variant={"secondary"}
          disabled={IsSaving}
        >
          Cancel
        </Button>
        <Button
          tabIndex={!ShowChangeActions ? -1 : undefined}
          className="w-full"
          type="submit"
          disabled={IsSaving}
        >
          {IsSaving && <Loader2 className="animate-spin" />}
          {IsSaving ? "Saving..." : "Save"}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangesHandler;
