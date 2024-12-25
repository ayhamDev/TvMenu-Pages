import { IMessage, usePreview } from "@/providers/PreviewProvider";
import React, { ReactNode, useEffect, useRef } from "react";

const ScrollHandler = ({
  children,
  scrollBehavior = "center",
  edit,
}: {
  children: ReactNode;
  scrollBehavior?: ScrollLogicalPosition;
  edit: IMessage;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { Message } = usePreview();
  useEffect(() => {
    if (
      Message &&
      Message.type == "edit" &&
      Message.target == edit.target &&
      Message.data?.id == edit.data?.id
    ) {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: scrollBehavior,
      });
    }
  }, [Message]);
  return <div ref={containerRef}>{children}</div>;
};

export default ScrollHandler;
