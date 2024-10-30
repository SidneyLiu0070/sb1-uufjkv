import React, { useEffect, useRef } from 'react';
import { ReadonlySvgViewerProps } from '../../types/analysis';
import { useInteractiveSvg } from '../../hooks/useInteractiveSvg';
import Toolbar from './Toolbar';
import ChatPanel from './ChatPanel';

const SvgViewer: React.FC<ReadonlySvgViewerProps> = ({
  content,
  onDownloadSvg,
  onDownloadPng
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    scale,
    position,
    handleZoomIn,
    handleZoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetView
  } = useInteractiveSvg();

  useEffect(() => {
    if (!content || !containerRef.current) return;

    // Clear container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Create a wrapper div for the SVG content
    const wrapper = document.createElement('div');
    wrapper.innerHTML = content;
    const svgElement = wrapper.querySelector('svg');
    
    if (svgElement) {
      // Set viewBox if not already set
      if (!svgElement.getAttribute('viewBox')) {
        const width = svgElement.getAttribute('width') || '800';
        const height = svgElement.getAttribute('height') || '600';
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }
      
      // Make SVG responsive
      svgElement.style.width = '100%';
      svgElement.style.height = '100%';
      
      containerRef.current.appendChild(svgElement);
    }
  }, [content]);

  const transformStyle = {
    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
    transformOrigin: 'center',
    transition: 'transform 0.1s ease-out'
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm relative">
      <Toolbar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onDownloadSvg={onDownloadSvg}
        onDownloadPng={onDownloadPng}
        onResetView={resetView}
      />
      
      <div
        className="flex-1 overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={transformStyle}
        />
      </div>

      <ChatPanel />
    </div>
  );
};

export default SvgViewer;