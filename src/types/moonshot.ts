export interface ReadonlyMoonshotConfig {
  readonly apiKey: string;
  readonly model: string;
  readonly systemPrompt: string;
}

export interface ReadonlyMoonshotMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export interface ReadonlyMoonshotChoice {
  readonly index: number;
  readonly message: ReadonlyMoonshotMessage;
  readonly finish_reason: string;
}

export interface ReadonlyMoonshotUsage {
  readonly prompt_tokens: number;
  readonly completion_tokens: number;
  readonly total_tokens: number;
}

export interface ReadonlyMoonshotResponse {
  readonly id: string;
  readonly object: string;
  readonly created: number;
  readonly model: string;
  readonly choices: readonly ReadonlyMoonshotChoice[];
  readonly usage: ReadonlyMoonshotUsage;
}

export interface ReadonlyMoonshotFile {
  readonly id: string;
  readonly bytes: number;
  readonly created_at: number;
  readonly filename: string;
  readonly purpose: string;
  readonly status: string;
}