import React, { useEffect, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ViewportType, UIElement } from "../../../types/ui-builder";
import { elementRegistry } from "../../../store/element-registry";
import { DropZone } from "./DropZone";

interface SortableElementProps {
  element: UIElement;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
  selectedElementId?: string | null;
  onElementSelect?: (elementId: string) => void;
  isChildElement?: boolean;
  isElementDragging?: boolean;
}

const SortableElement: React.FC<SortableElementProps> = ({
  element,
  isSelected,
  onSelect,
  index,
  selectedElementId,
  onElementSelect,
  // @ts-ignore
  isChildElement = false,
  isElementDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: { element, index },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const definition = elementRegistry[element.type];
  const Component = definition.component;

  const filterValidProps = (props: any) => {
    const { component, icon, render, $$typeof, ...validProps } = props;
    return validProps;
  };

  // Simplified component props for new system
  const componentProps =
    element.type === "container"
      ? {
          ...filterValidProps(element.properties),
          containerId: element.id,
          children: element.children ? (
            <SortableContext
              items={element.children.map((child) => child.id)}
              strategy={verticalListSortingStrategy}
            >
              {isElementDragging && (
                <DropZone
                  id={`${element.id}-drop-0`}
                  index={0}
                  containerId={element.id}
                  className=""
                  isElementDragging={isElementDragging}
                />
              )}

              {element.children.map((child, childIndex) => (
                <React.Fragment key={child.id}>
                  <SortableElement
                    element={child}
                    isSelected={selectedElementId === child.id}
                    onSelect={() => onElementSelect?.(child.id)}
                    index={childIndex}
                    selectedElementId={selectedElementId}
                    onElementSelect={onElementSelect}
                    isChildElement={true}
                    isElementDragging={isElementDragging}
                  />

                  {isElementDragging && (
                    <DropZone
                      id={`${element.id}-drop-${childIndex + 1}`}
                      index={childIndex + 1}
                      containerId={element.id}
                      className=""
                      isElementDragging={isElementDragging}
                    />
                  )}
                </React.Fragment>
              ))}
            </SortableContext>
          ) : (
            <DropZone
              id={`${element.id}-drop-0`}
              index={0}
              containerId={element.id}
              className="min-h-[2rem]"
              isElementDragging={isElementDragging}
            />
          ),
        }
      : filterValidProps(element.properties);

  // Simplified styling with new layout system
  const processWidth = (width: any) => {
    if (typeof width === 'object' && width?.value !== undefined) {
      return `${width.value}${width.unit}`;
    }
    return typeof width === 'number' ? `${width}px` : (width as string) || (isChildElement ? "auto" : "100%");
  };

  const processHeight = (height: any) => {
    if (typeof height === 'object' && height?.value !== undefined) {
      return `${height.value}${height.unit}`;
    }
    return typeof height === 'number' ? `${height}px` : (height as string) || "fit-content";
  };

  const elementStyle = {
    width: processWidth(element.properties.width),
    height: processHeight(element.properties.height),
    paddingTop: element.properties.paddingTop ? `${element.properties.paddingTop}px` : "0px",
    paddingRight: element.properties.paddingRight ? `${element.properties.paddingRight}px` : "0px", 
    paddingBottom: element.properties.paddingBottom ? `${element.properties.paddingBottom}px` : "0px",
    paddingLeft: element.properties.paddingLeft ? `${element.properties.paddingLeft}px` : "0px",
    marginTop: element.properties.marginTop ? `${element.properties.marginTop}px` : "0px",
    marginRight: element.properties.marginRight ? `${element.properties.marginRight}px` : "0px",
    marginBottom: element.properties.marginBottom ? `${element.properties.marginBottom}px` : "0px",
    marginLeft: element.properties.marginLeft ? `${element.properties.marginLeft}px` : "0px",
    boxSizing: "border-box" as const,
    ...(element.type !== "button" && { backgroundColor: element.properties.backgroundColor || "transparent" }),
    // Handle alignment: child elements ignore horizontalAlign completely, only non-child elements use it
    ...(() => {
      if (isChildElement) {
        // For child elements inside containers, completely ignore horizontalAlign property
        // Let the container's alignItems property have full control
        return {}; // No alignSelf applied - container's alignItems controls alignment
      } else {
        // For non-child elements (top-level elements), always apply horizontalAlign as alignSelf
        return {
          alignSelf: element.properties.horizontalAlign === "left" ? "flex-start" : 
                     element.properties.horizontalAlign === "center" ? "center" :
                     element.properties.horizontalAlign === "right" ? "flex-end" : "flex-start"
        };
      }
    })(),
  };

  // Add container-specific layout properties
  if (element.type === "container") {
    Object.assign(elementStyle, {
      display: "flex",
      flexDirection: element.properties.flexDirection || "row",
      justifyContent: element.properties.justifyContent || "flex-start",
      alignItems: element.properties.alignItems || "flex-start",
      gap: element.properties.gap ? `${element.properties.gap}px` : "0px",
    });
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const combinedListeners = {
    ...listeners,
    onClick: handleClick,
  };

  return (
    <Component
      ref={setNodeRef}
      {...attributes}
      {...combinedListeners}
      {...componentProps}
      className={`${componentProps.className || ''} device-card-element cursor-grab active:cursor-grabbing transition-all ${
        isSelected ? "border-2 border-blue-500" : "border-2 border-transparent"
      }`}
      data-element-type={element.type}
      data-element-id={element.id}
      style={{
        ...style,
        ...componentProps.style,
        ...elementStyle,
      }}
    />
  );
};

interface DeviceCardProps {
  viewport: ViewportType;
  elements: UIElement[];
  selectedElementId: string | null;
  onElementSelect: (elementId: string) => void;
  isElementDragging?: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  viewport,
  elements,
  selectedElementId,
  onElementSelect,
  isElementDragging = false,
}) => {
  const deviceContentRef = useRef<HTMLDivElement>(null);

  // Function to scroll to selected element
  const scrollToElement = (elementId: string) => {
    const deviceContent = deviceContentRef.current;
    if (!deviceContent) return;

    // Find the element by ID in the DOM within device card context
    const elementInDOM = deviceContent.querySelector(
      `.device-card-element[data-element-id="${elementId}"]`
    );
    if (elementInDOM) {
      const elementRect = elementInDOM.getBoundingClientRect();
      const containerRect = deviceContent.getBoundingClientRect();

      // Check if element is already visible
      const isVisible =
        elementRect.top >= containerRect.top &&
        elementRect.bottom <= containerRect.bottom;

      // Only scroll if element is not visible
      if (!isVisible) {
        const containerHeight = deviceContent.clientHeight;
        const elementHeight = elementInDOM.clientHeight;
        const elementTop = (elementInDOM as HTMLElement).offsetTop;

        // Calculate scroll position to center the element
        const scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;

        deviceContent.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: "smooth",
        });
      }
    }
  };

  // Scroll to element when selection changes
  useEffect(() => {
    if (selectedElementId) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToElement(selectedElementId), 100);
    }
  }, [selectedElementId]);

  const getDeviceSize = () => {
    switch (viewport) {
      case "phone":
        return {
          width: 390, // iPhone 12 Pro screen width
          height: 844, // iPhone 12 Pro screen height
          title: "iPhone 12 Pro",
          icon: "📱",
          elementsPerRow: 3,
          aspectRatio: 390 / 844,
        };
      case "tablet":
        return {
          width: 820, // iPad Air screen width
          height: 1180, // iPad Air screen height  
          title: "iPad Air",
          icon: "📱",
          elementsPerRow: 4,
          aspectRatio: 820 / 1180,
        };
      case "laptop":
        return {
          width: 1280, // MacBook Pro 13 screen width
          height: 800, // MacBook Pro 13 screen height
          title: "MacBook Pro 13",
          icon: "💻",
          elementsPerRow: 6,
          aspectRatio: 1280 / 800,
        };
      default:
        return {
          width: 390,
          height: 844,
          title: "iPhone 12 Pro",
          icon: "📱",
          elementsPerRow: 3,
          aspectRatio: 390 / 844,
        };
    }
  };

  const deviceInfo = getDeviceSize();
  const sortedElements = [...elements].sort((a, b) => a.order - b.order);

  const { setNodeRef: setCardRef, isOver } = useDroppable({
    id: "device-card",
    data: { type: "device-card" },
  });

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <div
          ref={setCardRef}
          className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-200 overflow-hidden ${
            isOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
          }`}
          style={{
            width: deviceInfo.width,
            height: deviceInfo.height,
          }}
        >
          {/* Draggable header bar */}
          <div className="cursor-move bg-gray-100 hover:bg-gray-200 border-b border-gray-200 px-3 py-2 flex items-center justify-between transition-colors">
            <div className="flex items-center space-x-2">
              <span className="text-base">{deviceInfo.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {deviceInfo.title}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
          <div
            ref={deviceContentRef}
            className="flex-1 device-card-content overflow-y-auto py-2"
            style={{
              scrollBehavior: "smooth",
              maxHeight: "calc(100% - 60px)",
              minHeight: "200px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {sortedElements.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
                <div>
                  <div className="text-4xl mb-2">{deviceInfo.icon}</div>
                  <p className="text-sm">Drag elements here to build your UI</p>
                </div>
              </div>
            ) : (
              <SortableContext
                items={sortedElements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="flex flex-col pb-16"
                  style={{
                    minHeight: "100%",
                    height: "auto",
                    alignItems: "stretch",
                    width: "100%",
                  }}
                >
                  {/* Drop zone at the beginning */}
                  <DropZone
                    id="device-card-drop-0"
                    index={0}
                    containerId="device-card"
                    className="mx-2"
                    isElementDragging={isElementDragging}
                  />

                  {sortedElements.map((element, index) => (
                    <React.Fragment key={element.id}>
                      <SortableElement
                        element={element}
                        isSelected={selectedElementId === element.id}
                        onSelect={() => onElementSelect(element.id)}
                        index={index}
                        selectedElementId={selectedElementId}
                        onElementSelect={onElementSelect}
                        isElementDragging={isElementDragging}
                      />

                      {/* Drop zone after each element */}
                      <DropZone
                        id={`device-card-drop-${index + 1}`}
                        index={index + 1}
                        containerId="device-card"
                        className={`mx-2 ${index === sortedElements.length - 1 ? 'mt-2 mb-4' : ''}`}
                        isElementDragging={isElementDragging}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
