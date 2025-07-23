# 🎨 UI Builder

<div align="center">

A **powerful**, **modern** React-based drag-and-drop UI builder with advanced responsive design capabilities, real-time preview, and intelligent auto-positioning.

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

### 🧠 **Smart Features**
- **🎯 Auto-Centering** - Intelligent device positioning that adapts to any screen size
- **🔍 Smart Zoom** - Automatic optimal zoom calculation based on viewport dimensions  
- **📏 Responsive Positioning** - Elements maintain perfect positioning across all device types
- **🎪 Drop Zone Indicators** - Visual guides appear only during active dragging
- **📱 Realistic Device Frames** - iPhone notch, status bars, and authentic device bezels
- **🔄 Auto-Scroll Navigation** - Smart scrolling between canvas and element palette

### 🛠️ **Developer Experience**
- **⚙️ Element Registry System** - Extensible architecture for adding custom elements
- **🔧 TypeScript First** - Full type safety and IntelliSense support
- **📦 Component Library** - 7+ pre-built, customizable UI elements
- **🎨 Theming System** - Consistent design system with Tailwind CSS
- **🔌 Plugin Architecture** - Easy to extend with new elements and features

---

## 📱 Available Elements

### **Interactive Components**
- **🔲 Button** - 3 variants (Primary, Secondary, Danger) with multiple sizes
- **📝 Input** - Text, Email, Password, Number types with labels and validation

### **Layout Components**  
- **📦 Container** - Flexbox layouts with justification, alignment, and gap controls
- **🖼️ Image** - Smart image handling with object-fit options and error fallbacks

### **Typography Components**
- **📄 Headings (H1-H4)** - Semantic headings with typography controls
- **📝 Paragraph** - Rich text with alignment, sizing, and line-height options

### **Element Properties**
Each element supports **comprehensive styling**:
- 📏 **Dimensions** - Width, Height, Auto-sizing
- 📐 **Spacing** - Margin, Padding (individual or grouped)  
- 🎨 **Styling** - Colors, Borders, Typography
- 📱 **Responsive** - Device-specific positioning and sizing
- ⚡ **Accessibility** - ARIA attributes, semantic HTML

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
2. **✏️ Customize** - Click any element to edit properties in the right panel  
3. **📱 Preview** - Switch between Phone/Tablet/Laptop views using viewport buttons
4. **👀 Test** - Click "Preview" for full-screen, realistic device preview
5. **💾 Export** - Save your design as JSON for reuse or deployment

---

## 📖 Documentation

### **🏗️ Project Structure**

```
src/
├── 🧩 components/
│   ├── ui-builder/              # Main builder components
│   │   ├── Canvas/              # 🖼️ Drag-drop canvas with smart positioning  
│   │   │   ├── InfiniteCanvas.tsx    # Auto-centering, smart zoom
│   │   │   ├── DeviceCard.tsx        # Realistic device frames
│   │   │   └── DropZone.tsx          # Visual drop indicators
│   │   ├── ElementPalette/      # 🎨 Element library & used elements
│   │   ├── PropertiesPanel/     # ⚙️ Real-time property editor
│   │   └── UIBuilder.tsx        # 🎮 Main orchestrator component
│   └── ui-elements/             # 📦 Reusable UI components
│       ├── Button.tsx           # Interactive button component  
│       ├── Input.tsx            # Form input with validation
│       ├── Container.tsx        # Layout container with flexbox
│       ├── Heading.tsx          # H1-H4 semantic headings
│       ├── Paragraph.tsx        # Rich text component
│       └── Image.tsx            # Smart image component
├── 🎣 hooks/
│   └── useUIBuilder.ts          # 🧠 State management hook
├── 🏪 store/  
│   └── element-registry.ts      # 📋 Element definitions & configs
├── 🎭 rendering-engine/
│   └── RenderingEngine.tsx      # 🚀 Preview & JSON renderer  
├── 📝 types/
│   └── ui-builder.ts            # 🔧 TypeScript definitions
└── 🎨 styles/                   # Global styles & themes
```

### **🔧 Smart Canvas Features**

#### **Auto-Centering & Smart Zoom**
The canvas automatically:
- 📐 **Calculates optimal zoom** based on screen size and device dimensions
- 🎯 **Centers devices perfectly** regardless of viewport changes
- 🔄 **Adapts to window resizing** maintaining optimal view
- 📱 **Handles device switching** (Phone ↔ Tablet ↔ Laptop) seamlessly

#### **Realistic Device Preview**
- **iPhone 12 Pro** (390×844) with authentic notch and status bar
- **iPad Air** (820×1180) with proper aspect ratio and bezels
- **MacBook Pro 13"** (1280×800) with laptop-style frame
- **Chrome DevTools styling** with dark backgrounds and device labels

#### **Intelligent Interactions**
- **Smart Scrolling** - Content scrolls inside devices, zoom controls outside
- **Context-Aware Drop Zones** - Only appear during active dragging
- **Auto-Scroll Navigation** - Selecting elements automatically scrolls them into view
- **Collision-Free Positioning** - Elements maintain perfect positioning across zoom levels

### **🎨 Adding Custom Elements**

#### **1. Create Component**
```typescript
// src/components/ui-elements/CustomElement.tsx
import React from 'react';

interface CustomElementProps {
  text: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
}

export const CustomElement: React.FC<CustomElementProps> = ({ 
  text, 
  color, 
  size 
}) => {
  return (
    <div 
      className={`custom-element ${size}`}
      style={{ color }}
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
    icon: '⭐',
    defaultProps: {
      text: 'Custom Element',
      color: '#3B82F6',
      size: 'md',
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
        options: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
        defaultValue: 'md',
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
      "id": "element_123",
      "type": "button", 
      "order": 0,
      "properties": {
        "text": "Click Me",
        "variant": "primary",
        "size": "md",
        "disabled": false
      },
      "wrapperProperties": {
        "width": 200,
        "height": 44,
        "backgroundColor": "transparent",
        "justifyContent": "center",
        "alignItems": "center"
      },
      "responsive": {
        "phone": { "visible": true },
        "tablet": { "visible": true }, 
        "laptop": { "visible": true }
      }
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
- **🖱️ @dnd-kit** - Modern drag-and-drop library
- **🎪 Lucide React** - Beautiful, customizable icons

### **Architecture**
- **🏗️ Component-Based** - Modular, reusable architecture
- **🧠 Custom Hooks** - Centralized state management
- **📦 Element Registry** - Plugin-like element system
- **🎭 Rendering Engine** - Separate preview/export system

---

## 🎯 Advanced Features

### **🧠 Smart Auto-Positioning**
- **Automatic centering** for any screen size or device type
- **Optimal zoom calculation** based on available viewport space  
- **Responsive to window resizing** with real-time adjustments
- **Future-proof** - works with any new device dimensions

### **📱 Realistic Device Preview**
- **Authentic device frames** with proper bezels and shadows
- **iPhone-style notch** with speaker grille detail
- **Status bars** showing time, signal, and battery
- **Dark theme** matching Chrome DevTools aesthetic

### **⚡ Performance Optimizations**
- **Smart re-rendering** with React.memo and useCallback
- **Optimized drag operations** with minimal re-renders
- **Efficient scroll handling** with requestAnimationFrame
- **Memory management** with proper cleanup

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