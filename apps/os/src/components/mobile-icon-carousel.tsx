"use client";

import { useState, useRef, useCallback, type RefObject } from "react";
import type { DesktopIconConfig, DesktopIconRef } from "@/types";
import { DesktopIcon } from "@/components/desktop-icon";

const ICONS_PER_PAGE = 24; // 4 cols × 6 rows

interface MobileIconCarouselProps {
  icons: DesktopIconConfig[];
  onIconClick: (windowId: string) => void;
  onRegisterRef: (iconId: string, ref: RefObject<DesktopIconRef | null>) => void;
}

export function MobileIconCarousel({
  icons,
  onIconClick,
  onRegisterRef,
}: MobileIconCarouselProps) {
  const pages = Math.ceil(icons.length / ICONS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  // Touch tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(pages - 1, page)));
  }, [pages]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
    touchStartY.current = e.touches[0]?.clientY ?? 0;
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaX = Math.abs((e.touches[0]?.clientX ?? 0) - touchStartX.current);
    const deltaY = Math.abs((e.touches[0]?.clientY ?? 0) - touchStartY.current);
    if (deltaX > deltaY && deltaX > 10) {
      isDragging.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    const threshold = 60;
    if (deltaX < -threshold) goToPage(currentPage + 1);
    else if (deltaX > threshold) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Mouse swipe fallback for desktop testing
  const mouseStartX = useRef(0);
  const isMouseDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isMouseDragging.current = true;
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isMouseDragging.current) return;
    isMouseDragging.current = false;
    const deltaX = e.clientX - mouseStartX.current;
    const threshold = 60;
    if (deltaX < -threshold) goToPage(currentPage + 1);
    else if (deltaX > threshold) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return (
    <div className="absolute inset-0 flex flex-col z-10" style={{ paddingTop: 60, paddingBottom: 80 }}>
      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ userSelect: "none" }}
      >
        {/* Sliding track */}
        <div
          className="flex h-full"
          style={{
            width: `${pages * 100}%`,
            transform: `translateX(-${(currentPage / pages) * 100}%)`,
            transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {Array.from({ length: pages }).map((_, pageIndex) => {
            const pageIcons = icons.slice(
              pageIndex * ICONS_PER_PAGE,
              (pageIndex + 1) * ICONS_PER_PAGE
            );
            return (
              <div
                key={pageIndex}
                className="h-full flex-shrink-0"
                style={{ width: `${100 / pages}%`, padding: "0 16px" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(6, 1fr)",
                    gap: "8px",
                    height: "100%",
                  }}
                >
                  {pageIcons.map((iconConfig) => (
                    <IconCell
                      key={iconConfig.id}
                      config={iconConfig}
                      onClick={() => onIconClick(iconConfig.windowId)}
                      onRegisterRef={onRegisterRef}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page indicator dots */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              style={{
                width: i === currentPage ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === currentPage ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s ease",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IconCell({
  config,
  onClick,
  onRegisterRef,
}: {
  config: DesktopIconConfig;
  onClick: () => void;
  onRegisterRef: (iconId: string, ref: RefObject<DesktopIconRef | null>) => void;
}) {
  const ref = useRef<DesktopIconRef>(null);

  // Register ref on mount
  const callbackRef = useCallback((el: DesktopIconRef | null) => {
    (ref as React.MutableRefObject<DesktopIconRef | null>).current = el;
    if (el) onRegisterRef(config.id, ref);
  }, [config.id, onRegisterRef]);

  return (
    <div className="flex items-center justify-center">
      <DesktopIcon
        ref={ref}
        config={config}
        onClick={onClick}
        isMobile
      />
    </div>
  );
}
