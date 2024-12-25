"use client";
import { usePreview } from "@/providers/PreviewProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PreviewHandler = () => {
  const { iframeRef, Message } = usePreview();
  const router = useRouter();

  useEffect(() => {
    if (Message && Message.type) {
      if (Message.type == "edit" && Message.data) {
        if (Message.target == "menu" && Message.data.menuId) {
          router.push(
            `/edit/menu/${Message.data.menuId}?field=${Message.data.field}`
          );
        }
        if (
          Message.target == "category" &&
          Message.data.menuId &&
          Message.data.categoryId
        ) {
          router.push(
            `/edit/menu/${Message.data.menuId}/category/${Message.data.categoryId}?field=${Message.data.field}`
          );
        }
        if (
          Message.target == "item" &&
          Message.data.menuId &&
          Message.data.categoryId &&
          Message.data.itemId
        ) {
          router.push(
            `/edit/menu/${Message.data.menuId}/category/${Message.data.categoryId}/item/${Message.data.itemId}?field=${Message.data.field}`
          );
        }
      }
      if (Message?.type == "create") {
        if (Message.target == "menu") {
          router.push("/edit/menu?create=true");
        }
        if (
          Message.target == "category" &&
          Message.data &&
          Message.data.menuId
        ) {
          router.push(`/edit/menu/${Message.data.menuId}/category?create=true`);
        }
        if (
          Message.target == "item" &&
          Message.data &&
          Message.data.menuId &&
          Message.data.categoryId
        ) {
          router.push(
            `/edit/menu/${Message.data.menuId}/category/${Message.data.categoryId}/item?create=true`
          );
        }
      }
    }
  }, [Message]);
  return null;
};

export default PreviewHandler;
