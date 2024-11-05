import { type AssistantMessage, type AssistantResponse } from '@callstack/byorg-core';
import { useChatState, type MessageLevel } from './state.js';

export function addUserMessage(content: string) {
  useChatState.setState((state) => {
    return {
      activeView: null,
      contextMessages: [...state.contextMessages, { role: 'user', content }],
      chatMessages: [...state.chatMessages, { role: 'user', content }],
    };
  });
}

export function addAssistantResponse(response: AssistantResponse) {
  useChatState.setState((state) => {
    const message: AssistantMessage = {
      role: 'assistant',
      content: response.content,
    };

    return {
      activeView: null,
      contextMessages: [...state.contextMessages, message],
      chatMessages: [...state.chatMessages, response],
    };
  });
}

export function addProgramMessage(content: string, level: MessageLevel = 'info') {
  useChatState.setState((state) => {
    return {
      activeView: null,
      chatMessages: [...state.chatMessages, { role: 'program', level, content }],
    };
  });
}

export function removeUnansweredUserContextMessage() {
  useChatState.setState((state) => {
    const lastMessage = state.contextMessages.at(-1);
    if (lastMessage?.role !== 'user') {
      return state;
    }

    return {
      contextMessages: state.contextMessages.slice(0, state.contextMessages.length - 1),
    };
  });
}

export function forgetContextMessages() {
  useChatState.setState((state) => {
    return {
      contextMessages: [],
      chatMessages: [
        ...state.chatMessages,
        { role: 'program', level: 'info', content: 'AI will forget previous messages.' },
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

export function hideActiveView() {
  useChatState.setState(() => {
    return {
      activeView: null,
    };
  });
}

export function triggerExit() {
  useChatState.setState((state) => {
    return {
      activeView: null,
      shouldExit: true,
      chatMessages: [...state.chatMessages, { role: 'program', level: 'info', content: 'Bye! 👋' }],
    };
  });
}

export function setVerbose(verbose: boolean) {
  useChatState.setState((state) => {
    return {
      verbose,
      chatMessages: [
        ...state.chatMessages,
        { role: 'program', level: 'info', content: `Verbose mode: ${verbose ? 'on' : 'off'}` },
      ],
    };
  });
}
