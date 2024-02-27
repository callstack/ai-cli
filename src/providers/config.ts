export interface ProviderConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
  temperature?: number;
  top_p?: number;
}
