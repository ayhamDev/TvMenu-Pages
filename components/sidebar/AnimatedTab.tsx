import React from "react";
import { motion } from "framer-motion";

const AnimatedTab = (Component: React.ComponentType) => {
  return () => (
    <motion.div
      initial={{ opacity: 0.1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.1, y: 20 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col overflow-hidden relative"
    >
      <Component />
    </motion.div>
  );
};

export default AnimatedTab;
