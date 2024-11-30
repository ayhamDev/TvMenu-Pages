import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Button } from "../ui/button";

interface IChangesHandlerProps {
  SetShowChangeActions: React.Dispatch<React.SetStateAction<boolean>>;
  ShowChangeActions: boolean;
}

const ChangesHandler = ({ ShowChangeActions }: IChangesHandlerProps) => {
  return (
    <AnimatePresence mode="sync">
      <motion.div
        initial={{ y: 80, opacity: 0.5 }}
        animate={ShowChangeActions ? "visable" : "hidden"}
        transition={{ duration: 0.2, ease: "circInOut" }}
        className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4"
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
      ></motion.div>
    </AnimatePresence>
  );
};

export default ChangesHandler;
