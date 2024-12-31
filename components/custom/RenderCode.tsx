"use client";
import { useEffect } from "react";

const RenderCode = ({ content }: { content: string | null }) => {
  // Use useEffect to execute any scripts after the component is mounted
  useEffect(() => {
    // If content is provided and script tags are included
    if (content) {
      // Extract all <script> tags from the sanitized content
      const scripts = Array.from(
        new DOMParser()
          .parseFromString(content, "text/html")
          .querySelectorAll("script")
      );

      // Execute each script manually
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.text = script.textContent || "";
        if (script.src) {
          newScript.src = script.src;
          newScript.async = true; // Ensure async scripts load asynchronously
        }
        document.body.appendChild(newScript); // Append the script to body or head
      });
    }
  }, [content]); // Run on content or purifiedCode change

  // Render the sanitized HTML content
  if (!content) return null;

  if (content) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return null; // Return nothing if there's no content
};

export default RenderCode;
