# 🎨 UI Builder

<div align="center">

A **powerful**, **modern** React-based drag-and-drop UI builder with advanced responsive design capabilities, real-time preview, intelligent nested containers, and flexible dimension controls.

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)

[✨ Features](#features) • [🚀 Quick Start](#quick-start) • [📖 Documentation](#documentation) • [🛠️ Tech Stack](#tech-stack)

</div>

---

## ✨ Features

### 🎯 **Core Functionality**
- **🖱️ Drag & Drop Interface** - Intuitive drag-and-drop from element palette to canvas
- **📱 Multi-Device Preview** - Real-time responsive design for Phone, Tablet, and Laptop
- **🎨 Visual Editor** - Live property editing with instant visual feedback  
- **📤 JSON Export/Import** - Export designs as reusable JSON configurations
- **🔍 Full Preview Mode** - Chrome DevTools-style device preview with realistic frames
- **⚡ Real-time Updates** - Instant visual feedback for all property changes

### 🧠 **Smart Layout Features**
- **📦 Unlimited Nested Containers** - Build complex layouts with containers inside containers
- **🎯 Smart Alignment System** - Container controls child alignment, elements can override when needed
- **📏 Flexible Dimensions** - CSS values (fit-content, max-content, min-content) + custom units (px, %, em, rem, vw, vh)
- **🎪 Context-Aware Drop Zones** - Visual guides appear only during active dragging
- **📱 Responsive Height System** - All elements default to fit-content for cross-device compatibility
- **🔄 Dynamic Element Reordering** - Drag elements within containers or between containers

### 🛠️ **Advanced UI System**
- **⚙️ Element Registry System** - Extensible architecture for adding custom elements
- **🔧 TypeScript First** - Full type safety and IntelliSense support
- **📦 Component Library** - 8+ pre-built, customizable UI elements
- **🎨 Consistent Property System** - 4-column spacing controls and dimension controls across all elements
- **🔌 Plugin Architecture** - Easy to extend with new elements and features

---

## 📱 Available Elements

### **Interactive Components**
- **🔲 Button** - 4 variants (Primary, Secondary, Danger, Outline) with multiple sizes
- **📝 Input** - Text, Email, Password, Number types with labels and validation

### **Layout Components**  
- **📦 Container** - Flexbox layouts with unlimited nesting, justification, alignment, and gap controls
- **🖼️ Image** - Smart image handling with object-fit options and error fallbacks

### **Typography Components**
- **📄 Headings (H1-H4)** - Semantic headings with typography controls
- **📝 Paragraph** - Rich text with alignment, sizing, and line-height options

### **Universal Element Properties**
Each element supports **comprehensive styling**:

#### **📏 Flexible Dimensions**
- **Width/Height Controls** with multiple options:
  - **CSS Values**: `fit-content`, `max-content`, `min-content`, `auto`
  - **Custom Units**: `px`, `%`, `em`, `rem`, `vw`, `vh`
  - **Smart Defaults**: All elements default to `fit-content` height for responsive design

#### **📐 Precise Spacing**
- **4-Column Grid UI** for padding/margin controls (Top, Right, Bottom, Left)
- **Individual Direction Control** - Set each direction independently
- **Consistent Interface** - Same spacing UI across all elements

#### **🎯 Smart Alignment**
- **Container-Level Control** - Containers manage child alignment with `alignItems` and `justifyContent`
- **Element-Level Override** - Individual elements can override alignment when needed
- **Context-Aware Properties** - Alignment options hidden for child elements inside containers

#### **🎨 Visual Styling**
- **Colors** - Background colors (automatically excluded for buttons to preserve styling)
- **Typography** - Font weight, size, alignment, line height
- **Responsive** - Device-specific positioning and sizing

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm, yarn, or pnpm

### **Installation**

```bash
# Clone the repository
git clone <your-repo-url>
cd UI-Builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Usage**

1. **🎨 Design** - Drag elements from the left palette to the center canvas
2. **📦 Build Layouts** - Use containers to create complex nested layouts (like website footers)
3. **✏️ Customize** - Click any element to edit properties in the right panel  
4. **📏 Control Dimensions** - Choose between CSS values or custom units for width/height
5. **📱 Preview** - Switch between Phone/Tablet/Laptop views using viewport buttons
6. **👀 Test** - Click "Preview" for full-screen, realistic device preview
7. **💾 Export** - Save your design as JSON for reuse or deployment

---

## 📖 Documentation

### **🏗️ Project Structure**

```
src/
├── 🧩 components/
│   ├── ui-builder/              # Main builder components
│   │   ├── Canvas/              # 🖼️ Drag-drop canvas with smart positioning  
│   │   │   ├── DeviceCard.tsx        # Realistic device frames + element rendering
│   │   │   └── DropZone.tsx          # Visual drop indicators
│   │   ├── ElementPalette/      # 🎨 Element library & used elements
│   │   ├── PropertiesPanel/     # ⚙️ Real-time property editor with dimension controls
│   │   └── UIBuilder.tsx        # 🎮 Main orchestrator component
│   └── ui-elements/             # 📦 Reusable UI components
│       ├── Button.tsx           # Interactive button component  
│       ├── Input.tsx            # Form input with validation
│       ├── Container.tsx        # Layout container with flexbox + nesting
│       ├── Heading.tsx          # H1-H4 semantic headings
│       ├── Paragraph.tsx        # Rich text component
│       └── Image.tsx            # Smart image component
├── 🎣 hooks/
│   └── useUIBuilder.ts          # 🧠 State management with nested container support
├── 🏪 store/  
│   └── element-registry.ts      # 📋 Element definitions with dimension & spacing controls
├── 🎭 rendering-engine/
│   └── RenderingEngine.tsx      # 🚀 Preview & JSON renderer with button visibility fixes
├── 📝 types/
│   └── ui-builder.ts            # 🔧 TypeScript definitions
└── 🎨 styles/                   # Global styles & themes
```

### **🔧 Smart Layout System**

#### **📦 Unlimited Nested Containers**
Build complex layouts like website footers:
```
Parent Container (Row Layout)
├── Logo Container (Column Layout)
│   ├── Logo Image
│   └── Company Name Heading
├── Links Container (Column Layout)  
│   ├── Link Heading
│   ├── Link Paragraph 1
│   └── Link Paragraph 2
└── Contact Container (Column Layout)
    ├── Contact Heading
    └── Contact Information
```

#### **🎯 Intelligent Alignment System**
- **Container Priority**: When elements are inside containers, the container's `alignItems` and `justifyContent` control alignment
- **Element Override**: Elements can still override alignment by explicitly setting their alignment property to non-default values
- **Context-Aware UI**: Alignment properties are hidden in Properties Panel for child elements to avoid confusion

#### **📏 Flexible Dimension System**
Each element's width/height can be set using:

**CSS Intrinsic Values:**
- `fit-content` - Size based on content (default for all elements)
- `max-content` - Maximum content size
- `min-content` - Minimum content size  
- `auto` - Browser default

**Custom Values with Units:**
- `px` - Pixels (absolute)
- `%` - Percentage (relative to parent)
- `em` - Relative to element's font size
- `rem` - Relative to root font size
- `vw` - Viewport width percentage
- `vh` - Viewport height percentage

#### **📐 Precise Spacing Control**
- **4-Column Grid Interface** for padding/margin
- **Individual Direction Control** (Top, Right, Bottom, Left)
- **Consistent Across Elements** - Same interface for all elements

### **🎨 Adding Custom Elements**

#### **1. Create Component**
```typescript
// src/components/ui-elements/CustomElement.tsx
import React from 'react';

interface CustomElementProps {
  text: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
  // Dimension support
  width?: { value: number; unit: string } | string | number;
  height?: { value: number; unit: string } | string | number;
  // Spacing support
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  // Alignment support
  horizontalAlign?: 'left' | 'center' | 'right';
}

export const CustomElement: React.FC<CustomElementProps> = ({ 
  text, 
  color, 
  size,
  width = "fit-content",
  height = "fit-content",
  paddingTop = 0,
  paddingRight = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  horizontalAlign = 'left',
  ...props
}) => {
  // Process dimension values
  const processedWidth = typeof width === 'object' && width?.value !== undefined 
    ? `${width.value}${width.unit}` 
    : typeof width === 'number' ? `${width}px` : (width as string);
  
  const elementStyle = {
    width: processedWidth,
    height: typeof height === 'object' && height?.value !== undefined 
      ? `${height.value}${height.unit}` 
      : typeof height === 'number' ? `${height}px` : (height as string),
    paddingTop: `${paddingTop}px`,
    paddingRight: `${paddingRight}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    alignSelf: horizontalAlign === 'left' ? 'flex-start' : 
               horizontalAlign === 'center' ? 'center' :
               horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
    color,
  };

  return (
    <div 
      {...props}
      className={`custom-element ${size}`}
      style={elementStyle}
    >
      {text}
    </div>
  );
};
```

#### **2. Register Element**
```typescript
// src/store/element-registry.ts
import { CustomElement } from '../components/ui-elements/CustomElement';

export const elementRegistry = {
  // ... existing elements
  customElement: {
    type: 'customElement',
    name: 'Custom Element',
    icon: Star, // Lucide React icon
    defaultProps: {
      text: 'Custom Element',
      color: '#3B82F6',
      size: 'md',
      width: "fit-content",
      height: "fit-content",
      horizontalAlign: "left",
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
    },
    propertySchema: [
      {
        key: 'text',
        label: 'Text Content',
        type: 'text',
        defaultValue: 'Custom Element',
      },
      {
        key: 'color', 
        label: 'Text Color',
        type: 'color',
        defaultValue: '#3B82F6',
      },
      {
        key: 'size',
        label: 'Size',
        type: 'select',
        options: ['sm', 'md', 'lg'],
        defaultValue: 'md',
      },
      // Universal dimension properties
      {
        key: 'width',
        label: 'Width',
        type: 'dimension',
        defaultValue: 'fit-content',
      },
      {
        key: 'height',
        label: 'Height',
        type: 'dimension', 
        defaultValue: 'fit-content',
      },
      // Universal alignment property
      {
        key: 'horizontalAlign',
        label: 'Alignment',
        type: 'select',
        options: ['left', 'center', 'right'],
        defaultValue: 'left',
      },
      // Universal spacing properties
      {
        key: 'padding',
        label: 'Padding',
        type: 'spacing',
        subKeys: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        defaultValue: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      {
        key: 'margin',
        label: 'Margin',
        type: 'spacing',
        subKeys: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
        defaultValue: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    ],
    component: CustomElement,
  },
};
```

### **📤 JSON Export Structure**

```typescript
{
  "version": "1.0.0",
  "elements": [
    {
      "id": "button_123",
      "type": "button", 
      "order": 0,
      "properties": {
        "text": "Click Me",
        "variant": "primary",
        "size": "md",
        "width": { "value": 200, "unit": "px" },
        "height": "fit-content",
        "horizontalAlign": "center",
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 8,
        "marginLeft": 0
      },
      "children": []
    },
    {
      "id": "container_456",
      "type": "container",
      "order": 1,
      "properties": {
        "flexDirection": "row",
        "justifyContent": "center",
        "alignItems": "center",
        "gap": 16,
        "width": "100%",
        "height": "fit-content",
        "backgroundColor": "#f3f4f6"
      },
      "children": [
        {
          "id": "image_789",
          "type": "image",
          "order": 0,
          "properties": {
            "src": "https://example.com/image.jpg",
            "alt": "Example Image",
            "width": { "value": 100, "unit": "px" },
            "height": "fit-content"
          },
          "children": []
        }
      ]
    }
  ],
  "metadata": {
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z", 
    "viewport": "phone"
  }
}
```

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **⚛️ React 19** - Latest React with improved performance
- **📘 TypeScript 5.8** - Full type safety and developer experience  
- **⚡ Vite 7** - Lightning-fast build tool and dev server

### **UI & Styling**
- **🎨 Tailwind CSS 4.1** - Utility-first CSS framework
- **🖱️ @dnd-kit** - Modern drag-and-drop library with nested container support
- **🎪 Lucide React** - Beautiful, customizable icons

### **Architecture**
- **🏗️ Component-Based** - Modular, reusable architecture
- **🧠 Custom Hooks** - Centralized state management with nested container operations
- **📦 Element Registry** - Plugin-like element system with universal properties
- **🎭 Rendering Engine** - Separate preview/export system with dimension object support

---

## 🎯 Advanced Features

### **📦 Advanced Layout System**
- **Unlimited Container Nesting** - Build complex layouts like website headers, footers, and sidebars
- **Smart Drop Zone Management** - Drop zones only appear during dragging to keep UI clean
- **Context-Aware Properties** - Element alignment properties hidden when inside containers
- **Recursive Element Operations** - Full support for finding, updating, and reordering nested elements

### **📏 Flexible Dimension Controls**
- **CSS Intrinsic Values** - fit-content, max-content, min-content for responsive design
- **Multiple Unit Support** - px, %, em, rem, vw, vh for precise control
- **Smart Defaults** - All elements default to fit-content height for cross-device compatibility
- **Mixed Value Types** - Support both dimension objects and string values

### **🎯 Intelligent Alignment System**
- **Container-First Approach** - Containers control child alignment by default
- **Override Capability** - Elements can still override when explicitly set
- **Clean UI Experience** - No confusing properties that don't work

### **⚡ Performance Optimizations**
- **Smart Re-rendering** - Only update affected elements during property changes
- **Optimized Drag Operations** - Minimal re-renders during drag operations
- **Context-Aware Rendering** - Different styling logic for child vs top-level elements
- **Memory Management** - Proper cleanup of event listeners and subscriptions

---

## 🚧 Development

### **Available Scripts**

```bash
npm run dev      # Start development server  
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### **Development Features**
- **🔥 Hot Module Replacement** - Instant updates during development
- **📊 TypeScript Checking** - Real-time type validation  
- **🎨 Tailwind IntelliSense** - Auto-completion for CSS classes
- **🔍 ESLint Integration** - Code quality and consistency

### **Recent Improvements**
- **✅ Removed Button Disabled State** - Cleaner button interface without unnecessary disabled property
- **✅ Universal Fit-Content Heights** - All elements now default to responsive heights
- **✅ Enhanced Dimension Controls** - Support for CSS values and multiple units
- **✅ Fixed Preview Panel Button Visibility** - Buttons now display correctly in preview mode
- **✅ Smart Container Alignment** - Container properties no longer get overridden by child elements

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)  
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

- **📧 Issues** - [GitHub Issues](../../issues)
- **💬 Discussions** - [GitHub Discussions](../../discussions)
- **📚 Documentation** - Check the `/docs` folder for detailed guides

---

<div align="center">

**Built with ❤️ using React, TypeScript, and modern web technologies**

[⭐ Star this repo](../../stargazers) • [🐛 Report Bug](../../issues) • [💡 Request Feature](../../issues)

</div>