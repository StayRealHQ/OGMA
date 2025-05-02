# OGMA

A reverse engineering of `.proto` files for calling the gRPC services of a popular authentic social network.

## Generating a `.desc` file

```bash
protoc --proto_path=proto --descriptor_set_out=ogma.desc \
  proto/public/**/*.proto \
  proto/common/**/*.proto
```

You'll be able to use the `ogma.desc` file with any tool that supports it.

## Contributing

You may need the following tools.

- [`protoc`](https://protobuf.dev/installation/) for decoding known and compiling protobuf files
- [`decode_raw`](https://github.com/confio/decode_raw) for decoding unknown protobuf files with syntax highlighting
- [`bun`](https://bun.sh/) for running scripts in this repository

Once done, you can install the dependencies using `bun install`.

### Usage of `decode.mts`

You first need a raw request or response from the service and you should put it in the `bins/` directory (`mkdir bins` if none exists).

If the entity you want to decode is already in the `proto/` directory, you can decode it using the following command.

```bash
bun decode.mts bins/GetUserProfileResponse.bin proto/public/entity/v2/GetUserProfileResponse.proto
```

However, if you're willing to contribute and your entity is not in the `proto/` directory, you can raw decode it using the following command.

```bash
bun decode.mts bins/UnknownMessageResponse.bin
```

It'll print the raw protobuf message in the terminal for easier debugging, we won't elaborate on how to retrieve the proper fields from the raw message, do as you wish.
