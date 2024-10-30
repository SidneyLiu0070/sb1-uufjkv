import { LucideIcon } from 'lucide-react';

export interface ReadonlyLayoutProps {
  readonly children: React.ReactNode;
  readonly title?: string;
}

export interface ReadonlyTabProps {
  readonly id: 'upload' | 'text';
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
  readonly icon?: LucideIcon;
}