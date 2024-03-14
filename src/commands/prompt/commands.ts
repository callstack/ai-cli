import {
  addProgramMessage,
  setShouldExit,
  setVerbose,
  forgetContextMessages,
  setActiveView,
  useChatState,
} from './state.js';
import { saveConversation } from './utils.js';

export function processCommand(input: string) {
  if (!input.startsWith('/')) {
    return false;
  }

  const state = useChatState.getState();
  const command = input.split(' ')[0];

  if (command === '/exit') {
    addProgramMessage({ type: 'info', text: 'Bye!' });
    setShouldExit(true);
    return true;
  }

  if (command === '/help') {
    setActiveView('help');
    return true;
  }

  if (command === '/info') {
    setActiveView('info');
    return true;
  }

  setActiveView(null);
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
