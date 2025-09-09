"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ReactNode } from "react";

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}
export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Trigger className={`w-full text-left p-2 font-medium border-b ${className || ""}`}>
      {children}
    </AccordionPrimitive.Trigger>
  );
}

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}
export function AccordionContent({ children, className }: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content className={`p-2 ${className || ""}`}>
      {children}
    </AccordionPrimitive.Content>
  );
}
