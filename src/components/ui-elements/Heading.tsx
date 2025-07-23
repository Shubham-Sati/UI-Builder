import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string;
  level?: 1 | 2 | 3 | 4;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
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

export const Heading: React.FC<HeadingProps> = ({
  text = 'Heading',
  level = 1,
  color = '#1f2937',
  textAlign = 'left',
  fontWeight = 'bold',
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
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  
  const levelClasses = {
    1: 'text-4xl',
    2: 'text-3xl', 
    3: 'text-2xl',
    4: 'text-xl',
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium', 
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  const headingStyle = {
    color,
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
    <Tag
      {...props}
      className={`${levelClasses[level]} ${weightClasses[fontWeight]} ${alignClasses[textAlign]} ${className}`}
      style={{...headingStyle, ...style}}
    >
      {text}
    </Tag>
  );
};