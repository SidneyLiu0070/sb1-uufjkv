import { ReadonlyJsonParserResult } from '../types/parser';

class JsonParser {
  private static instance: JsonParser;

  private constructor() {}

  public static getInstance(): Readonly<JsonParser> {
    if (!JsonParser.instance) {
      JsonParser.instance = new JsonParser();
    }
    return Object.freeze(JsonParser.instance);
  }

  public parse(content: string): ReadonlyJsonParserResult {
    try {
      const parsed = JSON.parse(content);
      const isJson = true;
      
      const cleanContent = Object.entries(parsed)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      return Object.freeze({
        cleanContent,
        isJson,
        originalContent: content,
        parsed
      });
    } catch {
      return Object.freeze({
        cleanContent: content,
        isJson: false,
        originalContent: content,
        parsed: null
      });
    }
  }
}

// Export a frozen singleton instance
export const jsonParser = Object.freeze(JsonParser.getInstance());