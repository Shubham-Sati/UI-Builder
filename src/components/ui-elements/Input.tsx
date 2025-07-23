import React from "react";

interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  width?: { value: number; unit: string } | string | number;
  height?: { value: number; unit: string } | string | number;
  horizontalAlign?: 'left' | 'center' | 'right';
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value = "",
  label = "",
  required = false,
  disabled = false,
  size = "md",
  onChange,
  className = "",
  paddingTop = 0,
  paddingRight = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  width = { value: 100, unit: "%" },
  height = "fit-content",
  horizontalAlign = 'left',
  style,
  ...props
}) => {
  const baseClasses =
    "border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const disabledClasses = disabled
    ? "bg-gray-100 cursor-not-allowed"
    : "bg-white";

  const containerStyle = {
    paddingTop: `${paddingTop}px`,
    paddingRight: `${paddingRight}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    width: typeof width === 'object' && width?.value !== undefined ? `${width.value}${width.unit}` : 
           typeof width === 'number' ? `${width}px` : (width as string) || '100%',
    height: typeof height === 'object' && height?.value !== undefined ? `${height.value}${height.unit}` : 
            typeof height === 'number' ? `${height}px` : (height as string) || 'fit-content',
    alignSelf: horizontalAlign === 'left' ? 'flex-start' : 
               horizontalAlign === 'center' ? 'center' :
               horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
  };

  return (
    <div 
      {...props}
      className={`flex flex-col space-y-1 ${className || ''}`}
      style={{...containerStyle, ...style}}
    >
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className={`${baseClasses} ${sizeClasses[size]} ${disabledClasses}`}
      />
    </div>
  );
};
