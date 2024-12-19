"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

interface BreadcrumbLink {
  label: string;
  isLoading?: boolean;
  href: string;
}

interface BreadcrumbProps {
  links: BreadcrumbLink[];
  maxItems?: number; // Maximum number of breadcrumb items to display
}

export default function EditorBreadcrumb({
  links,
  maxItems = 4,
}: BreadcrumbProps) {
  const truncateLinks = () => {
    if (links.length <= maxItems) return links;

    const start = links.slice(0, 1); // Always show the first item
    const end = links.slice(-maxItems + 1); // Show the last (maxItems - 1) items
    return [...start, { label: "...", href: "#" }, ...end];
  };

  const truncatedLinks = truncateLinks();

  return (
    <Breadcrumb className="scroll-m-20 font-semibold tracking-tight py-5 px-2 select-none">
      <BreadcrumbList>
        <AnimatePresence mode="sync">
          {truncatedLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5"
              transition={{ duration: 0.5, type: "spring", bounce: 0.6 }}
            >
              <BreadcrumbItem>
                {index == truncatedLinks.length - 1 ? (
                  <BreadcrumbPage
                    className="text-sm font-semibold truncate"
                    style={{
                      maxWidth: "120px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.isLoading ? (
                      <Skeleton className="h-[20px] w-[75px]" />
                    ) : (
                      link.label
                    )}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    {link.href !== "#" && !link.isLoading ? (
                      <Link
                        href={link.href}
                        className="hover:underline truncate"
                        style={{
                          maxWidth: "120px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                        shallow={true}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span
                        className="truncate"
                        style={{
                          maxWidth: "120px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {link.isLoading ? (
                          <Skeleton className="h-[20px] w-[75px]" />
                        ) : (
                          link.label
                        )}
                      </span>
                    )}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < truncatedLinks.length - 1 && <BreadcrumbSeparator />}
            </motion.div>
          ))}
        </AnimatePresence>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
