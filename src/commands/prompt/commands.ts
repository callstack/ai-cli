import type { UserMessage } from '../../engine/inference.js';
import {
  addProgramMessage,
  setShouldExit,
  setVerbose,
  forgetContextMessages,
  setActiveView,
  useChatState,
  addAiOutputMessage,
  addUserOutputMessage,
} from './state.js';
import { saveConversation } from './utils.js';

export function processCommand(input: string) {
  if (!input.startsWith('/')) {
    return false;
  }

  const command = input.split(' ')[0];
  if (command === '/help') {
    setActiveView('help');
    return true;
  }

  if (command === '/info') {
    setActiveView('info');
    return true;
  }

  const userMessage: UserMessage = { role: 'user', content: input };
  addUserOutputMessage(userMessage);

  const state = useChatState.getState();
  setActiveView(null);

  if (command === '/exit') {
    addAiOutputMessage({ role: 'assistant', content: 'Bye! 👋' });
    setShouldExit(true);
    return true;
  }

  if (command === '/verbose') {
    setVerbose(!state.verbose);
    addProgramMessage({ type: 'info', text: `Verbose mode: ${state.verbose ? 'off' : 'on'}` });
    return true;
  }

  if (command === '/forget') {
    forgetContextMessages();
    addProgramMessage({ type: 'info', text: 'AI will forget previous messages.' });
    return true;
  }

  if (input === '/save') {
    const saveConversationMessage = saveConversation(state.contextMessages);
    addProgramMessage({ type: 'info', text: saveConversationMessage });
    return true;
  }

  addProgramMessage({ type: 'warning', text: `Unknown command ${command}` });
  return true;
}
