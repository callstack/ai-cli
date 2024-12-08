export interface ProviderConfig {
  apiKey: string;
  model: string;
  stream: boolean;
  systemPrompt: string | null;
  responseStyle: ResponseStyle;
}

export type ResponseStyle = 'default' | 'creative' | 'precise';

export const responseStyles = {
  default: {},
  creative: {
    temperature: 0.7,
    top_p: 0.9,
  },
  precise: {
    temperature: 0.3,
    top_p: 0.5,
  },
};
