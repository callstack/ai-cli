import {
  addProgramMessage,
  setVerbose,
  forgetContextMessages,
  showHelpView,
  showInfoView,
  triggerExit,
} from './state/actions.js';
import { useChatState } from './state/state.js';
import { saveConversation } from './utils.js';

export function processChatCommand(input: string) {
  if (!input.startsWith('/')) {
    return false;
  }

  const command = input.split(' ')[0];
  if (command === '/help') {
    showHelpView();
    return true;
  }

  if (command === '/info') {
    showInfoView();
    return true;
  }

  const state = useChatState.getState();
  if (command === '/exit') {
    triggerExit();
    return true;
  }

  if (command === '/verbose') {
    setVerbose(!state.verbose);
    return true;
  }

  if (command === '/forget') {
    forgetContextMessages();
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
