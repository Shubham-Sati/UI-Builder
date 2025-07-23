import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DropZoneProps {
  id: string;
  index: number;
  containerId?: string;
  className?: string;
  isElementDragging?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  id,
  index,
  containerId,
  className = "",
  isElementDragging = false,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "drop-zone",
      index,
      containerId,
    },
  });

  // Only show drop zone when actively dragging
  if (!isElementDragging && !isOver) {
    return <div ref={setNodeRef} className="h-0" />;
  }

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-200 ${
        isOver
          ? "h-8 bg-blue-100 border-2 border-blue-400 border-dashed rounded-md flex items-center justify-center"
          : isElementDragging
          ? "h-4 hover:h-6 hover:bg-gray-100 rounded-md flex items-center justify-center opacity-50"
          : "h-0"
      } ${className}`}
    >
      {isOver && (
        <div className="flex items-center space-x-2 text-blue-600 text-xs font-medium">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Drop here</span>
        </div>
      )}
    </div>
  );
};