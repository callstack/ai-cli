export interface PromptOptions {
  /** Interactive mode */
  interactive: boolean;
  /** AI inference provider to be used */
  provider?: string;
  /** AI model to be used */
  model?: string;
  /** Show verbose-level logs. */
  verbose: boolean;
  /** Display usage costs. */
  costs?: boolean;
  /** Display usage stats. */
  usage?: boolean;
  /** Display colorized output. Default == autodetect */
  color?: boolean;
  /** Add file to conversation */
  file?: string;
  /** Creative response style */
  creative?: boolean;
  /** Precise response style */
  precise?: boolean;
}
