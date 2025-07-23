import { useState, useCallback } from 'react';
import type { UIBuilderState, UIElement, ViewportType } from '../types/ui-builder';
import { createDefaultElement } from '../store/element-registry';

export const useUIBuilder = () => {
  const [state, setState] = useState<UIBuilderState>({
    elements: [],
    selectedElementId: null,
    viewport: 'phone',
    canvas: {
      zoom: 1,
      offset: { x: 0, y: 0 },
    },
  });

  const addElement = useCallback((type: string, insertIndex?: number) => {
    const newOrder = insertIndex !== undefined ? insertIndex : state.elements.length;
    const newElement = createDefaultElement(type, newOrder);
    if (!newElement) return;

    setState(prev => {
      const updatedElements = [...prev.elements];
      
      // Update orders of existing elements if inserting in the middle
      if (insertIndex !== undefined) {
        updatedElements.forEach(el => {
          if (el.order >= insertIndex) {
            el.order += 1;
          }
        });
      }
      
      updatedElements.push(newElement);
      updatedElements.sort((a, b) => a.order - b.order);
      
      return {
        ...prev,
        elements: updatedElements,
        selectedElementId: newElement.id,
      };
    });
  }, [state.elements.length]);

  const insertElementAfter = useCallback((type: string, afterElementId: string) => {
    setState(prev => {
      const afterElement = prev.elements.find(el => el.id === afterElementId);
      if (!afterElement) return prev;
      
      const insertOrder = afterElement.order + 1;
      const newElement = createDefaultElement(type, insertOrder);
      if (!newElement) return prev;

      const updatedElements = [...prev.elements];
      
      // Update orders of existing elements that come after the insert position
      updatedElements.forEach(el => {
        if (el.order >= insertOrder) {
          el.order += 1;
        }
      });
      
      updatedElements.push(newElement);
      updatedElements.sort((a, b) => a.order - b.order);
      
      return {
        ...prev,
        elements: updatedElements,
        selectedElementId: newElement.id,
      };
    });
  }, []);

  // Helper function to find a container recursively
  const findContainerRecursively = (elements: UIElement[], targetId: string): UIElement | null => {
    for (const element of elements) {
      if (element.id === targetId) {
        return element;
      }
      if (element.children) {
        const found = findContainerRecursively(element.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to update container recursively
  const updateContainerRecursively = (elements: UIElement[], targetId: string, newElement: UIElement, insertIndex?: number): UIElement[] => {
    return elements.map(element => {
      if (element.id === targetId) {
        const updatedChildren = [...(element.children || [])];
        
        // Update orders of existing children if inserting in the middle
        if (insertIndex !== undefined) {
          updatedChildren.forEach(child => {
            if (child.order >= insertIndex) {
              child.order += 1;
            }
          });
        }
        
        updatedChildren.push(newElement);
        updatedChildren.sort((a, b) => a.order - b.order);
        
        return {
          ...element,
          children: updatedChildren,
        };
      }
      
      if (element.children) {
        return {
          ...element,
          children: updateContainerRecursively(element.children, targetId, newElement, insertIndex),
        };
      }
      
      return element;
    });
  };

  const addElementToContainer = useCallback((type: string, containerId: string, insertIndex?: number) => {
    setState(prev => {
      const container = findContainerRecursively(prev.elements, containerId);
      if (!container) return prev;
      
      const newElement = createDefaultElement(type, 0);
      if (!newElement) return prev;
      
      // Set order based on insert position or existing children
      const targetIndex = insertIndex !== undefined ? insertIndex : (container.children ? container.children.length : 0);
      newElement.order = targetIndex;

      const updatedElements = updateContainerRecursively(prev.elements, containerId, newElement, insertIndex);
      
      return {
        ...prev,
        elements: updatedElements,
        selectedElementId: newElement.id,
      };
    });
  }, []);

  const selectElement = useCallback((elementId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedElementId: elementId,
    }));
  }, []);

  // Helper function to update element property recursively
  const updateElementPropertyRecursively = (elements: UIElement[], targetId: string, property: string, value: any): UIElement[] => {
    return elements.map(element => {
      if (element.id === targetId) {
        const updatedElement = { ...element };
        updatedElement.properties = { ...updatedElement.properties, [property]: value };
        return updatedElement;
      }
      
      if (element.children) {
        return {
          ...element,
          children: updateElementPropertyRecursively(element.children, targetId, property, value),
        };
      }
      
      return element;
    });
  };

  const updateElementProperty = useCallback((elementId: string, property: string, value: any) => {
    setState(prev => ({
      ...prev,
      elements: updateElementPropertyRecursively(prev.elements, elementId, property, value),
    }));
  }, []);


  const setViewport = useCallback((viewport: ViewportType) => {
    setState(prev => ({
      ...prev,
      viewport,
    }));
  }, []);

  // Helper function to remove element recursively
  const removeElementRecursively = (elements: UIElement[], targetId: string): { elements: UIElement[]; found: boolean } => {
    let found = false;
    
    const updatedElements = elements.filter(element => {
      if (element.id === targetId) {
        found = true;
        return false; // Remove this element
      }
      return true;
    }).map(element => {
      if (element.children) {
        const result = removeElementRecursively(element.children, targetId);
        if (result.found) {
          found = true;
          // Update order of remaining children
          const updatedChildren = result.elements;
          updatedChildren.forEach((child, index) => {
            child.order = index;
          });
          return { ...element, children: updatedChildren };
        }
      }
      return element;
    });
    
    // Update orders of remaining elements at this level if we removed one
    if (found && updatedElements.length > 0) {
      updatedElements.forEach((element, index) => {
        element.order = index;
      });
    }
    
    return { elements: updatedElements, found };
  };

  const removeElement = useCallback((elementId: string) => {
    setState(prev => {
      const result = removeElementRecursively(prev.elements, elementId);
      
      if (!result.found) return prev;
      
      return {
        ...prev,
        elements: result.elements,
        selectedElementId: prev.selectedElementId === elementId ? null : prev.selectedElementId,
      };
    });
  }, []);

  const reorderElementToIndex = useCallback((elementId: string, newIndex: number, containerId?: string) => {
    setState(prev => {
      if (containerId === "device-card") {
        // Reordering in main device card
        const elementIndex = prev.elements.findIndex(el => el.id === elementId);
        if (elementIndex === -1) return prev;
        
        const updatedElements = [...prev.elements];
        const [movedElement] = updatedElements.splice(elementIndex, 1);
        
        // Insert at new position
        const insertIndex = Math.min(newIndex, updatedElements.length);
        updatedElements.splice(insertIndex, 0, movedElement);
        
        // Update order values
        updatedElements.forEach((el, index) => {
          el.order = index;
        });
        
        return {
          ...prev,
          elements: updatedElements,
        };
      }
      
      return prev;
    });
  }, []);

  const reorderElements = useCallback((activeId: string, overId: string) => {
    setState(prev => {
      // First check if both elements are in top-level
      const oldIndex = prev.elements.findIndex(el => el.id === activeId);
      const newIndex = prev.elements.findIndex(el => el.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Both are top-level elements
        const updatedElements = [...prev.elements];
        const [movedElement] = updatedElements.splice(oldIndex, 1);
        updatedElements.splice(newIndex, 0, movedElement);
        
        // Update order values
        updatedElements.forEach((el, index) => {
          el.order = index;
        });
        
        return {
          ...prev,
          elements: updatedElements,
        };
      }
      
      // Check if both elements are children of the same container
      for (const container of prev.elements) {
        if (container.children) {
          const activeChildIndex = container.children.findIndex(child => child.id === activeId);
          const overChildIndex = container.children.findIndex(child => child.id === overId);
          
          if (activeChildIndex !== -1 && overChildIndex !== -1) {
            // Both are children of the same container
            const updatedElements = prev.elements.map(element => {
              if (element.id === container.id) {
                const updatedChildren = [...element.children!];
                const [movedChild] = updatedChildren.splice(activeChildIndex, 1);
                updatedChildren.splice(overChildIndex, 0, movedChild);
                
                // Update order values for children
                updatedChildren.forEach((child, index) => {
                  child.order = index;
                });
                
                return { ...element, children: updatedChildren };
              }
              return element;
            });
            
            return {
              ...prev,
              elements: updatedElements,
            };
          }
        }
      }
      
      return prev;
    });
  }, []);

  const getSelectedElement = useCallback((): UIElement | null => {
    if (!state.selectedElementId) return null;
    
    return findContainerRecursively(state.elements, state.selectedElementId);
  }, [state.selectedElementId, state.elements]);

  const isChildElement = useCallback((elementId: string): boolean => {
    // Check if element is a child of any container at any level
    const checkIsChild = (elements: UIElement[], targetId: string): boolean => {
      for (const element of elements) {
        if (element.children) {
          // If we find the target in this element's children, it's a child
          if (element.children.some(child => child.id === targetId)) {
            return true;
          }
          // Recursively check nested children
          if (checkIsChild(element.children, targetId)) {
            return true;
          }
        }
      }
      return false;
    };
    
    return checkIsChild(state.elements, elementId);
  }, [state.elements]);

  return {
    elements: state.elements,
    selectedElementId: state.selectedElementId,
    selectedElement: getSelectedElement(),
    viewport: state.viewport,
    canvas: state.canvas,
    addElement,
    insertElementAfter,
    addElementToContainer,
    selectElement,
    updateElementProperty,
    setViewport,
    removeElement,
    reorderElements,
    reorderElementToIndex,
    isChildElement,
  };
};