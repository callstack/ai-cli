import React from 'react';
import { Text } from 'ink';
import { parse, setOptions } from 'marked';
import TerminalRenderer, { type TerminalRendererOptions } from 'marked-terminal';

export type Props = TerminalRendererOptions & {
  children: string;
};

export function Markdown({ children, ...options }: Props) {
  // @ts-ignore
  setOptions({ renderer: new TerminalRenderer(options) });
  // @ts-ignore
  return <Text>{parse(children).trim()}</Text>;
}
