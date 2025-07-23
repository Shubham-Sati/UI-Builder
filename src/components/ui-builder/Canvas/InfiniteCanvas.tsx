import React, { useState, useRef, useCallback, useEffect } from "react";
import { DeviceCard } from "./DeviceCard";
import type { ViewportType, UIElement } from "../../../types/ui-builder";

interface DraggableDeviceCardProps {
  viewport: ViewportType;
  elements: UIElement[];
  selectedElementId: string | null;
  onElementSelect: (elementId: string) => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onDragStateChange: (isDragging: boolean) => void;
  isElementDragging?: boolean;
}

const DraggableDeviceCard: React.FC<DraggableDeviceCardProps> = ({
  viewport,
  elements,
  selectedElementId,
  onElementSelect,
  position,
  onPositionChange,
  onDragStateChange,
  isElementDragging = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const deviceCardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only allow dragging if clicking on drag handle or its children
      const target = e.target as HTMLElement;
      const dragHandle = target.closest(".cursor-move");
      if (dragHandle) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        onDragStateChange(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    },
    [position, onDragStateChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    onDragStateChange(false);
  }, [onDragStateChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={deviceCardRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="select-none">
        <DeviceCard
          viewport={viewport}
          elements={elements}
          selectedElementId={selectedElementId}
          onElementSelect={onElementSelect}
          isElementDragging={isElementDragging}
        />
      </div>
    </div>
  );
};

interface InfiniteCanvasProps {
  viewport: ViewportType;
  elements: UIElement[];
  selectedElementId: string | null;
  onElementSelect: (elementId: string) => void;
  isElementDragging?: boolean;
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  viewport,
  elements,
  selectedElementId,
  onElementSelect,
  isElementDragging = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [deviceCardPosition, setDeviceCardPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isDeviceCardDragging, setIsDeviceCardDragging] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only pan if clicking on empty canvas and not dragging device card
      if (
        !isDeviceCardDragging &&
        e.target === e.currentTarget &&
        e.button === 0
      ) {
        e.preventDefault();
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
    },
    [isDeviceCardDragging]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastPanPoint.x;
        const deltaY = e.clientY - lastPanPoint.y;
        setPan((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
    },
    [isPanning, lastPanPoint]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const target = e.target as HTMLElement;
      const deviceCardContent = target.closest(".device-card-content");

      // If we're inside device card content, handle scrolling manually
      if (deviceCardContent) {
        const scrollContainer = deviceCardContent as HTMLElement;
        const scrollMultiplier = 5.2;
        const deltaY = e.deltaY * scrollMultiplier;

        requestAnimationFrame(() => {
          const currentScrollTop = scrollContainer.scrollTop;
          const maxScroll =
            scrollContainer.scrollHeight - scrollContainer.clientHeight;
          const newScrollTop = Math.max(
            0,
            Math.min(currentScrollTop + deltaY, maxScroll)
          );

          scrollContainer.scrollTo({
            top: newScrollTop,
            behavior: "auto",
          });
        });

        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Check for any other device card related elements
      const isInsideDeviceCard =
        target.closest(".bg-white.rounded-lg.shadow-lg") ||
        target.closest(".element-wrapper") ||
        target.closest("[data-element-type]") ||
        target.closest(".select-none");

      if (isInsideDeviceCard) {
        const parentScrollable = target.closest(
          ".device-card-content"
        ) as HTMLElement;
        if (parentScrollable) {
          const scrollMultiplier = 6.2;
          const deltaY = e.deltaY * scrollMultiplier;

          requestAnimationFrame(() => {
            const currentScrollTop = parentScrollable.scrollTop;
            const maxScroll =
              parentScrollable.scrollHeight - parentScrollable.clientHeight;
            const newScrollTop = Math.max(
              0,
              Math.min(currentScrollTop + deltaY, maxScroll)
            );

            parentScrollable.scrollTo({
              top: newScrollTop,
              behavior: "auto",
            });
          });
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // If scrolling outside device card, perform zoom
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate mouse position relative to canvas
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(0.1, zoom + delta), 5);
      const zoomFactor = newZoom / zoom;

      setPan((prev) => ({
        x: mouseX - (mouseX - prev.x) * zoomFactor,
        y: mouseY - (mouseY - prev.y) * zoomFactor,
      }));

      setZoom(newZoom);
    },
    [zoom]
  );

  const getDeviceSize = useCallback(() => {
    switch (viewport) {
      case "phone":
        return { width: 390, height: 844 };
      case "tablet":
        return { width: 820, height: 1180 };
      case "laptop":
        return { width: 1280, height: 800 };
      default:
        return { width: 390, height: 844 };
    }
  }, [viewport]);

  const calculateOptimalViewport = useCallback(() => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const deviceSize = getDeviceSize();
    const padding = 120; // Minimum padding around device

    // Calculate zoom to fit device with padding
    const scaleX = (rect.width - padding) / deviceSize.width;
    const scaleY = (rect.height - padding) / deviceSize.height;
    const optimalZoom = Math.min(scaleX, scaleY, 1); // Don't zoom beyond 100%

    // Apply minimum zoom of 0.3 and maximum of 1.2 for better UX
    const finalZoom = Math.max(0.3, Math.min(optimalZoom, 1.2));

    // Calculate center position accounting for zoom
    // Position in unscaled coordinates to appear centered in scaled view
    const centerX = rect.width / 2 / finalZoom;
    const centerY = rect.height / 2 / finalZoom;

    setZoom(finalZoom);
    setPan({ x: 0, y: 0 });
    setDeviceCardPosition({
      x: centerX - deviceSize.width / 2,
      y: centerY - deviceSize.height / 2,
    });
  }, [viewport, getDeviceSize]);


  const handleResetView = useCallback(() => {
    calculateOptimalViewport();
  }, [calculateOptimalViewport]);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 5);
    setZoom(newZoom);
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom * 0.8, 0.1);
    setZoom(newZoom);
  }, [zoom]);

  const handleFitToScreen = useCallback(() => {
    calculateOptimalViewport();
  }, [calculateOptimalViewport]);

  // Initialize device card position and optimal zoom when canvas mounts
  useEffect(() => {
    if (!isInitialized && canvasRef.current) {
      calculateOptimalViewport();
      setIsInitialized(true);
    }
  }, [isInitialized, calculateOptimalViewport]);

  // Recalculate optimal viewport when device type changes
  useEffect(() => {
    if (isInitialized) {
      calculateOptimalViewport();
    }
  }, [viewport, calculateOptimalViewport, isInitialized]);

  // Handle window resize to recalculate optimal viewport
  useEffect(() => {
    const handleResize = () => {
      if (isInitialized) {
        calculateOptimalViewport();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateOptimalViewport, isInitialized]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      if (isTyping) return;

      switch (e.key) {
        case "r":
        case "R":
          e.preventDefault();
          handleResetView();
          break;
        case "f":
        case "F":
          e.preventDefault();
          handleFitToScreen();
          break;
        case "+":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleResetView, handleFitToScreen, handleZoomIn, handleZoomOut]);

  const canvasStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: "0 0",
    transition: isPanning ? "none" : "transform 0.1s ease-out",
  };

  return (
    <div className="relative h-full overflow-hidden bg-gray-100">
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-xs text-gray-600 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleResetView}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium"
          title="Reset View (R)"
        >
          🎯
        </button>
      </div>

      {/* Help Panel - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 opacity-60">
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 max-w-xs">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="text-gray-800 font-bold">Scroll Behavior:</div>
            <div>
              <span className="font-semibold text-gray-800">
                • Inside device:
              </span>
              <span>Content scrolling</span>
            </div>
            <div>• Outside device: Zoom in/out</div>
            <div className="font-medium text-gray-800 mt-2">Shortcuts:</div>
            <div>• R: Reset view • F: Fit screen</div>
            <div>• +/-: Zoom in/out</div>
          </div>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="h-full w-full relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isPanning ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        {/* Canvas Grid (optional visual aid) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            ...canvasStyle,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        <div style={canvasStyle}>
          <DraggableDeviceCard
            viewport={viewport}
            elements={elements}
            selectedElementId={selectedElementId}
            onElementSelect={onElementSelect}
            position={deviceCardPosition}
            onPositionChange={setDeviceCardPosition}
            onDragStateChange={setIsDeviceCardDragging}
            isElementDragging={isElementDragging}
          />
        </div>
      </div>
    </div>
  );
};
