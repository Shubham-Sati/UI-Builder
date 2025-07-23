import React from 'react';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
  src?: string;
  alt?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
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

export const Image: React.FC<ImageProps> = ({
  src = 'https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=Image',
  alt = 'Placeholder image',
  objectFit = 'cover',
  borderRadius = 'md',
  className = '',
  paddingTop = 0,
  paddingRight = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  width = { value: 300, unit: "px" },
  height = "fit-content",
  horizontalAlign = 'left',
  style,
  ...props
}) => {
  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };
  
  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  const imageStyle = {
    paddingTop: `${paddingTop}px`,
    paddingRight: `${paddingRight}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    width: typeof width === 'object' && width?.value !== undefined ? `${width.value}${width.unit}` : 
           typeof width === 'number' ? `${width}px` : (width as string) || '300px',
    height: typeof height === 'object' && height?.value !== undefined ? `${height.value}${height.unit}` : 
            typeof height === 'number' ? `${height}px` : (height as string) || '200px',
    alignSelf: horizontalAlign === 'left' ? 'flex-start' : 
               horizontalAlign === 'center' ? 'center' :
               horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
  };

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={`${objectFitClasses[objectFit]} ${borderRadiusClasses[borderRadius]} ${className}`}
      style={{...imageStyle, ...style}}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = 'https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=Image+Not+Found';
      }}
      width={undefined}
      height={undefined}
    />
  );
};