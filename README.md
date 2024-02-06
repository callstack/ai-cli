# AI CLI

AI agent in your terminal.

## Installation

```sh
npm install -g @callstack/ai-cli
```

Create `~/.airc` file (in your home directory):

```json
{
  "providers": {
    "openAi": {
      "apiKey": "Your OpenAI API key",
      "model": "gpt-4"
    },
    "perplexity:" {
      "apiKey": "Your Perplexity API key",
      "model": "pplx-70b-chat",
    }
  }
}
```

## Usage

```
$ ai Tell me a joke
me:  Tell me a joke
ai:  Why don't scientists trust atoms? Because they make up everything!
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
