"use client";
import { motion } from "framer-motion";
import React from "react";

const AnimatePage = ({ children }: React.PropsWithChildren) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatePage;
