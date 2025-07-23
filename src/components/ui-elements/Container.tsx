import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  flexDirection?: "row" | "column";
  gap?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
  containerId?: string;
  width?: string | number;
  height?: string | number;
  horizontalAlign?: "left" | "center" | "right";
}

export const Container: React.FC<ContainerProps> = ({
  justifyContent = "flex-start",
  alignItems = "flex-start",
  flexDirection = "row",
  gap = 8,
  paddingTop = 0,
  paddingRight = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  backgroundColor = "transparent",
  children,
  className = "",
  containerId,
  width = "100%",
  height = "fit-content",
  horizontalAlign = "left",
  style,
  ...props
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: containerId || "container",
    data: { type: "container", containerId },
  });

  const containerStyle = {
    display: "flex",
    justifyContent,
    alignItems,
    flexDirection,
    gap: `${gap}px`,
    paddingTop: `${paddingTop}px`,
    paddingRight: `${paddingRight}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    backgroundColor:
      backgroundColor === "#transparent" ? "transparent" : backgroundColor,
    minHeight: flexDirection === "column" ? "60px" : "40px",
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    maxWidth: "100%",
    boxSizing: "border-box" as const,
    overflow: "hidden",
    minWidth: 0,
    alignSelf: horizontalAlign === "left" ? "flex-start" : 
               horizontalAlign === "center" ? "center" :
               horizontalAlign === "right" ? "flex-end" : "flex-start",
  };

  return (
    <div
      {...props}
      ref={setNodeRef}
      className={`flex max-w-full min-w-0 ${className} ${
        isOver ? "bg-blue-50" : ""
      }`}
      style={{...containerStyle, ...style}}
    >
      {children || (
        <div className="text-gray-400 text-sm pointer-events-none">
          Drop elements here
        </div>
      )}
    </div>
  );
};
