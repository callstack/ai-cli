// OpenAI models: https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
export const DEFAULT_OPEN_AI_MODEL = 'gpt-4';

// Perplexity models: https://docs.perplexity.ai/docs/model-cards
export const DEFAULT_PERPLEXITY_MODEL = 'sonar-medium-chat';

export const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant responding in a concise manner to user questions.';

export const DEFAULT_FILE_PROMPT = `Below is a file attached to conversation.
  Answer the questions using it as context provider.
  If you can't answer the question based on context provided, respond with "I don't know"`;
