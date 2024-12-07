import { AssistantResponse } from '@callstack/byorg-core';
import { colorAssistant, colorVerbose } from '../../colors.js';
import { formatSpeed, formatTime } from '../../format.js';
import { getVerbose } from '../../output.js';
import { texts } from './texts.js';

export function formatResponse(response: AssistantResponse) {
  let result = colorAssistant(`${texts.assistantLabel} ${response.content}`);
  if (getVerbose()) {
    result += ` ${colorVerbose(formatResponseStats(response))}`;
  }

  return result;
}

function formatResponseStats(message: AssistantResponse) {
  return `${formatTime(message.usage.responseTime)} ${formatSpeed(
    message.usage?.outputTokens,
    message.usage.responseTime,
  )}`;
}
