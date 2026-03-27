"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  isValidElement,
} from "react";
import type { DesktopIconConfig, DesktopIconRef } from "@/types";

export interface DesktopIconProps {
  config: DesktopIconConfig;
  onClick: () => void;
  className?: string;
  isMobile?: boolean;
}

export const DesktopIcon = forwardRef<DesktopIconRef, DesktopIconProps>(
  function DesktopIcon({ config, onClick, className = "", isMobile = false }, ref) {
    const { icon, label, initialX = 0, initialY = 0 } = config;

    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);

    const dragRef = useRef({
      startX: 0,
      startY: 0,
      hasMoved: false,
    });
    const iconRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getPosition: () => {
        if (iconRef.current) {
          const rect = iconRef.current.getBoundingClientRect();
          return { x: rect.left, y: rect.top };
        }
        return { x: position.x, y: position.y };
      },
    }));

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX - position.x,
        startY: e.clientY - position.y,
        hasMoved: false,
      };
    };

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - dragRef.current.startX;
        const newY = e.clientY - dragRef.current.startY;

        if (
          Math.abs(newX - position.x) > 5 ||
          Math.abs(newY - position.y) > 5
        ) {
          dragRef.current.hasMoved = true;
        }

        setPosition({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
        setIsDragging(false);

        if (!dragRef.current.hasMoved) {
          onClick();
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, position.x, position.y, onClick]);

    const isStringIcon = typeof icon === "string";
    const isElementIcon = isValidElement(icon);

    // iOS-style mobile icon
    if (isMobile) {
      return (
        <div
          ref={iconRef}
          onClick={onClick}
          className="flex flex-col items-center gap-1 select-none active:opacity-70 transition-opacity"
          style={{ cursor: "pointer" }}
        >
          <div
            className={`pointer-events-none ${isStringIcon ? "text-4xl" : "w-14 h-14 flex items-center justify-center"}`}
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
          >
            {isStringIcon && icon}
            {isElementIcon && icon}
          </div>
          <span
            className="text-xs text-white text-center font-medium leading-tight pointer-events-none"
            style={{
              textShadow: "0 1px 3px rgba(0,0,0,0.9)",
              maxWidth: "72px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>
      );
    }

    // Desktop icon (draggable)
    return (
      <div
        ref={iconRef}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "auto",
        }}
        className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors w-28 select-none ${className}`}
      >
        <div
          className={`pointer-events-none ${isStringIcon ? "text-5xl" : "w-14 h-14 flex items-center justify-center"}`}
        >
          {isStringIcon && icon}
          {isElementIcon && icon}
        </div>

        <span className="text-xs text-white text-center font-bold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] pointer-events-none">
          {label}
        </span>
      </div>
    );
  },
);
