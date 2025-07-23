import React from "react";
import type { ViewportType, UIElement } from "../../../types/ui-builder";
import { InfiniteCanvas } from "./InfiniteCanvas";

interface CanvasProps {
  elements: UIElement[];
  selectedElementId: string | null;
  viewport: ViewportType;
  onElementSelect: (elementId: string) => void;
  isElementDragging?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElementId,
  viewport,
  onElementSelect,
  isElementDragging = false,
}) => {
  return (
    <div className="h-full bg-gray-100">
      <InfiniteCanvas
        viewport={viewport}
        elements={elements}
        selectedElementId={selectedElementId}
        onElementSelect={onElementSelect}
        isElementDragging={isElementDragging}
      />
    </div>
  );
};
