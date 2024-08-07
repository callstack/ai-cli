# AI CLI

AI assistant in your terminal.

```shell-session
$ ai "Tell me an interesting fact about the Roman Empire"
me: Tell me an interesting fact about the Roman Empire
ai: The Roman Empire had a vast network of roads extending over 250,000 miles at its peak...
```

## Installation

Install `@callstack/ai-cli` npm package globally:

```sh
npm install -g @callstack/ai-cli
```

## Setup

### API key

You will need a valid API key from one of supported AI inference providers: OpenAI or Perplexity. Using these APIs is paid but the costs should be very low, typically much less than $0.01 per interaction.

### Quick config

Run `ai init` to create a basic `~/.airc.json` config file with your OpenAI or Perplexity API key.

```shell-session
$ ai init
```

Read more about the [configuration file](https://callstack.github.io/ai-cli/config-file) format and available option.

## Usage

Run `ai [query]` to start a chat with an AI assistant. You can put the question in the params.

```shell-session
$ ai "Tell me a joke"
me: Tell me a joke
ai: Why don’t skeletons fight each other? They don’t have the guts.
```

## CLI options

CLI options are passed when invoking the `ai` commend:

- `--help`: display available options
- `--provider [name]` (or `-p [name]`): select an inference provider to use
- `--model [name]` (or `-m [name]`): select a model to use
- `--creative`: respond in a creative way
- `--precise`: respond in a more accurate way

You need to have an API key for selected provider in your `~/.airc.json` file.

See more info about the [command line options](https://callstack.github.io/ai-cli/#cli-options).

## CLI commands

CLI commands are available when using CLI in interactive mode.

- `/help`: display available commands
- `/exit`: exit the CLI
- `/info`: display information about current session
- `/forget`: forget previous messages in the session
- `/verbose`: enable/disable verbose mode

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
