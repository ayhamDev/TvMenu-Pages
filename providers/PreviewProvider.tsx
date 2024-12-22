"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

// Define the type of the message you're expecting
export interface IMessage {
  type: "update";
  target: "menu" | "category" | "item" | "theme";
  id?: string | null;
  data?: unknown;
}
// Define the context value type
interface PreviewContextType {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  sendMessageToPreview: (message: IMessage) => void;
  iframeMessage: IMessage | null;
}

// Create the context with the correct type and provide a default value
const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

interface PreviewProviderProps {
  children: React.ReactNode;
}

export const PreviewProvider = ({ children }: PreviewProviderProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeMessage, setPreviewMessage] = useState<IMessage | null>(null);

  const sendMessageToPreview = (message: IMessage) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(message, "*");
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

  return (
    <PreviewContext.Provider
      value={{ iframeRef, sendMessageToPreview, iframeMessage }}
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
