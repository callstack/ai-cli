import React, { useCallback, useEffect, useState } from 'react';
import { Box, Newline, Text } from 'ink';
import Link from 'ink-link';
import { type Provider } from '../../engine/providers/provider.js';
import { createConfigFile } from '../../config-file.js';
import { SecretTextInput } from '../../interface/init/secret-text-input.js';
import { Wizard } from '../../interface/init/wizard.js';
import { SelectProvider } from '../../interface/init/select-provider.js';
import { Confirm } from '../../interface/init/confirm.js';
import { ConfirmStep } from '../../ui/confirm-step.js';

interface InitUiProps {
  hasConfig: boolean;
}

export const InitUi = ({ hasConfig }: InitUiProps) => {
  const [currentStep, setCurrentStep] = useState(hasConfig ? 0 : 1);
  const [overwriteConfig, setOverwriteConfig] = useState<boolean | undefined>();

  const [setupFinished, setSetupFinished] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState<Provider>();
  const [hasKey, setHasKey] = useState<boolean>();
  const [apiKey, setApiKey] = useState<string>('');

  const completeSetup = useCallback(async (provider: Provider, apiKey: string) => {
    await createConfigFile({
      providers: {
        [provider.name]: {
          apiKey: apiKey,
        },
      },
      showStats: false,
      showCosts: false,
    });

    setSetupFinished(true);
  }, []);

  useEffect(() => {
    if (selectedProvider && apiKey) {
      void completeSetup(selectedProvider, apiKey);
    }
  }, [selectedProvider, apiKey]);

  return (
    <Box flexDirection="column">
      <Wizard
        currentStep={currentStep}
        steps={[
          hasConfig ? (
            <ConfirmStep
              key="has-config"
              label={`Existing "~/.airc.json" file found, do you want to re-initialize it?`}
              value={overwriteConfig}
              onConfirm={() => {
                setOverwriteConfig(true);
                setCurrentStep((step) => step + 1);
              }}
              onCancel={() => {
                setOverwriteConfig(false);
                process.exit(0);
              }}
            />
          ) : (
            <Text key="welcome" color="blue">
              Welcome to AI CLI. Let's set you up quickly.
            </Text>
          ),
          <SelectProvider
            key={'select-provider'}
            onSelect={(provider) => {
              setSelectedProvider(provider);
              setCurrentStep(currentStep + 1);
            }}
          />,
          <Confirm
            key={'use-has-key'}
            onSelect={(hasKey) => {
              setHasKey(hasKey);
              setCurrentStep(currentStep + 1);
            }}
            description={`Do you already have ${selectedProvider?.label} API key?`}
          />,
          hasKey ? (
            <SecretTextInput
              key={'provide-api-key'}
              description={`Paste ${selectedProvider?.label} API key here:`}
              validate={(text: string) => (text === '' ? 'API key cannot be an empty string' : '')}
              onConfirm={setApiKey}
            />
          ) : (
            <Text key="api-key-link">
              You can get it <Link url={selectedProvider?.apiKeyUrl ?? ''}>here</Link>
            </Text>
          ),
        ]}
      />

      {setupFinished ? (
        <>
          <Text>
            <Newline />
            I have written your settings into "~/.airc.json" file. You can now start using AI CLI.
            <Newline count={2} />
            For a single question and answer just pass a prompt as a param:
            <Newline />
            $ ai "Tell me a useful productivity hack
            <Newline count={2} />
            For interactive session use "-i" (or "--interactive") option:
            <Newline />
            $ ai -i "Tell me an interesting fact about JavaScript
            <Newline count={2} />
          </Text>
        </>
      ) : null}
    </Box>
  );
};
