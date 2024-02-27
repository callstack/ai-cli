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

// Allows for mocking the time on CLI
Object.defineProperty(global, 'performance', {
  writable: true,
});

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2020, 3, 1, 12, 0));
});

beforeEach(() => {
  mockFs({
    '/path/to/': {
      'file.txt': 'Content',
      'incr.txt': 'Content',
      'incr-1.txt': 'Content',
    },
  });
});

// Restores the filesystem functions
afterEach(() => {
  mockFs.restore();
});

afterAll(() => {
  jest.useRealTimers();
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
    const filePath = '/path/to/file.txt';
    const uniqueFileName = getUniqueFileName(filePath);
    expect(uniqueFileName).toMatch(`/path/to/file-1.txt`);
  });

  it('should properly increment the name', () => {
    const filePath = '/path/to/incr.txt';
    const uniqueFileName = getUniqueFileName(filePath);
    expect(uniqueFileName).toMatch(`/path/to/incr-2.txt`);
  });

  it('should not modify already unique name', () => {
    const filePath = '/path/to/another/file.txt';
    const uniqueFileName = getUniqueFileName(filePath);
    expect(uniqueFileName).toMatch(`/path/to/another/file.txt`);
  });
});
