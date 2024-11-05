import { Message } from '@callstack/byorg-core';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { fs, vol } from 'memfs';
import { getDefaultFilename, getUniqueFilename } from '../file-utils.js';

vi.mock('node:fs', () => fs);

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2020, 3, 1, 12, 0));
  return () => {
    vi.useRealTimers();
  };
});

beforeEach(() => {
  vol.fromJSON(
    {
      'file.txt': 'Content',
      'incr.txt': 'Content',
      'incr-1.txt': 'Content',
    },
    '/path/to/',
  );

  return () => {
    // // Restores the filesystem functions
    vol.reset();
  };
});

describe('getDefaultFilename', () => {
  test('should return the default file name', () => {
    // Test case 1
    const messages: Message[] = [{ role: 'user', content: 'Hi How Are You Doing Today?' }];

    const defaultFilename = getDefaultFilename(messages);

    expect(defaultFilename).toBe('2020-04-01 12-00 Hi How Are You Doing');
  });
});

describe('getUniqueFilename', () => {
  test('should return a unique file name', () => {
    const filePath = '/path/to/file.txt';
    const uniqueFilename = getUniqueFilename(filePath);
    expect(uniqueFilename).toMatch(`/path/to/file-1.txt`);
  });

  test('should properly increment the name', () => {
    const filePath = '/path/to/incr.txt';
    const uniqueFilename = getUniqueFilename(filePath);
    expect(uniqueFilename).toMatch(`/path/to/incr-2.txt`);
  });

  test('should not modify already unique name', () => {
    const filePath = '/path/to/another/file.txt';
    const uniqueFilename = getUniqueFilename(filePath);
    expect(uniqueFilename).toMatch(`/path/to/another/file.txt`);
  });
});
