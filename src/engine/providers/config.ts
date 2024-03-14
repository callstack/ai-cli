export interface ProviderConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
  responseStyle: ResponseStyle;
  temperature?: number;
  top_p?: number;
}

export type ResponseStyle = 'default' | 'creative' | 'precise';
