import { useState, useCallback, useRef } from 'react';

interface InteractiveSvgState {
  scale: number;
  position: { x: number; y: number };
  isDragging: boolean;
}

export function useInteractiveSvg(initialScale = 1) {
  const [state, setState] = useState<InteractiveSvgState>({
    scale: initialScale,
    position: { x: 0, y: 0 },
    isDragging: false
  });

  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleZoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.1, 2)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.5)
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setState(prev => ({ ...prev, isDragging: true }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.isDragging) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    setState(prev => ({
      ...prev,
      position: {
        x: prev.position.x + dx,
        y: prev.position.y + dy
      }
    }));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [state.isDragging]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    setState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale * scaleFactor))
    }));
  }, []);

  const resetView = useCallback(() => {
    setState({
      scale: initialScale,
      position: { x: 0, y: 0 },
      isDragging: false
    });
  }, [initialScale]);

  return {
    ...state,
    handleZoomIn,
    handleZoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetView
  };
}