import DOMPurify from 'dompurify';
import { CONTENT_SECURITY } from './security';

export function sanitizeMarkdown(content: string): string {
  return DOMPurify.sanitize(content, CONTENT_SECURITY.SANITIZE_OPTIONS);
}

export function sanitizeSvg(svgContent: string): string {
  return DOMPurify.sanitize(svgContent, {
    ...CONTENT_SECURITY.SANITIZE_OPTIONS,
    USE_PROFILES: { svg: true, svgFilters: true }
  });
}