import { spawnSync } from "node:child_process";
import { readFile } from 'node:fs/promises';
import { gunzip } from 'node:zlib';
import { snakeCase } from "change-case";

/**
 * Decodes a raw gRPC request or response from the `./bins/` directory.
 * @returns the decompressed protobuf message.
 */
async function decode (filePath: string): Promise<Buffer | undefined> {
  const data = await readFile(filePath);
  let offset = 0;

  // The first byte indicates whether the message is compressed (1) or not (0).
  const compressed = data.readUInt8(0);
  offset += 1;

  // Retrieve the length of the message, which is stored in the next 4 bytes.
  const length = data.readUInt32BE(offset);
  offset += 4;

  // Prevent reading beyond the end of the buffer.
  if (offset + length > data.length) {
    return;
  }

  // Extract the message from the buffer.
  const message = data.subarray(offset, offset + length);

  // If the message is compressed, decompress it using zlib,
  // otherwise, return the message as is.
  if (compressed === 1) {
    return new Promise((resolve, reject) => {
      gunzip(message, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
  else {
    return message;
  }
}

const file = process.argv[2];
if (!file) {
  console.error('usage: bun decode.mts <raw_bin> [<service>/<call>]');
  process.exit(1);
}

const message = await decode(file);

if (!message) {
  console.error('incomplete request body');
  process.exit(2);
}

if (message.length === 0) {
  console.info('empty message, use google.protobuf.Empty');
  process.exit(0);
}

// eg.: search.frontend.v1.SearchService/SearchUsersRequest
const call = process.argv[3];

if (!call) {
  spawnSync("decode_raw", {
    input: message,
    stdio: "inherit"
  });
}
else {
  const [service, rootMessageName] = call.split("/");

  const path = service.split(".");
  path[path.length - 1] = snakeCase(path[path.length - 1]);
  const proto = path.join("/") + ".proto";

  path.pop();
  const protocolMessageName = path.join(".") + "." + rootMessageName;

  spawnSync("protoc", [
    "--proto_path=proto",
    `--decode=${protocolMessageName}`,
    proto
  ], {
    input: message,
    stdio: "inherit"
  });
}
