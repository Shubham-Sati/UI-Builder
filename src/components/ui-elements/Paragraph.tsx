import React from 'react';

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose';
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

export const Paragraph: React.FC<ParagraphProps> = ({
  text = 'This is a paragraph. You can edit this text to add your content.',
  color = '#374151',
  textAlign = 'left',
  fontSize = 'base',
  fontWeight = 'normal',
  lineHeight = 'normal',
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
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
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
    justify: 'text-justify',
  };
  
  const lineHeightClasses = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  };
  
  const paragraphStyle = {
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
    maxWidth: '100%',
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const,
    whiteSpace: 'normal' as const,
  };

  return (
    <p
      {...props}
      className={`${sizeClasses[fontSize]} ${weightClasses[fontWeight]} ${alignClasses[textAlign]} ${lineHeightClasses[lineHeight]} ${className}`}
      style={{...paragraphStyle, ...style}}
    >
      {text}
    </p>
  );
};