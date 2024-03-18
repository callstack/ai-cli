import type { ModelResponse } from '../../../engine/inference.js';
import { useChatState, type MessageLevel } from './state.js';

export function addUserMessage(text: string) {
  useChatState.setState((state) => {
    return {
      activeView: null,
      contextMessages: [...state.contextMessages, { role: 'user', content: text }],
      chatMessages: [...state.chatMessages, { type: 'user', text }],
    };
  });
}

export function addAiResponse(response: ModelResponse) {
  useChatState.setState((state) => {
    const outputMessages = {
      type: 'ai',
      text: response.message.content,
      responseTime: response.responseTime,
      usage: response.usage,
      data: response.data,
    } as const;

    return {
      activeView: null,
      contextMessages: [...state.contextMessages, response.message],
      chatMessages: [...state.chatMessages, outputMessages],
    };
  });
}

export function addProgramMessage(text: string, level: MessageLevel = 'info') {
  useChatState.setState((state) => {
    return {
      activeView: null,
      chatMessages: [...state.chatMessages, { type: 'program', level, text }],
    };
  });
}

export function forgetContextMessages() {
  useChatState.setState((state) => {
    return {
      contextMessages: [],
      chatMessages: [
        ...state.chatMessages,
        { type: 'program', level: 'info', text: 'AI will forget previous messages.' },
      ],
    };
  });
}

export function showHelpView() {
  useChatState.setState(() => {
    return {
      activeView: 'help',
    };
  });
}

export function showInfoView() {
  useChatState.setState(() => {
    return {
      activeView: 'info',
    };
  });
}

export function triggerExit() {
  useChatState.setState((state) => {
    return {
      activeView: null,
      shouldExit: true,
      chatMessages: [...state.chatMessages, { type: 'program', level: 'info', text: 'Bye! 👋' }],
    };
  });
}

export function setVerbose(verbose: boolean) {
  useChatState.setState((state) => {
    return {
      verbose,
      chatMessages: [
        ...state.chatMessages,
        { type: 'program', level: 'info', text: `Verbose mode: ${verbose ? 'on' : 'off'}` },
      ],
    };
  });
}
