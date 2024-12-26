import { cn } from "@/lib/utils";
import { IMessage, usePreview } from "@/providers/PreviewProvider";
import { Edit2 } from "lucide-react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
interface EditableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: string;
  edit: IMessage;
}
const EditableText = ({
  children,
  size = "24px",
  edit,
  className,
  ...props
}: EditableTextProps) => {
  const { IsPreview, Message, sendMessage } = usePreview();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [FoucsedField, SetFoucsedField] = useState<
    "title" | "caption" | "image" | "price" | null
  >(null);
  useEffect(() => {
    if (Message?.type == "blur") {
      SetFoucsedField(null);
    }
    if (
      Message?.target == edit.target &&
      Message.type == "focus" &&
      Message?.data &&
      edit?.data &&
      Message?.data?.field == edit?.data?.field &&
      Message?.data?.id == edit?.data?.id
    ) {
      SetFoucsedField(Message.data.field);
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [Message]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group flex items-center gap-3",
        FoucsedField && "cursor-default",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          FoucsedField &&
            "outline-[3.1px] outline-foreground outline-dashed rounded px-2"
        )}
      >
        {children}
      </div>

      {!FoucsedField && IsPreview && (
        <Edit2
          className="group-hover:opacity-100 opacity-0 transition-all duration-100 cursor-pointer"
          onClick={() => {
            if (!IsPreview) return null;

            sendMessage({ ...edit });
          }}
          size={size}
        />
      )}
    </div>
  );
};

export default EditableText;
