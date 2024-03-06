import * as output from '../../output.js';
import { renderInitInterface } from '../../interface/init/index.js';
import { checkIfConfigExists } from '../../config-file.js';

export function init() {
  try {
    const configExists = checkIfConfigExists();
    renderInitInterface({ configExists });
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}
