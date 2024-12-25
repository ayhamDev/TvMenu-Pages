"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";

// Define the type of the message you're expecting
export interface IMessage {
  type: "create" | "update" | "edit" | "load" | "focus" | "blur";
  target: "menu" | "category" | "item" | "theme" | "preview";
  data?: Record<string, any>;
}
// Define the context value type
interface PreviewContextType {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  sendMessage: (message: IMessage) => void;
  Message: IMessage | null;
  IsPreview: boolean;
  PreviewLoaded: boolean;
}

// Create the context with the correct type and provide a default value
const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

interface PreviewProviderProps {
  children: React.ReactNode;
}

export const PreviewProvider = ({ children }: PreviewProviderProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [Message, setPreviewMessage] = useState<IMessage | null>(null);
  const [IsPreview, SetIstPreview] = useState<boolean>(true);
  const [PreviewLoaded, SetPreviewLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (window.self === window.parent) {
      SetIstPreview(false);
    } else {
      SetIstPreview(true);
    }
  }, [iframeRef.current]);
  const sendMessage = (message: IMessage) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(message, location.origin);
    } else if (window.top) {
      window.top.postMessage(message, location.origin);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin) return; // Replace with iframe's origin
      setPreviewMessage(event.data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  useEffect(() => {
    if (Message?.type == "load" && Message.target == "preview") {
      SetPreviewLoaded(true);
    }
  }, [Message]);

  return (
    <PreviewContext.Provider
      value={{ iframeRef, sendMessage, Message, IsPreview, PreviewLoaded }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

// Custom hook to access the context
export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
};
