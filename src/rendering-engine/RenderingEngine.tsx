import React from "react";
import type {
  UIBuilderJSON,
  UIElement,
  ViewportType,
} from "../types/ui-builder";
import { elementRegistry } from "../store/element-registry";

interface RenderedElementProps {
  element: UIElement;
  viewport: ViewportType;
}

const RenderedElement: React.FC<RenderedElementProps> = ({
  element,
  viewport,
}) => {
  const definition = elementRegistry[element.type];
  if (!definition) return null;

  const Component = definition.component;

  // Helper functions to process dimension objects
  const processWidth = (width: any) => {
    if (typeof width === 'object' && width?.value !== undefined) {
      return `${width.value}${width.unit}`;
    }
    return typeof width === 'number' ? `${width}px` : (width as string) || "100%";
  };

  const processHeight = (height: any) => {
    if (typeof height === 'object' && height?.value !== undefined) {
      return `${height.value}${height.unit}`;
    }
    return typeof height === 'number' ? `${height}px` : (height as string) || "fit-content";
  };

  // Simplified element styling with new layout system
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
    ...(element.type !== "button" && { backgroundColor: element.properties.backgroundColor || "transparent" }),
    boxSizing: "border-box" as const,
    // Handle horizontal alignment
    alignSelf: element.properties.horizontalAlign === "left" ? "flex-start" : 
                element.properties.horizontalAlign === "center" ? "center" :
                element.properties.horizontalAlign === "right" ? "flex-end" : "flex-start",
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

  // Component props
  const componentProps = element.type === "container"
    ? {
        ...element.properties,
        containerId: element.id,
        children: element.children
          ? element.children.map((child) => (
              <RenderedElement
                key={child.id}
                element={child}
                viewport={viewport}
              />
            ))
          : undefined,
      }
    : element.properties;

  return (
    <Component
      {...componentProps}
      style={{ ...componentProps.style, ...elementStyle }}
      data-element-type={element.type}
    />
  );
};

interface RenderingEngineProps {
  data: UIBuilderJSON;
  viewport?: ViewportType;
  className?: string;
}

export const RenderingEngine: React.FC<RenderingEngineProps> = ({
  data,
  viewport = "phone",
  className = "",
}) => {
  const getDeviceConfig = () => {
    switch (viewport) {
      case "phone":
        return {
          name: "iPhone 12 Pro",
          screenWidth: 390,
          screenHeight: 844,
          deviceWidth: 410, // Adding device frame
          deviceHeight: 884, // Adding device frame
          hasNotch: true,
          borderRadius: 25,
        };
      case "tablet":
        return {
          name: "iPad Air", 
          screenWidth: 820,
          screenHeight: 1180,
          deviceWidth: 860, // Adding device frame
          deviceHeight: 1220, // Adding device frame
          hasNotch: false,
          borderRadius: 16,
        };
      case "laptop":
        return {
          name: "MacBook Pro 13",
          screenWidth: 1280,
          screenHeight: 800,
          deviceWidth: 1320, // Adding device frame
          deviceHeight: 850, // Adding device frame
          hasNotch: false,
          borderRadius: 8,
        };
      default:
        return {
          name: "iPhone 12 Pro",
          screenWidth: 390,
          screenHeight: 844,
          deviceWidth: 410,
          deviceHeight: 884,
          hasNotch: true,
          borderRadius: 25,
        };
    }
  };

  const deviceConfig = getDeviceConfig();
  const sortedElements = [...data.elements].sort((a, b) => a.order - b.order);

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-900 p-8 ${className}`}>
      {/* Device Info Label */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white px-4 py-2 rounded-full shadow-lg border">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">{deviceConfig.name}</span>
            <span className="text-xs text-gray-500">
              {deviceConfig.screenWidth} × {deviceConfig.screenHeight}
            </span>
          </div>
        </div>
      </div>

      {/* Device Frame */}
      <div
        className="relative bg-gray-800 shadow-2xl"
        style={{
          width: `${deviceConfig.deviceWidth}px`,
          height: `${deviceConfig.deviceHeight}px`,
          borderRadius: `${deviceConfig.borderRadius + 8}px`,
          padding: viewport === "laptop" ? "8px" : "20px",
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        {/* Screen */}
        <div
          className="relative bg-white overflow-auto flex flex-col"
          style={{
            width: `${deviceConfig.screenWidth}px`,
            height: `${deviceConfig.screenHeight}px`,
            borderRadius: `${deviceConfig.borderRadius}px`,
            margin: "0 auto",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          {/* iPhone Notch */}
          {deviceConfig.hasNotch && viewport === "phone" && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
              <div 
                className="bg-black rounded-b-2xl"
                style={{
                  width: "154px",
                  height: "30px",
                }}
              >
                <div className="flex justify-center pt-1">
                  <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* Status Bar for Phone/Tablet */}
          {viewport !== "laptop" && (
            <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between text-xs font-medium text-gray-900" 
                 style={{ marginTop: deviceConfig.hasNotch ? "30px" : "0px" }}>
              <div className="flex items-center space-x-1">
                <span>9:41</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <div className="ml-1 w-6 h-3 border border-gray-900 rounded-sm">
                  <div className="w-4 h-2 bg-green-500 rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div 
            className="flex-1 overflow-auto p-2"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              boxSizing: "border-box",
            }}
          >
            {sortedElements.map((element) => (
              <RenderedElement
                key={element.id}
                element={element}
                viewport={viewport}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const createUIBuilderJSON = (
  elements: UIElement[],
  viewport: ViewportType = "phone"
): UIBuilderJSON => {
  // Clean up elements by removing unwanted properties and restructuring
  const cleanedElements = elements.map((element) => {
    const { 
      paddingX, 
      paddingY, 
      marginX, 
      marginY, 
      position, 
      responsive, 
      display,
      gridTemplateColumns,
      gridTemplateRows,
      size,
      ...cleanProperties 
    } = element.properties;
    
    // Create cleaned properties with size moved inside properties if it exists
    const finalProperties = {
      ...cleanProperties,
      ...(size && { size }) // Only add size if it exists
    };

    return {
      ...element,
      properties: finalProperties,
    };
  });

  return {
    version: "1.0.0",
    elements: cleanedElements,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewport,
    },
  };
};

export const parseUIBuilderJSON = (
  jsonString: string
): UIBuilderJSON | null => {
  try {
    const data = JSON.parse(jsonString);
    if (data.version && data.elements && data.metadata) {
      return data as UIBuilderJSON;
    }
    return null;
  } catch (error) {
    console.error("Error parsing UI Builder JSON:", error);
    return null;
  }
};
