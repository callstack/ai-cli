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

### Current Models

<Tabs groupId="provider">
<TabItem value="openAi" label="Open AI">

| Model               | Alias | Price: in \| out \* | Notes   |
| ------------------- | ----- | ------------------- | ------- |
| `gpt-4o-2024-08-06` |       | $2.5 \| $10         | Default |
| `gpt-4o`            |       | $5 \| $15           |         |
| `gpt-4o-mini`       |       | $0.15 \| $0.6       |         |

\* API prices per 1 million input/output tokens

More models & info: [OpenAI docs](https://platform.openai.com/docs/models)

</TabItem>
<TabItem value="anthropic" label="Anthropic">

| Model                        | Alias    | Price: in \| out \* | Notes   |
| ---------------------------- | -------- | ------------------- | ------- |
| `claude-3-5-sonnet-20240620` | `sonnet` | $3 \| $15           | Default |
| `claude-3-opus-20240229`     | `opus`   | $15 \| $75          |         |
| `claude-3-haiku-20240307`    | `haiku`  | $0.25 \| $1.25      |         |

\* API prices per 1 million input/output tokens

More info: [Anthropic docs](https://docs.anthropic.com/claude/docs/models-overview)

</TabItem>
<TabItem value="perplexity" label="Perplexity">

| Model                               | Alias   | Price: in \| out \*          | Notes               |
| ----------------------------------- | ------- | ---------------------------- | ------------------- |
| `llama-3.1-sonar-huge-128k-online`  | `huge`  | $5 \| $5 \| requests: $5     | Default, Online\*\* |
| `llama-3.1-sonar-large-128k-online` | `large` | $1 \| $1 \| requests: $5     | Online\*\*          |
| `llama-3.1-sonar-small-128k-online` | `small` | $0.2 \| $0.2 \| requests: $5 | Online\*\*          |
| `llama-3.1-sonar-large-128k-chat`   |         | $1 \| $1                     |                     |
| `llama-3.1-sonar-small-128k-chat`   |         | $0.2 \| $0.2                 |                     |
| `llama-3.1-70b-instruct`            |         | $1 \| $1                     |                     |
| `llama-3.1-8b-instruct`             |         | $0.2 \| $0.2                 |                     |

\* API prices per 1 million input/output tokens, per 1 thousands requests

\*\* Perplexity online models can lookup information on the Internet, they also charge a per request fee ($5/1000 requests) and ignore system prompts.

More info: [Perplexity docs](https://docs.perplexity.ai/docs/model-cards)

</TabItem>
<TabItem value="mistral" label="Mistral">

| Model                  | Alias       | Price: in \| out \* | Notes   |
| ---------------------- | ----------- | ------------------- | ------- |
| `mistral-large-latest` | `large`     | $3 \| $9            | Default |
| `open-mistral-nemo`    | `nemo`      | $0.3 \| $0.3        |         |
| `codestral-latest`     | `codestral` | $1 \| $3            |         |

\* API prices per 1 million input/output tokens

More info: [Mistral docs](https://docs.mistral.ai/platform/endpoints/)

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
