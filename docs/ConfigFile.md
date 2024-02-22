# Config file

## Minimal config

A minimal `.airc.json` file consists only of API key for selected AI inference provider.

### Minimal OpenAI config

```json
{
    "providers": {
        "openAi": {
            "apiKey": "Your API key"
        }
    }
}
```

### Minimal Perplexity config

```json
{
    "providers": {
        "perplexity": {
            "apiKey": "Your API key"
        }
    }
}
```

## Provider Options

All provider specific-options are located under top-level `providers` key in the config file. Supported providers are currently: `openAi` and `perplexity`.


### AI Model

Each of supported providers can be tuned with `model` option to select an exact AI model:

```json
{
    "providers": {
        "openAi": {
            "apiKey": "Your API key",
            "model": "gpt-4-turbo-preview"
        },
        "perplexity": {
            "apiKey": "Your API key",
            "model": "pplx-70b-online"
        }
    }
}
```

Choosing proper model can have a huge impact on your AI assistant response quality, response time, as well as costs (altought costs should be reasonable for manual, single-user interactions).

Available models:
* [OpenAI](https://platform.openai.com/docs/models)
* [Perplexity](https://docs.perplexity.ai/docs/model-cards)

### System Prompt

You can specify system prompt for each of the supported providers:

```json
{
    "providers": {
        "openAi": {
            "apiKey": "Your API key",
            "systemPrompt": "You are a helpful AI assistant. Respond in a concise way."
        },
        "perplexity": {
            "apiKey": "Your API key",
            "systemPrompt": "You are a helpful AI assistant. Respond in a concise way."
        }
    }
}
```

System prompt is an important part of AI model "personality" and should specify the key aspects you expect from AI.