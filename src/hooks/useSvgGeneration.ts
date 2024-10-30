import { useState, useCallback } from 'react';
import { ProcessNode } from '../types/svg';
import { SvgService } from '../services/svgService';

export function useSvgGeneration() {
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSvg = useCallback(async (nodes: ProcessNode[]) => {
    try {
      setIsGenerating(true);
      setError(null);

      const svgService = new SvgService(nodes);
      const generatedSvg = svgService.generateSvg(nodes);
      setSvg(generatedSvg);

      return generatedSvg;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate SVG';
      setError(message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadSvg = useCallback(() => {
    if (!svg) return;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'process-flow.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [svg]);

  const downloadPng = useCallback(() => {
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Failed to create canvas context');
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = 'process-flow.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    img.src = URL.createObjectURL(blob);
  }, [svg]);

  return {
    svg,
    error,
    isGenerating,
    generateSvg,
    downloadSvg,
    downloadPng
  };
}