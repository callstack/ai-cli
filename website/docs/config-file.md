---
id: config-file
title: Config File
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Config file

## Minimal config

A minimal `~/.airc.json` file consists only of API key for selected AI inference provider.

<Tabs>
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
</Tabs>


## Provider Options

All provider specific-options are located under top-level `providers` key in the config file.

Supported providers are currently:
* `openAi`
* `perplexity`

### AI Model

Each of supported providers can be tuned with `model` option to select an exact AI model:

<Tabs>
<TabItem value="openAi" label="Open AI">

```json
{
  "providers": {
    "openAi": {
      // ...
      "model": "gpt-4-turbo-preview"
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
      "model": "sonar-medium-chat"
    }
  }
}
```

</TabItem>
</Tabs>

Choosing proper model can have a huge impact on your AI assistant response quality, response time, as well as costs (altought costs should be reasonable for manual, single-user interactions).

Available models:

- [OpenAI](https://platform.openai.com/docs/models)
- [Perplexity](https://docs.perplexity.ai/docs/model-cards)

### System Prompt

You can specify system prompt for each of the supported providers:

<Tabs>
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
</Tabs>

System prompt is an important part of AI model "personality" and should specify the key aspects you expect from AI. LLMs typically put great weight to the instructions given in the system prompt.

