import React from "react";
import type { UIElement, PropertySchema } from "../../../types/ui-builder";
import { elementRegistry } from "../../../store/element-registry";

interface PropertyInputProps {
  schema: PropertySchema;
  value: any;
  onChange: (value: any) => void;
  elementProperties?: Record<string, any>;
  onPropertyChange?: (key: string, value: any) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  schema,
  value,
  onChange,
  elementProperties,
  onPropertyChange,
}) => {
  const { label, type, options } = schema;

  switch (type) {
    case "text":
      return (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white"
          />
        </div>
      );

    case "number":
      return (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white"
          />
        </div>
      );

    case "select":
      return (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <select
            value={value || schema.defaultValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white"
          >
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "boolean":
      return (
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500">{label}</span>
          </label>
        </div>
      );

    case "color":
      return (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 border border-gray-300 rounded"
          />
        </div>
      );

    case "spacing":
      if (!schema.subKeys || !elementProperties || !onPropertyChange) return null;
      const directions = ["Top", "Right", "Bottom", "Left"];
      return (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">{label}</label>
          <div className="grid grid-cols-4 gap-1">
            {schema.subKeys.map((subKey, index) => (
              <div key={subKey}>
                <label className="block text-xs text-gray-400 mb-1">{directions[index]}</label>
                <input
                  type="number"
                  value={elementProperties[subKey] ?? 0}
                  onChange={(e) =>
                    onPropertyChange(subKey, Number(e.target.value))
                  }
                  className="w-full px-1 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "dimension":
      if (!elementProperties || !onPropertyChange) return null;
      
      // Handle both string values and dimension objects
      const isStringMode = typeof value === 'string';
      const dimensionValue = isStringMode ? { value: 100, unit: "%" } : (value || { value: 100, unit: "%" });
      const currentStringValue = isStringMode ? value : "custom";
      
      return (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          
          {/* Mode selector */}
          <div className="mb-2">
            <select
              value={currentStringValue}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  onPropertyChange(schema.key, { value: 100, unit: "%" });
                } else {
                  onPropertyChange(schema.key, e.target.value);
                }
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
            >
              <option value="fit-content">fit-content</option>
              <option value="max-content">max-content</option>
              <option value="min-content">min-content</option>
              <option value="auto">auto</option>
              <option value="custom">Custom Value</option>
            </select>
          </div>
          
          {/* Custom value inputs (only show when not in string mode) */}
          {!isStringMode && (
            <div className="flex gap-1">
              <input
                type="number"
                value={dimensionValue.value || 0}
                onChange={(e) =>
                  onPropertyChange(schema.key, {
                    ...dimensionValue,
                    value: Number(e.target.value)
                  })
                }
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
                min="0"
              />
              <select
                value={dimensionValue.unit || "%"}
                onChange={(e) =>
                  onPropertyChange(schema.key, {
                    ...dimensionValue,
                    unit: e.target.value
                  })
                }
                className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
              >
                <option value="px">px</option>
                <option value="%">%</option>
                <option value="em">em</option>
                <option value="rem">rem</option>
                <option value="vw">vw</option>
                <option value="vh">vh</option>
              </select>
            </div>
          )}
        </div>
      );

    case "dimensions":
      if (!schema.subKeys || !elementProperties || !onPropertyChange) return null;
      const dimensionLabels = ["Width", "Height"];
      return (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">{label}</label>
          <div className="grid grid-cols-2 gap-2">
            {schema.subKeys.map((subKey, index) => (
              <div key={subKey}>
                <label className="block text-xs text-gray-400 mb-1">{dimensionLabels[index]}</label>
                <input
                  type="number"
                  value={elementProperties[subKey] ?? 0}
                  onChange={(e) =>
                    onPropertyChange(subKey, Number(e.target.value))
                  }
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
                  min="0"
                  placeholder="px"
                />
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

interface PropertiesPanelProps {
  selectedElement: UIElement | null;
  onPropertyChange: (elementId: string, property: string, value: any) => void;
  onClose?: () => void;
  isChildElement?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onPropertyChange,
  onClose,
  isChildElement = false,
}) => {
  if (!selectedElement) {
    return (
      <div className="h-full bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex items-center justify-start">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            title="Hide Properties Panel"
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
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm">Select an element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const definition = elementRegistry[selectedElement.type];
  if (!definition) {
    return (
      <div className="h-full bg-gray-50 border-l border-gray-200 p-4">
        <div className="text-center text-red-500">
          <p className="text-sm">Unknown element type</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="p-2 border-b border-gray-200 flex items-center justify-start">
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Hide Properties Panel"
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
      </div>

      <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-1.5 mb-1">
          <definition.icon className="w-4 h-4 text-gray-600" />
          <h2 className="text-sm font-medium text-gray-800">
            {definition.name}
          </h2>
        </div>
        <p className="text-xs text-gray-500">ID: {selectedElement.id}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Properties</h3>

        {definition.propertySchema
          .filter((schema) => {
            // Hide horizontalAlign property for child elements inside containers
            if (isChildElement && schema.key === 'horizontalAlign') {
              return false;
            }
            return true;
          })
          .map((schema) => (
          <PropertyInput
            key={schema.key}
            schema={schema}
            value={selectedElement.properties[schema.key]}
            onChange={(value) =>
              onPropertyChange(selectedElement.id, schema.key, value)
            }
            elementProperties={selectedElement.properties}
            onPropertyChange={(key, value) =>
              onPropertyChange(selectedElement.id, key, value)
            }
          />
        ))}
      </div>
    </div>
  );
};
