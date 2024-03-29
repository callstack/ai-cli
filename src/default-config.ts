export const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant responding in a concise manner to user questions.';

export const FILE_TOKEN_COUNT_WARNING = 2000;
export const FILE_COST_WARNING = 0.25;

export const DEFAULT_FILE_PROMPT = `Use the following FILE CONTENT as a context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.

FILENAME: {filename}

FILE CONTENT:
{fileContent}`;
