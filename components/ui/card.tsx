import { cn } from "@/lib/utils"; // if you're using a utility for merging classes
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-lg shadow-md p-4 bg-white dark:bg-gray-800 ${className ?? ''}`}>
      {children}
    </div>
  );
}
