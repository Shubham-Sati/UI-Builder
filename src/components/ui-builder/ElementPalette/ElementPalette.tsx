import React, { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  elementRegistry,
  getAllElementTypes,
} from "../../../store/element-registry";
import type { ViewportType } from "../../../types/ui-builder";

interface DraggableElementProps {
  type: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type }) => {
  const definition = elementRegistry[type];
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `palette-${type}`,
      data: { type, source: "palette" },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const renderIcon = (
    icon: string | React.ComponentType<{ size?: number; className?: string }>
  ) => {
    if (typeof icon === "string") {
      return <span className="text-xs">{icon}</span>;
    }
    const IconComponent = icon;
    return <IconComponent size={16} className="text-gray-600" />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-[75px] h-[75px]  py-3 px-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 cursor-grab active:cursor-grabbing flex flex-col justify-center items-center gap-2 transition-colors"
    >
      {renderIcon(definition?.icon)}
      <span className="text-xs font-medium text-gray-700">
        {definition?.name}
      </span>
    </div>
  );
};

interface UsedElementProps {
  element: any;
  isSelected: boolean;
  onClick: () => void;
  onInsertElement?: (elementType: string, afterElementId: string) => void;
  onAddToContainer?: (elementType: string, containerId: string) => void;
  onRemoveElement?: (elementId: string) => void;
  depth?: number;
  selectedElementId?: string | null;
  onElementSelect?: (elementId: string) => void;
}

const UsedElement: React.FC<UsedElementProps> = ({
  element,
  isSelected,
  onClick,
  onInsertElement,
  onAddToContainer,
  onRemoveElement,
  depth = 0,
  selectedElementId,
  onElementSelect,
}) => {
  const definition = elementRegistry[element.type];
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const availableTypes = getAllElementTypes();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!showMenu && buttonRef.current) {
      // Calculate position based on viewport space
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // Estimate menu height (approximate based on available types)
      const estimatedMenuHeight = Math.min(300, 40 + availableTypes.length * 32);
      
      // Position menu based on available space
      setMenuPosition(spaceBelow >= estimatedMenuHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top');
    }
    
    setShowMenu(!showMenu);
  };

  const handleInsertElement = (elementType: string) => {
    if (element.type === "container") {
      onAddToContainer?.(elementType, element.id);
    } else {
      onInsertElement?.(elementType, element.id);
    }
    setShowMenu(false);
  };

  const handleRemoveElement = () => {
    onRemoveElement?.(element.id);
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  return (
    <div className="relative used-element" data-element-id={element.id}>
      <div
        onClick={onClick}
        className={`p-2 border rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-white hover:bg-gray-50"
        }`}
        style={{ marginLeft: `${depth * 16}px` }}
      >
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-2">
            {depth > 0 && <span className="text-xs text-gray-400">└─</span>}
            {typeof definition.icon === "string" ? (
              <span className="text-sm">{definition.icon}</span>
            ) : (
              React.createElement(definition.icon, {
                size: 14,
                className: "text-gray-600",
              })
            )}
            <span className="text-xs font-medium text-gray-700">
              {definition.name}
            </span>
          </div>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleMenuClick}
              className="p-1 hover:bg-gray-200 rounded text-black hover:text-gray-800"
              title="Element options"
            >
              ⋮
            </button>
            {showMenu && (
              <div
                ref={menuRef}
                className={`absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 ${
                  menuPosition === 'bottom' 
                    ? 'top-full mt-1' 
                    : 'bottom-full mb-1'
                }`}
                style={{ 
                  maxHeight: '20rem',
                  overflowY: 'auto'
                }}
              >
                <div className="p-2">
                  {/* Remove element option */}
                  <button
                    onClick={handleRemoveElement}
                    className="w-full text-left p-2 hover:bg-red-50 rounded flex items-center space-x-2 text-xs text-red-600 hover:text-red-700"
                  >
                    <span>🗑️</span>
                    <span>Remove Element</span>
                  </button>

                  {/* Divider - only show if container has insert options */}
                  {element.type === "container" && (
                    <div className="border-t border-gray-200 my-2"></div>
                  )}

                  {/* Insert element option */}
                  {element.type === "container" && (
                    <div className="space-y-1">
                      {/* <div className="text-xs font-medium text-gray-600 px-2 py-1">
                        Insert element inside:
                      </div> */}
                      <div className="max-h-48 overflow-y-auto">
                        {availableTypes.map((type) => {
                          const def = elementRegistry[type];
                          if (!def) return null;
                          return (
                            <button
                              key={type}
                              onClick={() => handleInsertElement(type)}
                              className="w-full text-left p-2 text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2 text-xs"
                            >
                              {typeof def.icon === "string" ? (
                                <span>{def.icon}</span>
                              ) : (
                                React.createElement(def.icon, {
                                  size: 14,
                                  className: "text-gray-600",
                                })
                              )}
                              <span>{def.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {element.properties.text ||
            element.properties.label ||
            element.id.slice(-8)}
        </div>
      </div>

      {/* Render children if any */}
      {element.children && element.children.length > 0 && (
        <div className="mt-1">
          {element.children.map((child: any) => (
            <UsedElement
              key={child.id}
              element={child}
              isSelected={selectedElementId === child.id}
              onClick={() => onElementSelect?.(child.id)}
              onInsertElement={onInsertElement}
              onAddToContainer={onAddToContainer}
              onRemoveElement={onRemoveElement}
              depth={depth + 1}
              selectedElementId={selectedElementId}
              onElementSelect={onElementSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ElementPaletteProps {
  usedElements: any[];
  selectedElementId: string | null;
  onElementSelect: (elementId: string) => void;
  onInsertElement?: (elementType: string, afterElementId: string) => void;
  onAddToContainer?: (elementType: string, containerId: string) => void;
  onRemoveElement?: (elementId: string) => void;
  onClose?: () => void;
  viewport?: ViewportType;
  onViewportChange?: (viewport: ViewportType) => void;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({
  usedElements,
  selectedElementId,
  onElementSelect,
  onInsertElement,
  onAddToContainer,
  onRemoveElement,
  onClose,
  viewport = "phone",
  onViewportChange,
}) => {
  const availableTypes = getAllElementTypes();
  const usedElementsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected element when selectedElementId changes
  useEffect(() => {
    if (selectedElementId && usedElementsContainerRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const container = usedElementsContainerRef.current;
        if (!container) return;

        // Find the selected element in the DOM within used elements context
        const selectedElement = container.querySelector(
          `.used-element[data-element-id="${selectedElementId}"]`
        );
        
        if (selectedElement) {
          const elementRect = selectedElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Check if element is already visible
          const isVisible =
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom;

          // Only scroll if element is not visible
          if (!isVisible) {
            const containerHeight = container.clientHeight;
            const elementHeight = selectedElement.clientHeight;
            const elementTop = (selectedElement as HTMLElement).offsetTop;

            // Calculate scroll position to center the element
            const scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;

            container.scrollTo({
              top: Math.max(0, scrollTop),
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }, [selectedElementId]);

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">UI Elements</h2>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-2 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-1">
            {/* Phone button */}
            <button
              onClick={() => onViewportChange?.("phone")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewport === "phone"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Phone view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect
                  x="7"
                  y="2"
                  width="10"
                  height="20"
                  rx="2"
                  strokeWidth={2}
                />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </button>

            {/* Tablet button */}
            <button
              onClick={() => onViewportChange?.("tablet")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewport === "tablet"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Tablet view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect
                  x="5"
                  y="3"
                  width="14"
                  height="18"
                  rx="2"
                  strokeWidth={2}
                />
                <circle cx="12" cy="18" r="0.5" fill="currentColor" />
              </svg>
            </button>

            {/* Laptop button */}
            <button
              onClick={() => onViewportChange?.("laptop")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewport === "laptop"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Laptop view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                  strokeWidth={2}
                />
                <path
                  d="M2 18h20l-1 2a1 1 0 01-1 1H4a1 1 0 01-1-1l-1-2z"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            title="Hide Element Palette"
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
        </div>
        
        <div className="p-4 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Available Elements
          </h3>
          <div className="flex flex-wrap justify-start space-x-5 space-y-3">
            {availableTypes.map((type) => (
              <DraggableElement key={type} type={type} />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 flex flex-col flex-1 min-h-0">
          <div className="p-4 pb-2 flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-600">
              Used Elements
            </h3>
          </div>
          <div ref={usedElementsContainerRef} className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {usedElements.length === 0 ? (
                <p className="text-xs text-gray-400">No elements added yet</p>
              ) : (
                usedElements.map((element) => (
                  <UsedElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onClick={() => onElementSelect(element.id)}
                    onInsertElement={onInsertElement}
                    onAddToContainer={onAddToContainer}
                    onRemoveElement={onRemoveElement}
                    depth={0}
                    selectedElementId={selectedElementId}
                    onElementSelect={onElementSelect}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
