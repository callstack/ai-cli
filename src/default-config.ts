// OpenAI models: https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
export const DEFAULT_OPEN_AI_MODEL = 'gpt-4';

// Perplexity models: https://docs.perplexity.ai/docs/model-cards
export const DEFAULT_PERPLEXITY_MODEL = 'sonar-medium-chat';

export const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant responding in a concise manner to user questions.';

export const FILE_TOKEN_COUNT_WARNING = 2000;

export const DEFAULT_FILE_PROMPT = `Answer using following content as a reference.
If you can't find the answer to the question in provided content just respond "I don't know".
CONTENT:
###
{fileContent}
###`;
