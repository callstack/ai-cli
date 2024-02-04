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
      "apiKey": "You API KEY HERE",
      "model": "gpt-4"
    }
  }
}
```

## Usage

```shell
$ ai Tell me a joke
me:  Tell me a joke
ai:  Why don't scientists trust atoms? Because they make up everything!
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
