"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  backdropClassName,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  color = "#2FB7A3",
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    backdropClassName?: string;
    duration?: number;
    clockwise?: boolean;
    color?: string;
  } & React.HTMLAttributes<HTMLElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      type?: string;
      disabled?: boolean;
    }
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP:    `radial-gradient(20.7% 50% at 50% 0%, ${color} 0%, transparent 100%)`,
    LEFT:   `radial-gradient(16.6% 43.1% at 0% 50%, ${color} 0%, transparent 100%)`,
    BOTTOM: `radial-gradient(20.7% 50% at 50% 100%, ${color} 0%, transparent 100%)`,
    RIGHT:  `radial-gradient(16.2% 41.2% at 100% 50%, ${color} 0%, transparent 100%)`,
  };

  const highlight = `radial-gradient(75% 181% at 50% 50%, ${color} 0%, transparent 100%)`;

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center items-center h-min justify-center overflow-hidden p-px w-fit transition duration-300",
        containerClassName
      )}
      {...props}
    >
      <div className={cn("w-auto z-10 rounded-[inherit]", className)}>
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{ filter: "blur(2px)", position: "absolute", width: "100%", height: "100%" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div
        className={cn(
          "absolute z-[1] flex-none inset-[2px] rounded-[inherit]",
          backdropClassName ?? "bg-[#071210]"
        )}
      />
    </Tag>
  );
}
