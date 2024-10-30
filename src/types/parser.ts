export interface ReadonlyJsonParserResult {
  readonly cleanContent: string;
  readonly isJson: boolean;
  readonly originalContent: string;
  readonly parsed: unknown | null;
}