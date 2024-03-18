---
id: getting-started
title: Getting Started
slug: /
---

# AI CLI

AI assistant in your terminal.

```
$ ai "Tell me an interesting fact about the Roman Empire"
```

## Installation

```sh
npm install -g @callstack/ai-cli
```

## Setup

### API key

You will need a valid API key from one of supported AI inference providers: OpenAI or Perplexity. Using these APIs is paid but the costs should be very low, typically much less than $0.01 per interaction.

### Quick config

Run `ai init` to create a basic `~/.airc.json` config file with your OpenAI or Perplexity API keys.

Read more about the [configuration file](config-file) format and available option.

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
- `--provider [name]` (or `-p [name]`): select an inference provider to use: `openai` or `perplexity` (alias `pplx`). You should have relevant API key in your `~/.airc.json` file.
- `--model [name]` (or `-m [name]`): select a model to use. This should be a model available for selected provider.
- `--creative`: respond in a creative way
- `--precise`: respond in a more accurate way
- `--verbose` (or `-V`): enable verbose
- `--color`: Forces color output (even if stdout is not a terminal). Use `--no-color` to disable colors.

## CLI commands

CLI commands are available when using CLI in interactive mode.

- `/help`: display available commands
- `/exit`: exit the CLI
- `/info`: display information about current session
- `/forget`: forget previous messages in the session
- `/verbose`: enable/disable verbose mode

## License

MIT
