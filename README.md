# AI CLI

AI assistant in your terminal.

```
$ ai "What are generator functions is JS?"
```

## Installation

```sh
npm install -g @callstack/ai-cli
```

## Setup

### API key

You will need a valid API key from one of currently supported AI inference providers: OpenAI or Perplexity. Using these APIs is paid but the costs should be very low, typically much less than $0.01 per interaction.

### Configuration file

Create a minimal `~/.airc` file (in your home directory):

For Open AI:

```json
{
  "providers": {
    "openAi": {
      "apiKey": "Your OpenAI API key"
    }
  }
}
```

For Perplexity:

```json
{
  "providers": {
    "perplexity": {
      "apiKey": "Your Perplexity API key"
    }
  }
}
```

Read more about our configuration file in a [dedicated document](./docs/ConfigFile.md).

## Usage

You can invoke `ai` either in single-answer mode:

```
$ ai Tell me a joke
me:  Tell me a joke
ai:  Why don't scientists trust atoms? Because they make up everything!
```

Or you can start a longer conversation using interactive mode (`-i` or `--interactive` option):

```
$ ai -i Tell me a joke
me: Tell me a joke
ai: Why don’t skeletons fight each other? They don’t have the guts.
me: tell me another one
ai: What do you call fake spaghetti? An impasta!
me: _
```

## CLI options

CLI options are passed when invoking the `ai` commend:

- `--help`: display available options
- `--version`: display CLI version
- `--interactive` (or `-i`): start an interactive session where user can ask follow-up questions
- `--provider [provider name]` (or `-p [provider name]`): select an inference provider to use: `openai` or `perplexity` (alias `pplx`). You should have relevant API key in your `~/.airc` file.
- `--model [model name]` (or `-m [model name]`): select a model to use. This should be a model available for selected provider.
- `--verbose` (or `-V`): enable verbose mode

## CLI commands

CLI commands are available when using CLI in interactive mode.

- `/help`: display available commands
- `/exit`: exit the CLI
- `/info`: display information about current session
- `/verbose [on|off]`: enable/disable verbose mode
- `/forget`: forget previous messages in the session

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
