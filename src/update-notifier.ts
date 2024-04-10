#!/usr/bin/env node

import { createRequire } from 'module';
import updateNotifier from 'update-notifier';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

/**
 * Checks for available update.
 *
 * > Whenever you initiate the update notifier and it's not within the interval threshold, it will
 * > asynchronously check with npm in the background for available updates, then persist the result.
 * > The next time the notifier is initiated, the result will be loaded into the .update property.
 * > This prevents any impact on your package startup performance. The update check is done in a
 * > unref'ed child process. This means that if you call process.exit, the check will still be
 * > performed in its own process.
 *
 * @see https://github.com/yeoman/update-notifier
 */
export function checkForUpdates() {
  updateNotifier({
    pkg: packageJson,
    shouldNotifyInNpmScript: true,
    updateCheckInterval: 1,
  }).notify();
}
