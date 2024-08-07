---
id: config-file
title: Config File
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Config file

## Minimal config

A minimal `~/.airc.json` file consists only of API key for selected AI inference provider.

<Tabs groupId="provider">
<TabItem value="openAi" label="Open AI">
```json
{
  "providers": {
    "openAi": {
      "apiKey": "Your API key"
    }
  }
}
```
</TabItem>
<TabItem value="anthropic" label="Anthropic">
```json
{
  "providers": {
    "anthropic": {
      "apiKey": "Your API key"
    }
  }
}
```
</TabItem>
<TabItem value="perplexity" label="Perplexity">
```json
{
  "providers": {
    "perplexity": {
      "apiKey": "Your API key"
    }
  }
}
```
</TabItem>
<TabItem value="mistral" label="Mistral">
```json
{
  "providers": {
    "mistral": {
      "apiKey": "Your API key"
    }
  }
}
```
</TabItem>
</Tabs>

## Provider Options

All provider specific-options are located under top-level `providers` key in the config file.

Supported providers are currently:

- `openAi`
- `anthropic`
- `perplexity`
- `mistral`

### AI Model

Each of supported providers can be tuned with `model` option to select an exact AI model:

<Tabs groupId="provider">
<TabItem value="openAi" label="Open AI">
```json
{
  "providers": {
    "openAi": {
      // ...
      "model": "gpt-4o" // Current default model
    }
  }
}
```

List of [supported Open AI models](https://platform.openai.com/docs/models).
</TabItem>
<TabItem value="anthropic" label="Anthropic">

```json
{
  "providers": {
    "anthropic": {
      // ...
      "model": "claude-3-sonnet-20240229" // Current default model
    }
  }
}
```

List of [supported Anthropic models](https://docs.anthropic.com/en/docs/models-overview).
</TabItem>
<TabItem value="perplexity" label="Perplexity">

```json
{
  "providers": {
    "perplexity": {
      // ...
      "model": "llama-3-sonar-large-32k-chat" // Current default model
    }
  }
}
```

List of [supported Perplexity models](https://docs.perplexity.ai/docs/model-cards).
</TabItem>
<TabItem value="mistral" label="Mistral">

```json
{
  "providers": {
    "mistral": {
      // ...
      "model": "mistral-large-latest" // Current default model
    }
  }
}
```

List of [supported Mistral models](https://docs.mistral.ai/getting-started/models/).
</TabItem>
</Tabs>

Choosing proper model can have a huge impact on your AI assistant response quality, response time, as well as costs (although costs should be reasonable for manual, single-user interactions).

### System Prompt

You can specify system prompt for each of the supported providers:

<Tabs groupId="provider">
<TabItem value="openAi" label="Open AI">
```json
{
  "providers": {
    "openAi": {
      // ...
      "systemPrompt": "You are a helpful AI assistant. Respond in a concise way."
    }
  }
}
```
</TabItem>
<TabItem value="anthropic" label="Anthropic">
```json
{
  "providers": {
    "anthropic": {
      // ...
      "systemPrompt": "You are a helpful AI assistant. Respond in a concise way."
    }
  }
}
```
</TabItem>
<TabItem value="perplexity" label="Perplexity">
```json
{
  "providers": {
    "perplexity": {
      // ...
      "systemPrompt": "You are a helpful AI assistant. Respond in a concise way."
    }
  }
}
```
</TabItem>
<TabItem value="mistral" label="Mistral">
```json
{
  "providers": {
    "mistral": {
      // ...
      "systemPrompt": "You are a helpful AI assistant. Respond in a concise way."
    }
  }
}
```
</TabItem>
</Tabs>

System prompt is an important part of AI model "personality" and should specify the key aspects you expect from AI. LLMs typically put great weight to the instructions given in the system prompt.
