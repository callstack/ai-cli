import {
  addProgramMessage,
  setShouldExit,
  setVerbose,
  forgetContextMessages,
  setActiveView,
  useChatState,
  addLocalAiMessage,
  addLocalUserMessage,
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

  addLocalUserMessage(input);

  const state = useChatState.getState();
  setActiveView(null);

  if (command === '/exit') {
    addLocalAiMessage('Bye! 👋');
    setShouldExit(true);
    return true;
  }

  if (command === '/verbose') {
    setVerbose(!state.verbose);
    addProgramMessage(`Verbose mode: ${state.verbose ? 'off' : 'on'}`);
    return true;
  }

  if (command === '/forget') {
    forgetContextMessages();
    addProgramMessage('AI will forget previous messages.');
    return true;
  }

  if (input === '/save') {
    const saveConversationMessage = saveConversation(state.contextMessages);
    addProgramMessage(saveConversationMessage);
    return true;
  }

  addProgramMessage(`Unknown command ${command}`, 'error');
  return true;
}
