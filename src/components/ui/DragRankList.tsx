"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DragRankListProps {
  items: string[];
  onChange: (ordered: string[]) => void;
  className?: string;
}

export function DragRankList({
  items,
  onChange,
  className,
}: DragRankListProps) {
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    // We only need the index
    e.dataTransfer.setData("text/plain", idx.toString());
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    // Reorder as we drag over
    const newItems = [...items];
    const itemToMove = newItems.splice(draggedIdx, 1)[0];
    newItems.splice(idx, 0, itemToMove);

    onChange(newItems);
    setDraggedIdx(idx); // Update dragged index to current position
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  // Simple touch fallback since HTML5 drag API doesn't support touch
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>, idx: number) => {
    // Find element under touch
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target) {
      const itemElement = target.closest("[data-drag-index]");
      if (itemElement) {
        const hoverIdx = parseInt(
          itemElement.getAttribute("data-drag-index") || "-1",
          10,
        );
        if (hoverIdx !== -1 && draggedIdx !== null && hoverIdx !== draggedIdx) {
          const newItems = [...items];
          const itemToMove = newItems.splice(draggedIdx, 1)[0];
          newItems.splice(hoverIdx, 0, itemToMove);

          onChange(newItems);
          setDraggedIdx(hoverIdx);
        }
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((item, idx) => {
        const isDragged = draggedIdx === idx;
        return (
          <div
            key={item}
            data-drag-index={idx}
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDragEnd={onDragEnd}
            onTouchStart={() => setDraggedIdx(idx)}
            onTouchMove={(e) => onTouchMove(e, idx)}
            onTouchEnd={onDragEnd}
            className={cn(
              "flex min-h-[52px] items-center gap-4 border border-gray-2 bg-gray-1 px-4 py-3 text-white transition-all cursor-grab active:cursor-grabbing",
              isDragged && "opacity-40 scale-[0.98] border-accent",
            )}>
            <div className="flex-shrink-0 font-mono text-xl font-bold text-accent">
              {(idx + 1).toString().padStart(2, "0")}
            </div>
            <div className="flex-grow font-medium">{item}</div>
            <div
              className="flex-shrink-0 text-gray-3 leading-none opacity-50 hover:opacity-100 transition-opacity"
              aria-hidden="true">
              ⋮⋮
            </div>
          </div>
        );
      })}
    </div>
  );
}
