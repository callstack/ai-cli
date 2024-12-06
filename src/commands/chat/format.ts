import { AssistantResponse } from '@callstack/byorg-core';
import { formatSpeed, formatTime } from '../../format.js';
import { colorAssistant, colorVerbose } from '../../output/colors.js';
import { getVerbose } from '../../output/index.js';

export function formatResponse(response: AssistantResponse) {
  let result = colorAssistant(response.content);
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
