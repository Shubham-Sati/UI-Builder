import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DeviceCard } from './DeviceCard';
import type { ViewportType, UIElement } from '../../../types/ui-builder';

interface ZoomableCanvasProps {
  viewport: ViewportType;
  elements: UIElement[];
  selectedElementId: string | null;
  onElementSelect: (elementId: string) => void;
}

export const ZoomableCanvas: React.FC<ZoomableCanvasProps> = ({
  viewport,
  elements,
  selectedElementId,
  onElementSelect,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.ctrlKey && e.button === 0)) { // Middle mouse button or Ctrl+click
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(0.25, zoom + delta), 3);
    setZoom(newZoom);
  }, [zoom]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Add keyboard support for reset view
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        handleResetView();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleResetView]);

  const transformStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: 'center center',
    transition: isPanning ? 'none' : 'transform 0.1s ease-out',
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Zoom Display and Reset */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={handleResetView}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium"
          title="Reset View (R)"
        >
          🎯
        </button>
        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-xs text-gray-600">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Canvas Instructions */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-2 bg-black bg-opacity-75 text-white text-xs rounded-lg">
        <div>Scroll: Zoom</div>
        <div>Middle Click + Drag: Pan</div>
        <div>Ctrl + Click + Drag: Pan</div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="h-full w-full bg-gray-100"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ 
          cursor: isPanning ? 'grabbing' : 'default',
          userSelect: 'none'
        }}
      >
        <div style={transformStyle}>
          <DeviceCard
            viewport={viewport}
            elements={elements}
            selectedElementId={selectedElementId}
            onElementSelect={onElementSelect}
          />
        </div>
      </div>
    </div>
  );
};