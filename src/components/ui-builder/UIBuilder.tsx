import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { ElementPalette } from "./ElementPalette";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { RenderingEngine, createUIBuilderJSON } from "../../rendering-engine";
import { useUIBuilder } from "../../hooks/useUIBuilder";

export const UIBuilder: React.FC = () => {
  const {
    elements,
    selectedElementId,
    selectedElement,
    viewport,
    addElement,
    insertElementAfter,
    addElementToContainer,
    selectElement,
    updateElementProperty,
    setViewport,
    removeElement,
    reorderElements,
    reorderElementToIndex,
    isChildElement,
  } = useUIBuilder();

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedJSON, setExportedJSON] = useState<string>("");
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [showElementPalette, setShowElementPalette] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const dragData = active.data.current;
    const overData = over.data.current;

    // Handle dragging from palette to device card drop zones
    if (dragData?.source === "palette" && overData?.type === "drop-zone") {
      if (overData.containerId === "device-card") {
        // Dropping in main device card
        addElement(dragData.type, overData.index);
      } else {
        // Dropping in a container
        addElementToContainer(dragData.type, overData.containerId, overData.index);
      }
      return;
    }

    // Handle dragging from palette to device card (fallback for direct device card drops)
    if (dragData?.source === "palette" && over.id === "device-card") {
      addElement(dragData.type);
      return;
    }

    // Handle dragging from palette to container (fallback for direct container drops)
    if (dragData?.source === "palette" && overData?.type === "container") {
      addElementToContainer(dragData.type, overData.containerId);
      return;
    }

    // Handle reordering existing elements to drop zones
    if (dragData?.element && overData?.type === "drop-zone") {
      if (overData.containerId === "device-card") {
        // Use the new reorderElementToIndex function
        reorderElementToIndex(active.id as string, overData.index, overData.containerId);
      } else {
        // Reordering within a container would go here if needed
      }
      return;
    }

    // Handle reordering existing elements between each other
    if (dragData?.element && overData?.element) {
      reorderElements(active.id as string, over.id as string);
      return;
    }
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  const handleExportJSON = () => {
    const jsonData = createUIBuilderJSON(elements, viewport);
    setExportedJSON(JSON.stringify(jsonData, null, 2));
    setShowExportModal(true);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(exportedJSON);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  if (isPreviewMode) {
    return (
      <div className="relative h-screen w-screen">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
          >
            Exit Preview
          </button>
        </div>
        <RenderingEngine
          data={createUIBuilderJSON(elements, viewport)}
          viewport={viewport}
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex bg-white overflow-hidden">
        {showElementPalette && (
          <div className="w-80 flex-shrink-0">
            <ElementPalette
              usedElements={elements}
              selectedElementId={selectedElementId}
              onElementSelect={selectElement}
              onInsertElement={insertElementAfter}
              onAddToContainer={addElementToContainer}
              onRemoveElement={removeElement}
              onClose={() => setShowElementPalette(false)}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">UI Builder</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleExportJSON}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={handlePreview}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Preview
              </button>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Left side toggle button */}
            {!showElementPalette && (
              <button
                onClick={() => setShowElementPalette(true)}
                className="w-8 bg-gray-100 hover:bg-gray-200 border-r border-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Show Element Palette"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            <div className="flex-1 min-w-0">
              <Canvas
                elements={elements}
                selectedElementId={selectedElementId}
                viewport={viewport}
                onElementSelect={selectElement}
                isElementDragging={!!activeId}
              />
            </div>

            {showPropertiesPanel && (
              <div className="w-80 flex-shrink-0">
                <PropertiesPanel
                  selectedElement={selectedElement}
                  onPropertyChange={updateElementProperty}
                  onClose={() => setShowPropertiesPanel(false)}
                  isChildElement={selectedElementId ? isChildElement(selectedElementId) : false}
                />
              </div>
            )}

            {/* Right side toggle button */}
            {!showPropertiesPanel && (
              <button
                onClick={() => setShowPropertiesPanel(true)}
                className="w-8 bg-gray-100 hover:bg-gray-200 border-l border-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Show Properties Panel"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-2 bg-blue-100 border border-blue-300 rounded-lg shadow-lg">
            Dragging...
          </div>
        ) : null}
      </DragOverlay>

      {/* Export JSON Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Exported JSON</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-800">
                <code>{exportedJSON}</code>
              </pre>
            </div>

            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyJSON}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {showCopyFeedback ? (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
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
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
};
