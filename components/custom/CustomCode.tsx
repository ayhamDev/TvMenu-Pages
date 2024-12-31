import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { html, TagSpec } from "@codemirror/lang-html";
import { andromeda } from "@uiw/codemirror-theme-andromeda";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Code, Loader2 } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "../ui/button";
import { CardDescription } from "../ui/card";
import { DialogHeader } from "../ui/dialog";

const extraTags: Record<string, TagSpec> = {
  "widget-call": {
    globalAttrs: false,
    attrs: { "data-tel": null, "data-icon-color": null, "data-bg-color": null },
  }, // Example custom tag
  "widget-whatsapp": {
    globalAttrs: false,
    attrs: {
      "data-tel": null,
      "data-icon-color": null,
      "data-bg-color": null,
      "data-message": null,
    },
  }, // Example custom tag
};
const CustomCode = ({
  field,
  isLoading,
}: {
  field: ControllerRenderProps<any, "customCode">;
  isLoading: boolean;
}) => {
  return (
    <>
      <Dialog>
        {/** Prevent opening dialog if isLoading is true */}
        <DialogTrigger asChild>
          <Button
            type="button"
            className="w-full"
            variant={"secondary"}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Loading Code...
              </>
            ) : (
              <>
                <Code /> Edit Code
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Code Editor</DialogTitle>
            <DialogDescription>
              Embed custom HTML, CSS, and JavaScript to add widgets and
              personalize your page.
            </DialogDescription>
          </DialogHeader>
          <ReactCodeMirror
            style={{
              borderRadius: "20px",
            }}
            className="min-w-0"
            height="250px"
            theme={andromeda}
            extensions={[
              html({
                autoCloseTags: true,
                selfClosingTags: true,
                extraTags: extraTags,
              }),
            ]}
            {...field}
          />
        </DialogContent>
      </Dialog>

      <CardDescription>
        Embed custom HTML, CSS, and JavaScript to add widgets and personalize
        your page.
      </CardDescription>
    </>
  );
};

export default CustomCode;
