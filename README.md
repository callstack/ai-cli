# AI CLI

AI assistant in your terminal.

```shell-session
$ ai "Tell me an interesting fact about the Roman Empire"
ai: The Roman Empire had a vast network of roads extending over 250,000 miles at its peak...
```

## Installation

```sh
npm install -g @callstack/ai-cli
```

## Setup

### API key

You will need a valid API key from one of supported AI inference providers: OpenAI or Perplexity. Using these APIs is paid but the costs should be very low, typically much less than $0.01 per interaction.

### Quick config

Run `ai init` to create a basic `~/.airc.json` config file with your OpenAI or Perplexity API key.

Learn about AI CLI config file [here](https://callstack.github.io/ai-cli/config-file).

## Usage

You can invoke `ai` either in single-answer mode:

```
$ ai "Tell me a joke"
me:  Tell me a joke
ai:  Why don't scientists trust atoms? Because they make up everything!
```

Or you can start a longer conversation using interactive mode (`-i` or `--interactive` option):

```
$ ai -i "Tell me a joke"
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
- `--provider [name]` (or `-p [name]`): select an inference provider to use: `openai` or `perplexity` (alias `pplx`). You should have relevant API key in your `~/.airc.json` file.
- `--model [name]` (or `-m [name]`): select a model to use. This should be a model available for selected provider.
- `--verbose` (or `-V`): enable verbose
- `--color`: Forces color output (even if stdout is not a terminal). Use `--no-color` to disable colors.

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
