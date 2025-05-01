import { spawnSync } from "node:child_process";
import { readFile } from 'node:fs/promises';
import { gunzip } from 'node:zlib';

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
  console.error('usage: bun decode.mts <raw_message> [<proto_file_to_use>]');
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

const proto = process.argv[3];
if (!proto) {
  spawnSync("decode_raw", {
    input: message,
    stdio: "inherit"
  });
}
else {
  let path = proto.replace(/\.proto$/, "");

  if (path.startsWith("./")) {
    path = path.slice(2);
  }

  const paths = path.split("/");
  paths.shift();

  const protocolMessageName = paths.join(".");

  spawnSync("protoc", [
    "--proto_path=proto", // use the proto directory as the proto path.
    `--decode=${protocolMessageName}`,
    proto
  ], {
    input: message,
    stdio: "inherit"
  });
}
