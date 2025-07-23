export type ViewportType = "phone" | "tablet" | "laptop";

export interface UIElement {
  id: string;
  type: string;
  properties: Record<string, any> & {
    horizontalAlign?: "left" | "center" | "right";
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    width?: number | string;
    height?: number | string;
    display?: "flex" | "grid" | "block";
    flexDirection?: "row" | "column";
    justifyContent?:
      | "flex-start"
      | "center"
      | "flex-end"
      | "space-between"
      | "space-around";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    gap?: number;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    backgroundColor?: string;
  };
  children?: UIElement[];
  order: number;
}

export interface UIBuilderState {
  elements: UIElement[];
  selectedElementId: string | null;
  viewport: ViewportType;
  canvas: {
    zoom: number;
    offset: { x: number; y: number };
  };
}

export interface ElementDefinition {
  type: string;
  name: string;
  icon: string | React.ComponentType<{ size?: number; className?: string }>;
  defaultProps: Record<string, any>;
  propertySchema: PropertySchema[];
  component: React.ComponentType<any>;
}

export interface PropertySchema {
  key: string;
  label: string;
  type: "text" | "number" | "color" | "select" | "boolean" | "spacing" | "dimensions" | "dimension";
  options?: string[];
  defaultValue: any;
  subKeys?: string[];
}

export interface UIBuilderJSON {
  version: string;
  elements: UIElement[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    viewport: ViewportType;
  };
}
