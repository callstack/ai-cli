// OpenAI models: https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
export const DEFAULT_OPEN_AI_MODEL = 'gpt-4';

// Perplexity models: https://docs.perplexity.ai/docs/model-cards
export const DEFAULT_PERPLEXITY_MODEL = 'sonar-medium-chat';

export const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant responding in a concise manner to user questions.';

export const FILE_TOKEN_COUNT_WARNING = 2000;
export const FILE_COST_WARNING = 0.25;

export const DEFAULT_FILE_PROMPT = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.

{fileContent}`;

export const RESPONSE_STYLE_DEFAULT = {};

export const RESPONSE_STYLE_CREATIVE = {
  temperature: 0.7,
  top_p: 0.9,
};

export const RESPONSE_STYLE_PRECISE = {
  temperature: 0.3,
  top_p: 0.5,
};
