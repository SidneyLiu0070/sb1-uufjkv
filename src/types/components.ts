import { ReactNode } from 'react';

export interface ReadonlySubmitButtonProps {
  readonly onSubmit: () => Promise<void>;
  readonly isSubmitting: boolean;
  readonly disabled: boolean;
}

export interface ReadonlyFileUploadProps {
  readonly onFilesChange?: (files: readonly File[]) => void;
  readonly onSubmit?: (files: readonly File[]) => Promise<void>;
}

export interface ReadonlyTextInputProps {
  readonly onTextChange?: (text: string) => void;
  readonly onSubmit?: (text: string) => Promise<void>;
}

export interface ReadonlySettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave?: (settings: ReadonlySettings) => Promise<void>;
}

export interface ReadonlySettings {
  readonly systemPrompt: string;
  readonly model: string;
  readonly apiKey: string;
}

// Freeze the available models
export const MODELS = Object.freeze({
  MOONSHOT_32K: 'moonshot-32k',
  OTHER: 'other',
} as const);

export type ModelType = typeof MODELS[keyof typeof MODELS];

// Common props interface for components that need protection
export interface ProtectedComponentProps {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly style?: Readonly<React.CSSProperties>;
}