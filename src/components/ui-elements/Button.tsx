import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
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

export const Button: React.FC<ButtonProps> = ({
  text = 'Button',
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
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
  const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  
  const processedWidth: string = typeof width === 'object' && width?.value !== undefined ? `${width.value}${width.unit}` : 
                                   typeof width === 'number' ? `${width}px` : (width as string) || '100%';
  const processedHeight: string = typeof height === 'object' && height?.value !== undefined ? `${height.value}${height.unit}` : 
                                  typeof height === 'number' ? `${height}px` : (height as string) || 'fit-content';

  const buttonStyle = {
    paddingTop: `${paddingTop}px`,
    paddingRight: `${paddingRight}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    width: processedWidth,
    height: processedHeight,
    alignSelf: horizontalAlign === 'left' ? 'flex-start' : 
               horizontalAlign === 'center' ? 'center' :
               horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      style={{
        ...buttonStyle, 
        ...(style && typeof style === 'object' ? Object.fromEntries(
          Object.entries(style).filter(([, val]) => 
            typeof val === 'string' || typeof val === 'number'
          )
        ) : {})
      }}
    >
      {text}
    </button>
  );
};