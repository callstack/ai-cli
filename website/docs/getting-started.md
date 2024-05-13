---
id: getting-started
title: Getting Started
slug: /
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# AI CLI

AI assistant in your terminal.

```shell-session
$ ai "Tell me an interesting fact about the Roman Empire"
me: Tell me an interesting fact about the Roman Empire
ai: The Roman Empire had a vast network of roads extending over 250,000 miles at its peak...
me: _
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

```shell-session
$ ai init
```

Read more about the [configuration file](config-file) format and available option.

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
- `--version`: display CLI version
- `--provider [name]` (or `-p [name]`): select an inference provider to use:
  - `openai`
  - `anthropic` (or `anth`)
  - `perplexity` (or `pplx`)
  - `mistral`
- `--model [name]` (or `-m [name]`): select a model to use. This should be a model available for the selected provider.
- `--creative`: respond in a creative way
- `--precise`: respond in a more accurate way
- `--verbose` (or `-V`): enable verbose output

You should have a relevant API key in your `~/.airc.json` file.

### Defaults models

- OpenAI: `gpt-4o` (input: $5, output: $15\*)
- Anthropic: `claude-3-sonnet-20240229` (input: $3, output: $15\*)
- Perplexity: `llama-3-sonar-large-32k-chat` (input: $1, output: $1\*)
- Mistral: `'mistral-large-latest` (input: $4, output: $12\*)

\* prices per 1 million tokens

### Model Aliases

Using full model names can be tedious, so AI CLI supports shorthand model aliases:

<Tabs groupId="provider">
<TabItem value="openAi" label="Open AI">
| Alias           | Model                 |
| --------------- | --------------------- |
| `gpt-3.5` | `gpt-3.5-turbo`       |
</TabItem>
<TabItem value="anthropic" label="Anthropic">
| Alias    | Model                      |
| -------- | -------------------------- |
| `haiku`  | `claude-3-haiku-20240307`  |
| `sonnet` | `claude-3-sonnet-20240229` |
| `opus`   | `claude-3-opus-20240229`   |
</TabItem>
<TabItem value="perplexity" label="Perplexity">
| Alias       | Model                    |
| ----------- | ------------------------ |
| `online`    | `sonar-medium-online`    |
| `codellama` | `codellama-70b-instruct` |
| `mistral`   | `mistral-7b-instruct`    |
| `mixtral`   | `mixtral-8x7b-instruct`  |
</TabItem>
<TabItem value="mistral" label="Mistral">
| Alias     | Model                   |
| --------- | ----------------------- |
| `mistral` | `open-mistral-7b`       |
| `mixtral` | `open-mixtral-8x7b`     |
| `small`   | `mistral-small-latest`  |
| `medium`  | `mistral-medium-latest` |
| `large`   | `mistral-large-latest`  |
</TabItem>
</Tabs>

## CLI commands

CLI commands are available when using CLI in interactive mode.

- `/help`: display available commands
- `/exit`: exit the CLI
- `/info`: display information about current session
- `/forget`: forget previous messages in the session
- `/verbose`: enable/disable verbose mode

## License

MIT
