import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { z } from 'zod';

const LEGACY_CONFIG_FILENAME = '.airc';
const CONFIG_FILENAME = '.airc.json';

const ProvidersSchema = z.object({
  openAi: z.optional(
    z.object({
      apiKey: z.string(),
      model: z.string().optional(),
      systemPrompt: z.string().optional(),
    }),
  ),
  perplexity: z.optional(
    z.object({
      apiKey: z.string(),
      model: z.string().optional(),
      systemPrompt: z.string().optional(),
    }),
  ),
});

const ConfigFileSchema = z.object({
  providers: ProvidersSchema,
});

export type ConfigFile = z.infer<typeof ConfigFileSchema>;

export function parseConfigFile() {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  const content = fs.readFileSync(configPath);
  const json = JSON.parse(content.toString());

  const typedConfig = ConfigFileSchema.parse(json);
  if (!typedConfig.providers.openAi?.apiKey && !typedConfig.providers.perplexity?.apiKey) {
    throw new Error(
      `Add your OpenAI or Perplexity API key to "~/${CONFIG_FILENAME}" and try again.`,
    );
  }

  // Note: we return original json object, and not `typedConfig` because we want to preserve
  // the original order of providers in the config file.
  return json;
}

export function writeConfigFile(configContents: ConfigFile) {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);
  fs.writeFileSync(configPath, JSON.stringify(configContents, null, 2) + '\n');
}

export function checkIfConfigExists() {
  const legacyConfigPath = path.join(os.homedir(), LEGACY_CONFIG_FILENAME);
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  if (fs.existsSync(legacyConfigPath) && !fs.existsSync(configPath)) {
    fs.renameSync(legacyConfigPath, configPath);
  }

  return fs.existsSync(configPath);
}
