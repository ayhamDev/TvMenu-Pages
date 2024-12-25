import { IMessage, usePreview } from "@/providers/PreviewProvider";
import { Image } from "lucide-react";
import { ReactNode } from "react";

interface EditableImageProps {
  children: ReactNode;
  edit: IMessage;
}

const EditableImage = ({ children, edit }: EditableImageProps) => {
  const { IsPreview, sendMessage } = usePreview();
  return (
    <div className="relative group w-full">
      {children}
      {IsPreview && (
        <div
          className="hover:opacity-100 opacity-0  hover:opac bg-muted bg-opacity-50 cursor-pointer transition-all duration-100  absolute w-full h-full inset-0 grid place-items-center z-[2] border-4 border-primary/25 border-dashed rounded-md"
          onClick={() => {
            if (!IsPreview) return null;
            sendMessage({ ...edit });
          }}
        >
          <div className="bg-primary p-2 rounded-full">
            <Image className="stroke-primary-foreground" size={"20px"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
