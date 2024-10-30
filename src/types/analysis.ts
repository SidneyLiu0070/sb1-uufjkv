export interface ReadonlyAnalysisState {
  readonly content: string;
  readonly isJsonFormat: boolean;
  readonly parsedContent: string;
  readonly svgContent?: string;
  readonly isLoading: boolean;
}

export interface ReadonlySidebarProps {
  readonly content: string;
  readonly isJsonFormat: boolean;
  readonly onContentChange: (content: string) => void;
  readonly onSubmit: () => void;
  readonly isCollapsed: boolean;
  readonly isLoading: boolean;
}

export interface ReadonlySvgViewerProps {
  readonly svgContent?: string;
  readonly onDownloadSvg: () => void;
  readonly onDownloadPng: () => void;
}

export interface ReadonlyToolbarProps {
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onDownloadSvg: () => void;
  readonly onDownloadPng: () => void;
}

export interface ReadonlyAnalysisLayoutProps {
  readonly children: React.ReactNode;
  readonly sidebarContent: React.ReactNode;
  readonly isCollapsed: boolean;
  readonly onToggleCollapse: () => void;
}

export interface ReadonlyChatMessage {
  readonly id: string;
  readonly content: string;
  readonly role: 'user' | 'assistant';
  readonly timestamp: number;
}

export interface ReadonlyChatState {
  readonly messages: ReadonlyArray<ReadonlyChatMessage>;
  readonly isLoading: boolean;
  readonly error: string | null;
}