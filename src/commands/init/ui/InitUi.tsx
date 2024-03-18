import React, { useState } from 'react';
import { Box, Newline, Text } from 'ink';
import Link from 'ink-link';
import { type Provider } from '../../../engine/providers/provider.js';
import { writeConfigFile } from '../../../config-file.js';
import { colors } from '../../../theme/colors.js';
import { ExitApp } from '../../../components/ExitApp.js';
import { StepList } from './StepList.js';
import { SelectProviderStep } from './SelectProviderStep.js';
import { ConfirmStep } from './ConfirmStep.js';
import { KeyInputStep } from './KeyInputStep.js';

interface InitUiProps {
  hasConfig: boolean;
}

export const InitUi = ({ hasConfig }: InitUiProps) => {
  const [step, setStep] = useState(0);

  const [overwriteConfig, setOverwriteConfig] = useState(true);
  const [provider, setProvider] = useState<Provider>();
  const [hasKey, setHasKey] = useState<boolean>();

  const writeConfig = (provider?: Provider, apiKey?: string) => {
    if (!provider || !apiKey) {
      return;
    }

    writeConfigFile({
      providers: {
        [provider.name]: {
          apiKey: apiKey,
        },
      },
      showStats: false,
      showCosts: true,
    });
  };

  return (
    <Box flexDirection="column">
      <Text color={colors.initPrompt} key="welcome">
        Welcome to AI CLI.
        {!hasConfig ? " Let's set you up quickly." : null}
        <Newline />
      </Text>

      <StepList step={step}>
        {hasConfig ? (
          <ConfirmStep
            label='Existing \"~/.airc.json\" file found, do you want to overwrite it?'
            defaultChoice="cancel"
            onConfirm={() => {
              setStep((step) => step + 1);
            }}
            onCancel={() => {
              setOverwriteConfig(false);
              setStep((step) => step + 1);
            }}
          />
        ) : null}

        {overwriteConfig ? (
          <SelectProviderStep
            label="Which inference provider would you like to use:"
            onSelect={(provider) => {
              setProvider(provider);
              setStep(step + 1);
            }}
          />
        ) : (
          <ExitApp>
            <Text>Nothing to do. Exiting.</Text>
          </ExitApp>
        )}

        <ConfirmStep
          label={`Do you have ${provider?.label} API key?`}
          onConfirm={() => {
            setHasKey(true);
            setStep(step + 1);
          }}
          onCancel={() => {
            setHasKey(false);
            setStep(step + 1);
          }}
        />

        {hasKey ? (
          <KeyInputStep
            label={`Paste ${provider?.label} API key here:`}
            onValidate={(text: string) => (!text ? 'API key cannot be an empty string' : '')}
            onSubmit={(apiKey: string) => {
              writeConfig(provider, apiKey);
              setStep(step + 1);
            }}
          />
        ) : (
          <ExitApp>
            <Text>
              You can get your ${provider?.label} API key{' '}
              <Link url={provider?.apiKeyUrl ?? ''}>here</Link>.
            </Text>
          </ExitApp>
        )}

        <Text>
          <Text color={colors.initPrompt}>
            I have written your settings into "~/.airc.json" file. You can now use AI CLI.
          </Text>
          <Newline count={2} />
          <Text color={colors.initPrompt}>
            For a single question and answer just pass a prompt as a param:
          </Text>
          <Newline />
          <Text>$ ai "Tell me a useful productivity hack"</Text>
          <Newline count={2} />
          <Text color={colors.initPrompt}>
            For interactive session use "-i" (or "--interactive") option:
          </Text>
          <Newline />
          <Text>$ ai -i "Tell me an interesting fact about JavaScript"</Text>
          <Newline />
          <ExitApp />
        </Text>
      </StepList>
    </Box>
  );
};
