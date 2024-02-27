import type { CommandContext } from '../commands/prompt/commands';
import { DEFAULT_SYSTEM_PROMPT } from '../default-config';
import { getDefaultFileName, getUniqueFileName } from '../file-utils';
const mockFs = require('mock-fs');

const mockContext: CommandContext = {
  messages: [],
  providerName: 'openai',
  config: {
    model: 'gpt-4',
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  },
};

mockFs({
  '/path/to/': {
    'file.txt': 'Content',
    'incr.txt': 'Content',
    'incr-1.txt': 'Content',
  },
});

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2020, 3, 1, 12, 0));
});

afterAll(() => {
  jest.useRealTimers();
  mockFs.restore();
});

describe('getDefaultFileName', () => {
  it('should return the default file name', () => {
    // Test case 1
    const context = mockContext;
    context.messages.push({ role: 'user', content: 'Hi How Are You Doing Today?' });

    const defaultFileName = getDefaultFileName(context);

    expect(defaultFileName).toBe('2020-04-01 12-00 Hi How Are You Doing');
  });
});

describe('getUniqueFileName', () => {
  it('should return a unique file name', () => {
    const filePath = '/path/to/file';
    const fileExtension = 'txt';
    const uniqueFileName = getUniqueFileName(filePath, fileExtension);
    expect(uniqueFileName).toMatch(`${filePath}-1.${fileExtension}`);
  });

  it('should properly increment the name', () => {
    const filePath = '/path/to/incr';
    const fileExtension = 'txt';
    const uniqueFileName = getUniqueFileName(filePath, fileExtension);
    expect(uniqueFileName).toMatch(`${filePath}-2.${fileExtension}`);
  });

  it('should not modify already unique name', () => {
    const filePath = '/path/to/another/file';
    const fileExtension = 'txt';
    const uniqueFileName = getUniqueFileName(filePath, fileExtension);
    expect(uniqueFileName).toMatch(`${filePath}.${fileExtension}`);
  });
});
