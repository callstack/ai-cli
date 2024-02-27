import { get_encoding, type TiktokenEncoding } from 'tiktoken';

type Tokenizer = {
  encoding: TiktokenEncoding;
  setEncoder: (encoding: TiktokenEncoding) => void;
  getTokensCount: (text: string) => number;
};

export const tokenizer: Tokenizer = {
  encoding: 'cl100k_base',
  setEncoder: function (encoding: TiktokenEncoding) {
    this.encoding = encoding;
  },
  getTokensCount: function (text: string) {
    const encoder = get_encoding(this.encoding);
    const tokens = encoder.encode(text);
    return tokens.length;
  },
};
