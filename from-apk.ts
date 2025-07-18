/// How to obtain the `apk` directory?
/// >>> jadx -d ./apk --show-bad-code --deobf ./base.apk
/// where `base.apk` is the base APK of the app, not XAPK.

import { join, parse, sep } from "node:path";
import { glob, readFile } from "node:fs/promises";
import { camelCase, pascalCase, snakeCase } from "change-case";
import {
  DecodedFieldInfo,
  decodeSchema,
  FieldInfo,
  RawMessageInfo,
} from "./protoreader";
import {
  parse as parseJava,
  createVisitor as createJavaVisitor,
} from "java-ast";

const entry = join(__dirname, "apk", "sources");
console.log("# finding all classes, ignore known useless ones.");
let files = await Array.fromAsync(glob("**/*.java", { cwd: entry }));

// Filter out all the useless packages, we won't find any protobuf in there :')
files = files.filter((path) => {
  if (path.startsWith("zendesk")) return false;
  if (path.startsWith("android")) return false;
  if (path.startsWith(`com${sep}android`)) return false;
  if (path.startsWith(`com${sep}adjust${sep}sdk`)) return false;
  if (path.startsWith(`com${sep}appharbr`)) return false;
  if (path.startsWith(`com${sep}applovin`)) return false;
  if (path.startsWith(`com${sep}arkoselabs`)) return false;
  if (path.startsWith(`com${sep}airbnb`)) return false;
  if (path.startsWith(`com${sep}amazon`)) return false;
  if (path.startsWith(`com${sep}apm`)) return false;
  if (path.startsWith(`com${sep}datadog`)) return false;
  if (path.startsWith(`com${sep}bykv`)) return false;
  if (path.startsWith(`com${sep}bytedance`)) return false;
  if (path.startsWith(`com${sep}explorestack`)) return false;
  if (path.startsWith(`com${sep}google${sep}android`)) return false;
  if (path.startsWith(`com${sep}google${sep}firebase`)) return false;
  if (path.startsWith(`com${sep}google${sep}gson`)) return false;
  if (path.startsWith(`com${sep}google${sep}maps`)) return false;
  if (path.startsWith(`com${sep}google${sep}mlkit`)) return false;
  if (path.startsWith(`com${sep}google${sep}crypto`)) return false;
  if (path.startsWith(`com${sep}google${sep}ads`)) return false;
  if (path.startsWith(`com${sep}iab`)) return false;
  if (path.startsWith(`com${sep}inmobi`)) return false;
  if (path.startsWith(`com${sep}safedk`)) return false;
  if (path.startsWith(`com${sep}pgl`)) return false;
  if (path.startsWith(`com${sep}sourcepoint`)) return false;
  if (path.startsWith(`com${sep}yalantis`)) return false;
  if (path.startsWith(`com${sep}vungle`)) return false;
  if (path.startsWith(`com${sep}squareup`)) return false;
  if (path.startsWith(`com${sep}shakebugs`)) return false;
  if (path.startsWith(`com${sep}safedk`)) return false;
  if (path.startsWith(`com${sep}russhwolf`)) return false;
  if (path.startsWith(`com${sep}pairip`)) return false;
  if (path.startsWith(`com${sep}jakewharton`)) return false;
  if (path.startsWith(`org${sep}`)) return false;
  if (path.startsWith(`retrofit2${sep}`)) return false;
  if (path.startsWith(`sg${sep}bigo`)) return false;
  if (path.startsWith(`okio${sep}`)) return false;
  if (path.startsWith(`okhttp3${sep}`)) return false;
  if (path.startsWith(`net${sep}zetetic`)) return false;
  if (path.startsWith(`io${sep}ktor`)) return false;
  if (path.startsWith(`io${sep}adn`)) return false;
  if (path.startsWith(`io${sep}bidmachine`)) return false;
  if (path.startsWith(`coil${sep}`)) return false;
  if (path.startsWith(`coil3${sep}`)) return false;

  return true;
});

console.log(
  `# done, will search gRPC services through ${files.length} files...`
);

interface Service {
  path: string;
  service: string;
  method: string;
}

let services: Service[] = [];

const SERVICE_REGEX =
  /=\s*(?:\w+\.)*\w+\s*\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\);/g;

// These are false positives to the previous regex.
const IGNORED_SERVICE_PREFIXES = [
  "profiling.upload.compression",
  "android.provider.",
  "io.grpc.internal.",
  "http://",
];

// await Promise.all(
//   files.map(async (file, index) => {
//     const content = await readFile(join(entry, file), "utf8");
//     const matches = Array.from(content.matchAll(SERVICE_REGEX));

//     for (const match of matches) {
//       const [_, service, method] = match;

//       const fqdn = service.split(".");
//       if (fqdn.length <= 2) continue;

//       if (IGNORED_SERVICE_PREFIXES.some((prefix) => service.startsWith(prefix)))
//         continue;

//       console.log(`[${index}/${files.length}][${file}]: ${service}/${method}`);

//       services.push({
//         path: file,
//         service,
//         method,
//       });
//     }
//   })
// );

services = [
  {
    path: "p685P6\\C5205a.java",
    service: "realtime.core.v1.RealTimeStreamService",
    method: "Stream",
  },
  {
    path: "p2113sK\\C27290m.java",
    service: "search.frontend.v1.SearchService",
    method: "OASearch",
  },
  {
    path: "p2113sK\\C27290m.java",
    service: "search.frontend.v1.SearchService",
    method: "SearchUsers",
  },
  {
    path: "p2025qK\\C26431F.java",
    service: "public.topic.v2.TopicService",
    method: "GetExploreFeed",
  },
  {
    path: "p2025qK\\C26431F.java",
    service: "public.topic.v2.TopicService",
    method: "SearchTopics",
  },
  {
    path: "p2025qK\\C26436K.java",
    service: "public.topic.v2.UserInterestService",
    method: "GetContentTaxonomy",
  },
  {
    path: "p2025qK\\C26436K.java",
    service: "public.topic.v2.UserInterestService",
    method: "GetUserInterest",
  },
  {
    path: "p2025qK\\C26436K.java",
    service: "public.topic.v2.UserInterestService",
    method: "PutUserInterest",
  },
  {
    path: "p1993pK\\C26105K.java",
    service: "public.relationship.v2.OnboardingService",
    method: "StepOne",
  },
  {
    path: "p1993pK\\C26105K.java",
    service: "public.relationship.v2.OnboardingService",
    method: "StepTwo",
  },
  {
    path: "p1993pK\\C26134h.java",
    service: "public.relationship.v2.ClosestFriendsService",
    method: "GetClosestFriends",
  },
  {
    path: "p1993pK\\C26137i0.java",
    service: "public.relationship.v2.RelationshipService",
    method: "CreateRelationship",
  },
  {
    path: "p1993pK\\C26137i0.java",
    service: "public.relationship.v2.RelationshipService",
    method: "DeleteRelationship",
  },
  {
    path: "p1993pK\\C26137i0.java",
    service: "public.relationship.v2.RelationshipService",
    method: "ListRelationships",
  },
  {
    path: "p1993pK\\C26146r.java",
    service: "public.relationship.v2.ContactsService",
    method: "UploadContacts",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "ViewInviteLink",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "AcceptConversation",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "ClearConversation",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "CreateConversation",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "CreateInvites",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "GetConversationFeed",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "GetConversationsById",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "GetMessages",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "GetPendingInvites",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "GetSentInvites",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "HandleInvite",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "JoinByInviteLink",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "ResetInviteLink",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "SendMessage",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "TriggerMoment",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "UpdateConversation",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "UpdateMessage",
  },
  {
    path: "p1970oy\\C24996L.java",
    service: "chat.core.v1.ChatCoreService",
    method: "UpdateUserPrefs",
  },
  {
    path: "p1912nK\\C24336i.java",
    service: "public.notification.v2.NotificationService",
    method: "GetSpecialMoments",
  },
  {
    path: "p1853lK\\C23330d.java",
    service: "public.memories.v2.MemoriesService",
    method: "GetMemoriesFeed",
  },
  {
    path: "p1853lK\\C23330d.java",
    service: "public.memories.v2.MemoriesService",
    method: "GetTopMemories",
  },
  {
    path: "p1821kK\\C22909V.java",
    service: "public.home.v2.StateService",
    method: "GetMyState",
  },
  {
    path: "p1821kK\\C22914e.java",
    service: "public.home.v2.FeedService",
    method: "GetHomeFeed",
  },
  {
    path: "p1821kK\\C22914e.java",
    service: "public.home.v2.FeedService",
    method: "GetWhatYouMissed",
  },
  {
    path: "p1821kK\\C22914e.java",
    service: "public.home.v2.FeedService",
    method: "MarkPostsAsSeen",
  },
  {
    path: "p1780jK\\C22373c.java",
    service: "public.fofs.v2.FoFFeedService",
    method: "GetFoFFeed",
  },
  {
    path: "p1734iK\\C20797C.java",
    service: "public.entity.v2.UserService",
    method: "GetUserProfile",
  },
  {
    path: "p1734iK\\C20797C.java",
    service: "public.entity.v2.UserService",
    method: "SetLocation",
  },
  {
    path: "p1734iK\\C20822y.java",
    service: "public.entity.v2.PostService",
    method: "GetPosts",
  },
  {
    path: "p1734iK\\C20822y.java",
    service: "public.entity.v2.PostService",
    method: "SetPostsAsPublic",
  },
  {
    path: "p1693hK\\C20389B.java",
    service: "public.discovery.v2.PlacesService",
    method: "SearchPlace",
  },
  {
    path: "p1693hK\\C20392c.java",
    service: "public.discovery.v2.FeedDiscoveryV2Service",
    method: "GetFeedV2",
  },
  {
    path: "p1690hG\\C20364e.java",
    service: "feed.discovery.v1.FeedDiscoveryService",
    method: "FeedInteraction",
  },
  {
    path: "p1690hG\\C20364e.java",
    service: "feed.discovery.v1.FeedDiscoveryService",
    method: "GetPublicPosts",
  },
  {
    path: "p1690hG\\C20364e.java",
    service: "feed.discovery.v1.FeedDiscoveryService",
    method: "PostSeen",
  },
  {
    path: "p1665gK\\C19888d.java",
    service: "public.activity.v2.ActivityService",
    method: "GetActivityFeed",
  },
  {
    path: "p1665gK\\C19888d.java",
    service: "public.activity.v2.ActivityService",
    method: "MarkActivitiesAsSeen",
  },
  {
    path: "p1238bJ\\C12313h.java",
    service: "officialaccounts.relationships.v1.RelationshipsService",
    method: "GetAllFollowing",
  },
  {
    path: "p1198aJ\\C9465c.java",
    service: "officialaccounts.discovery.v1.DiscoveryService",
    method: "GetRecommendations",
  },
  {
    path: "p1105YI\\C8606c.java",
    service: "media.upload.v1.MediaUploadService",
    method: "CreateUploadUrls",
  },
];

console.log(`# done, found ${services.length} methods`);
console.log(`# looking up request and response messages...`);

const IMPORT_REGEX = /^import\s+([a-zA-Z0-9_.]+);/gm;
const PACKAGE_REGEX = /^package\s+([a-zA-Z0-9_.]+);?/m;

const findClassPath = (
  className: string,
  imports: string[],
  packageName: string
) => {
  // We check if we have the class in our imports.
  const imp = imports.find((imp) => imp.includes(className));

  // If we don't then the class in in the same package as ours.
  const fqdn = imp || `${packageName}.${className}`;

  // Return the path relative to our entry.
  return fqdn.replaceAll(".", sep) + ".java";
};

const getPackageName = (content: string) => content.match(PACKAGE_REGEX)?.[1]!;
const getImports = (content: string) =>
  Array.from(content.matchAll(IMPORT_REGEX) ?? []).map(([, path]) => path);
/**
 * All messages retrieved.
 * @key path of the java class
 */
const messages = new Map<string, string>();

interface Message {
  name: string;
  content: string;
}

const entrypoints: Array<{ path: string; name: string; namespace?: string }> =
  [];

for (const service of services) {
  const content = await readFile(join(entry, service.path), "utf8");
  const lines = content.split("\n").map((line) => line.trim());

  const packageName = getPackageName(content);
  const imports = getImports(content);

  // Find where we matched the definition.
  const index = lines.findIndex((line) =>
    line.includes(`"${service.service}", "${service.method}"`)
  );

  // +2 => creation of the request message builder.
  const requestMessageClassName = lines[index + 2].split(" ")[0];

  // + 5 => creation of the response message builder.
  const responseMessageClassName = lines[index + 5].split("(")[1].split(".")[0];

  const requestMessageClassPath = findClassPath(
    requestMessageClassName,
    imports,
    packageName
  );

  const responseMessageClassPath = findClassPath(
    responseMessageClassName,
    imports,
    packageName
  );

  let namespace: string;
  {
    const paths = service.service.split(".");
    paths.pop();
    namespace = paths.join(".");
  }

  const requestMessageName = `${service.method}Request`;
  const responseMessageName = `${service.method}Response`;

  entrypoints.push(
    {
      path: requestMessageClassPath,
      name: requestMessageName,
      namespace,
    },
    {
      path: responseMessageClassPath,
      name: responseMessageName,
      namespace,
    }
  );

  console.log(
    `[${service.service}/${service.method}]: req->${requestMessageClassPath} ; res->${responseMessageClassPath}`
  );
}

const MESSAGE_INFO_REGEX =
  /return\s+.*?\.newMessageInfo\(.*,\s+(.*),\s+.*new Object\[\]\s*\{([^}]*)\}[^)]*\)/;

const MESSAGE_FIELD_REFEX =
  /public\s+static\s+final\s+int\s+(\w+)_FIELD_NUMBER\s*=\s*(\d+);/g;

const VARIABLE_FIELD_REGEX = /private\s+(.+)\s+(\w+_)\s*(?:=\s*([^;]*))?;/g;

const MAP_PARSER_FIELD_REGEX =
  /public\s+static\s+final\s+\w+\s+(\w+)\s+=\s+.+\((.*),\s+.*,\s+(.*),\s+.*[^)]*\);/g;

const TAB = " ".repeat(2);

const extractMapTypeFromParser = async (
  parser: string,
  imports: string[],
  referencePackageName: string
): Promise<string> => {
  const [parserClassName, parserMethod] = parser.split(".");

  const path = findClassPath(parserClassName, imports, referencePackageName);
  const content = await readFile(join(entry, path), "utf8");

  const method = Array.from(content.matchAll(MAP_PARSER_FIELD_REGEX))
    .map(([, functionName, keyType, valueType]) => ({
      functionName,
      keyType,
      valueType,
    }))
    .find(({ functionName }) => functionName === parserMethod);

  if (!method) throw new Error("was not able to find the map<> parser method");

  const readType = (type: string) => {
    const fragments = type.split(".");
    type = fragments.at(-1)!.toLowerCase();

    switch (type) {
      case "bool":
      case "bytes":
      case "double":
      case "float":
      case "int32":
      case "int64":
      case "string":
        break;
      default:
        throw new Error("map type is probably not handled: " + type);
    }

    return type;
  };

  return `map<${readType(method.keyType)}, ${readType(method.valueType)}>`;
};

const toClassName = (v: string) => v.replace(/.class$/, "");
const toFieldName = (v: string) => {
  return snakeCase(v.substring(0, v.length - 1));
};

// const parseMesage = async (path: string, name: string) => {
//   let output = messages.get(name);
//   if (output) return output;

//   console.log("READING", path, name, "-------------");

//   const content = await readFile(join(entry, path), "utf8");
//   const lines = content.split("\n").map((line) => line.trim());

//   const packageName = getPackageName(content);

//   const isEmptyMessage = content.includes(
//     '.newMessageInfo(DEFAULT_INSTANCE, "\\u0000\\u0000", null);'
//   );
//   if (isEmptyMessage) {
//     messages.set(
//       name,
//       `
// message ${name} {
// }
//     `.trim()
//     );

//     console.log("empty");
//     return;
//   }

//   const imports = getImports(content);

//   const variables = Array.from(content.matchAll(VARIABLE_FIELD_REGEX)!)
//     .map(([, type, name, value]) => ({
//       type,
//       name,
//       value,
//     }))
//     .filter((variable) => variable.name !== "bitField0_");

//   const info = content
//     .match(MESSAGE_INFO_REGEX)![1]
//     .split(", ")
//     .map((val) => {
//       try {
//         return JSON.parse(val) as string;
//       } catch {
//         return val;
//       }
//     })
//     .filter((field) => field !== "bitField0_");

//   const fields = Array.from(content.matchAll(MESSAGE_FIELD_REFEX)!)
//     .map(([, name, order]) => ({
//       name: snakeCase(name),
//       order: parseInt(order),
//     }))
//     .sort((a, b) => a.order - b.order);

//   output = `message ${name} {\n`;

//   let curr = 0;
//   let currOrder = 1;
//   let isCurrentlyInOneOf = false;

//   while (curr < info.length) {
//     let value = info[curr];
//     let originalValue = value;
//     console.log(content, curr, info, value);

//     let isFieldName = value.endsWith("_");
//     const isClassName = value.endsWith(".class");

//     if (isFieldName) {
//       // remove the extra _ at the end
//       value = snakeCase(value.substring(0, value.length - 1));
//     }

//     if (isClassName) {
//       // remove the extra .class at the end
//       value = value.replace(/.class$/, "");
//     }

//     if (!isFieldName && !isClassName) {
//       isFieldName = true;
//       const field = fields.find((field) => field.order === currOrder)!;

//       value = field.name;
//       originalValue = camelCase(field.name) + "_";
//     }

//     let isOneOf = curr + 1 < info.length && info[curr + 1].endsWith("Case_");
//     if (isOneOf) {
//       output += `${TAB}oneof ${value} {\n`;
//       isCurrentlyInOneOf = true;

//       curr += 2; // skip the case field
//       continue;
//     }

//     if (isClassName) {
//       if (name !== value)
//         await parseMesage(findClassPath(value, imports, packageName), value);

//       if (isCurrentlyInOneOf) {
//         const field = fields.find((field) => field.order === currOrder)!;
//         output += `${TAB + TAB}${value} ${field.name} = ${field.order};\n`;
//         currOrder++;
//         curr++;
//       }
//     } else {
//       if (isCurrentlyInOneOf) {
//         output += `${TAB}}\n\n`;
//         isCurrentlyInOneOf = false;
//       }

//       let { type, value: variableValue } = variables.find(
//         ({ name }) => name === originalValue
//       )!;

//       if (variableValue) {
//         // repeated protobuf
//         if (variableValue.endsWith(".emptyProtobufList()")) {
//           let next = info[curr + 1];

//           // if next exists and is a class name
//           if (next && next.endsWith(".class")) {
//             let classNameForArray = info[curr + 1].replace(/.class$/, "");

//             if (classNameForArray !== name)
//               await parseMesage(
//                 findClassPath(classNameForArray, imports, packageName),
//                 classNameForArray
//               );

//             output += `${TAB}repeated ${classNameForArray} ${value} = ${currOrder};\n`;

//             currOrder++;
//             curr += 2; // skip the class name field in info
//           }
//           // a repeated string
//           // NOTE: not sure if it's always a string?
//           else {
//             output += `${TAB}repeated string ${value} = ${currOrder};\n`;

//             currOrder++;
//             curr++;
//           }

//           continue;
//         }

//         // map!
//         if (variableValue.endsWith(".emptyMapField()")) {
//           const parser = info[curr + 1];
//           const type = await extractMapTypeFromParser(
//             parser,
//             imports,
//             packageName
//           );

//           output += `${TAB}${type} ${value} = ${currOrder};\n`;

//           currOrder++;
//           curr += 2; // skip the parser in info

//           continue;
//         }

//         // repeated int32
//         if (variableValue.endsWith(".emptyIntList()")) {
//           output += `${TAB}repeated int32 ${value} = ${currOrder};\n`;

//           currOrder++;
//           curr++;

//           continue;
//         }

//         // ByteString.EMPTY
//         if (variableValue.endsWith(".EMPTY")) {
//           output += `${TAB}bytes ${value} = ${currOrder};\n`;

//           currOrder++;
//           curr++;

//           continue;
//         }
//       }

//       switch (type) {
//         case "String":
//           type = "string";
//           break;
//         case "int":
//           type = "int32";
//           break;
//         case "long":
//           type = "int64";
//           break;
//         case "float":
//           type = "float";
//           break;
//         case "boolean":
//           type = "bool";
//           break;
//         default:
//           console.log("unknown type:", type, originalValue);
//           if (type !== name)
//             await parseMesage(findClassPath(type, imports, packageName), type);
//       }

//       output += `${TAB}${type} ${value} = ${currOrder};\n`;

//       currOrder++;
//       curr++;
//     }
//   }

//   // When the last instruction is the oneof, this case can happen...
//   if (isCurrentlyInOneOf) {
//     output += `${TAB}}\n`;
//   }

//   output += `}\n`;
//   console.log(output);
//   messages.set(name, output);
// };

const parseEnum = async (path: string, className: string): Promise<void> => {
  if (messages.has(className)) return;

  console.log("> PARSING ENUM", path, "->", className);
  const content = await readFile(join(entry, path), "utf8");
  const enumValues: Record<string, number> = {};

  const java = parseJava(content);
  createJavaVisitor({
    visitEnumConstant(ctx) {
      // DATA_TYPE_UNSPECIFIED(0)
      let [name, _value] = ctx.text.split("(");
      if (name === "UNRECOGNIZED") return; // skip additional property added by protoc.

      _value = _value.substring(0, _value.length - 1); // remove extra )
      const value = Number(_value);

      enumValues[name] = value;
    },
  }).visit(java);

  const message =
    `
syntax = "proto3";

message ${className} {
${Object.entries(enumValues)
  .map(([key, value]) => `${TAB}${key} = ${value};`)
  .join("\n")}
}
  `.trim() + "\n";

  console.log(message);
  messages.set(className, message);
};

const parseMessage = async (path: string, className: string): Promise<void> => {
  if (messages.has(className)) return;

  const content = await readFile(join(entry, path), "utf8");
  const packageName = getPackageName(content);

  const outputs = {
    root: {},
    oneofs: {},
  } satisfies Outputs;

  const isEmptyMessage = content.includes(
    'newMessageInfo(DEFAULT_INSTANCE, "\\u0000\\u0000", null);'
  );

  if (isEmptyMessage) {
    messages.set(className, rawOutputsToMessage(outputs, className));
    return;
  }

  console.log("> PARSING MESSAGE", path, "->", className);
  const imports = getImports(content);

  const assertMessageReference = async (
    refClassName: string
  ): Promise<void> => {
    if (refClassName === className) return;
    return parseMessage(
      findClassPath(refClassName, imports, packageName),
      refClassName
    );
  };

  const assertEnumReference = async (enumClassName: string): Promise<void> => {
    return parseEnum(
      findClassPath(enumClassName, imports, packageName),
      enumClassName
    );
  };

  const variables = Array.from(content.matchAll(VARIABLE_FIELD_REGEX)!)
    .map(([, type, name, value]) => ({
      type,
      name,
      value,
    }))
    .filter((variable) => variable.name !== "bitField0_");

  const [, _info, _objects] = content.match(MESSAGE_INFO_REGEX)!;
  const info = JSON.parse(_info);
  const objects = _objects.split(", ").map((val) => {
    try {
      return JSON.parse(val) as string;
    } catch {
      return val;
    }
  });

  // `public static final init <FIELD_NAME>_FIELD_NUMBER = <ORDER>`
  const fields = Array.from(content.matchAll(MESSAGE_FIELD_REFEX)!)
    .map(([, name, order]) => ({
      name: snakeCase(name),
      order: parseInt(order),
    }))
    .sort((a, b) => a.order - b.order);

  const message = new RawMessageInfo(info, objects);
  const schema = decodeSchema(message, info, objects);

  // console.log({ fields, variables });

  for (const field of schema) {
    // a message list or a map
    if (field.associatedObject) {
      if (field.fieldTypeName === "MESSAGE_LIST") {
        const fieldName = toFieldName(field.fieldName!);
        const objectClassName = toClassName(field.associatedObject);
        // await assertReference(objectClassName);

        outputs.root[fieldName] = {
          no: field.fieldNumber,
          type: objectClassName,
          repeated: true,
        };
      } else if (field.fieldTypeName === "MAP") {
      } else {
        console.log(
          ">> ERROR",
          field.fieldTypeName,
          field.fieldName,
          field.fieldNumber,
          field.associatedObject
        );

        throw new Error(
          "field with associated object that is not a map or a message list"
        );
      }
    }
    // oneof
    else if (field.oneofInfo) {
      const javaField = fields.find((f) => f.order === field.fieldNumber)!;
      const fieldName = toFieldName(field.oneofInfo.oneofFieldName);

      const output = {
        no: javaField.order,
        type: field.fieldTypeName,
      };

      if (field.oneofInfo.associatedObject) {
        const objectClassName = toClassName(field.oneofInfo.associatedObject);
        await assertMessageReference(objectClassName);
        output.type = objectClassName;
      }

      if (fieldName in outputs.oneofs) {
        outputs.oneofs[fieldName][javaField.name] = output;
      } else {
        outputs.oneofs[fieldName] = {
          [javaField.name]: output,
        };
      }
    }
    // a normal field containing a primitive value or a message.
    else {
      const javaField = fields.find((f) => f.order === field.fieldNumber)!;
      let type = field.fieldTypeName;
      let repeated = false;

      if (type === "MESSAGE") {
        let { type: javaType } = variables.find(
          (v) => v.name === field.fieldName
        )!;

        await assertMessageReference(javaType);
        type = javaType;
      } else if (type === "STRING_LIST") {
        type = "string";
        repeated = true;
      } else if (field.fieldTypeName === "ENUM") {
        const foundEnumClass = searchThroughJavaClassForEnum(content, field);

        // since enums are backed by int32, if we can't find the original
        // enum, we'll use int32 instead!
        if (!foundEnumClass) {
          type = "int32";
          global.aa ??= 0;
          global.aa++;
          if (global.aa >= 2) {
            // console.log(content, field.fieldName);
            throw null;
          }
        } else {
          await assertEnumReference(foundEnumClass);
          type = foundEnumClass;
        }
      } else {
        type = type.toLowerCase();
      }

      outputs.root[javaField.name] = {
        no: javaField.order,
        type,
        repeated,
      };
    }
  }

  // console.log(JSON.stringify(outputs, null, 2));
  messages.set(className, rawOutputsToMessage(outputs, className));
};
const searchThroughJavaClassForEnum = (
  content: string,
  field: DecodedFieldInfo
): string | undefined => {
  let foundClass: string | undefined;

  const java = parseJava(content);
  createJavaVisitor({
    /// Since compiled proto might be optimized by proguard to automatically
    /// remove not used functions, we try to find the enum reference by all possible way.
    visitMethodDeclaration(ctx) {
      const statements = ctx.methodBody().block()?.blockStatement()!;

      {
        // last parameter and last statement, set enum value builder method

        // public static void m50874m(C25137y0 c25137y0, EnumC25121u0 enumC25121u0) {
        //                                                            ^^^^^^^^^^^^ should match with the variable name below.
        const lastParameter = ctx
          .formalParameters()
          .formalParameterList()
          ?.formalParameter()
          .at(-1);

        const lastParameterId = lastParameter?.variableDeclaratorId().text;
        const lastParameterType = lastParameter?.typeType().text;

        // c25137y0.rank_ = enumC25121u0.getNumber();
        //          ^^^^^ field.fieldName !
        const lastStmt = statements[statements.length - 1]?.statement();

        if (lastParameterId && lastParameterType && lastStmt) {
          const declarationId = lastStmt
            .expression()[0]
            ?.getChild(0)
            .text.split(".")[1];

          // we have found our field! let's try to find the enum now...
          if (declarationId === field.fieldName!) {
            // additional check, just in case:
            // the equality should reference the default value declaration id.

            const [reference] = lastStmt
              .expression()[0]
              ?.getChild(2)
              .text.split(".");

            if (reference === lastParameterId) {
              console.log("found an enum type!", lastParameterType);
              foundClass = lastParameterType;
            }
          }
        }

        if (foundClass) return;
      }

      {
        // first and last statement, default enum value builder method

        // EnumC23821O enumC23821O = EnumC23821O.HYDRATION_SIZE_SMALL;
        //             ^^^^^^^^^^^ should match with the variable name below.
        const firstStmt = statements[0]?.localVariableDeclaration();

        // c26446j.hydrationSize_ = enumC23821O.getNumber();
        //         ^^^^^^^^^^^^^^ field.fieldName !
        const lastStmt = statements[statements.length - 1]?.statement();

        if (firstStmt && lastStmt) {
          const declarationId = lastStmt
            .expression()[0]
            ?.getChild(0)
            .text.split(".")[1];

          // we have found our field! let's try to find the enum now...
          if (declarationId === field.fieldName!) {
            const enumClassName = firstStmt.typeType()?.text;
            const defaultValueDeclarationId = firstStmt
              .variableDeclarators()
              ?.variableDeclarator()[0]
              ?.variableDeclaratorId().text;

            // additional check, just in case:
            // the equality should reference the default value declaration id.

            const [reference] = lastStmt
              .expression()[0]
              ?.getChild(2)
              .text.split(".");

            if (reference === defaultValueDeclarationId) {
              console.log("found an enum type!", enumClassName);
              foundClass = enumClassName;
            }
          }
        }

        if (foundClass) return;
      }

      {
        // `switch` method

        // EnumC26920d enumC26920d;
        // ^ statements[0]

        // switch (this.type_) {}
        //              ^^^^^ field.fieldName !
        let switchStmt = statements[1]?.statement();
        if (switchStmt) {
          if (switchStmt.getChild(1).text === `(this.${field.fieldName!})`) {
            // public final EnumC26920d m56420l() {}
            let currentClassName = ctx.typeTypeOrVoid().text;

            console.log("found an enum type!", currentClassName);
            foundClass = currentClassName;
          }
        }

        if (foundClass) return;
      }
    },
  }).visit(java);

  return foundClass;
};

interface Field {
  no: number;
  type: string;
  repeated?: boolean;
}

interface Outputs {
  root: Record<string, Field>;
  oneofs: Record<string, Record<string, Field>>;
}

const rawOutputsToMessage = (outputs: Outputs, className: string): string => {
  let message = `syntax = "proto3";\n\n`;

  // start of the message ------------------------------------------------------
  message += `message ${className} {\n`; // open

  const handleFields = (fields: Record<string, Field>, tab = TAB): void => {
    const writeln = (v: string) => {
      message += tab + v + "\n";
    };

    for (const [fieldName, field] of Object.entries(fields)) {
      writeln(
        `${field.repeated ? "repeated " : ""}${field.type} ${fieldName} = ${
          field.no
        };`
      );
    }
  };

  // oneof fields
  for (const [name, fields] of Object.entries(outputs.oneofs)) {
    message += TAB + `oneof ${name} {\n`;
    handleFields(fields, TAB + TAB);
    message += TAB + `}\n\n`;
  }

  // root fields
  handleFields(outputs.root);

  message += `}\n`; // close
  // end of the message --------------------------------------------------------

  console.log(message);
  return message;
};

for (const entrypoint of entrypoints) {
  await parseMessage(entrypoint.path, entrypoint.name);
}
