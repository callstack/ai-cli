import {
  buildRegExp,
  capture,
  charClass,
  choiceOf,
  endOfString,
  notWhitespace,
  startOfString,
  whitespace,
  word,
  zeroOrMore,
} from 'ts-regex-builder';

const BACKTICKS = '```';

export const codeBlockRegExp = buildRegExp(
  [capture([BACKTICKS, zeroOrMore(charClass(whitespace, notWhitespace)), BACKTICKS])],
  {
    global: true,
    ignoreCase: true,
  }
);

export const codeBlockAnnotationsRegExp = buildRegExp(
  choiceOf([startOfString, BACKTICKS, zeroOrMore(word)], [BACKTICKS, endOfString]),
  {
    global: true,
    ignoreCase: true,
  }
);

export const langRegExp = buildRegExp([BACKTICKS, capture(zeroOrMore(word))], {
  ignoreCase: true,
});

export function splitCodeBlocks(text: string): string[] {
  return text.split(codeBlockRegExp);
}

export function stripCodeblockAnnotations(text: string): string {
  return text.replace(codeBlockAnnotationsRegExp, '');
}
