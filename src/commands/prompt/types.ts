import type { Message, ModelUsage } from '../../inference';
import type { ProviderConfig } from '../../providers/config';
import type { Provider } from '../../providers/provider';

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
  stats?: boolean;
  /** Display colorized output. Default == autodetect */
  color?: boolean;
  /** Add file to conversation */
  file?: string;
  /** Creative response style */
  creative?: boolean;
  /** Precise response style */
  precise?: boolean;
}

export interface SessionContext {
  provider: Provider;
  config: ProviderConfig;
  totalUsage: ModelUsage;
  messages: Message[];
}