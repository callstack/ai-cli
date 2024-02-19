import { langRegExp, splitCodeBlocks, stripCodeblockAnnotations } from '../syntax-highlighting';

const INPUT = `
\`\`\`javascript
console.log('test')
\`\`\`
Test2
`;

const CODE_BLOCK = "```javascript\nconsole.log('test')\n```";

describe('Syntax Highlighting', () => {
  it('should properly split code blocks', () => {
    expect(splitCodeBlocks(INPUT)).toEqual([
      '\n',
      "```javascript\nconsole.log('test')\n```",
      '\nTest2\n',
    ]);
  });
  it('should properly remove code block annotations', () => {
    const res = CODE_BLOCK.match(langRegExp)?.[1];
    console.log(res?.[1]);
    expect(stripCodeblockAnnotations(CODE_BLOCK)).toEqual("\nconsole.log('test')\n");
  });
});
