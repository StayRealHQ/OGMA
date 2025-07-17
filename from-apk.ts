/// How to obtain the `apk` directory?
/// >>> jadx -d ./apk --show-bad-code --deobf ./base.apk
/// where `base.apk` is the base APK of the app, not XAPK.

import { join, parse, sep } from "node:path";
import { glob, readFile } from "node:fs/promises";
import { camelCase, pascalCase, snakeCase } from "change-case";

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
  /return\s+.*?\.newMessageInfo\(.*new Object\[\]\s*\{([^}]*)\}[^)]*\)/;

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

const parseMesage = async (path: string, name: string) => {
  let output = messages.get(name);
  if (output) return output;

  console.log("READING", path, name, "-------------");

  const content = await readFile(join(entry, path), "utf8");
  const lines = content.split("\n").map((line) => line.trim());

  const packageName = getPackageName(content);

  const isEmptyMessage = content.includes(
    '.newMessageInfo(DEFAULT_INSTANCE, "\\u0000\\u0000", null);'
  );
  if (isEmptyMessage) {
    messages.set(
      name,
      `
message ${name} {
}
    `.trim()
    );

    console.log("empty");
    return;
  }

  const imports = getImports(content);

  const variables = Array.from(content.matchAll(VARIABLE_FIELD_REGEX)!)
    .map(([, type, name, value]) => ({
      type,
      name,
      value,
    }))
    .filter((variable) => variable.name !== "bitField0_");

  const info = content
    .match(MESSAGE_INFO_REGEX)![1]
    .split(", ")
    .map((val) => {
      try {
        return JSON.parse(val) as string;
      } catch {
        return val;
      }
    })
    .filter((field) => field !== "bitField0_");

  const fields = Array.from(content.matchAll(MESSAGE_FIELD_REFEX)!)
    .map(([, name, order]) => ({
      name: snakeCase(name),
      order: parseInt(order),
    }))
    .sort((a, b) => a.order - b.order);

  output = `message ${name} {\n`;

  let curr = 0;
  let currOrder = 1;
  let isCurrentlyInOneOf = false;

  while (curr < info.length) {
    let value = info[curr];
    let originalValue = value;
    console.log(content, curr, info, value);

    let isFieldName = value.endsWith("_");
    const isClassName = value.endsWith(".class");

    if (isFieldName) {
      // remove the extra _ at the end
      value = snakeCase(value.substring(0, value.length - 1));
    }

    if (isClassName) {
      // remove the extra .class at the end
      value = value.replace(/.class$/, "");
    }

    if (!isFieldName && !isClassName) {
      isFieldName = true;
      const field = fields.find((field) => field.order === currOrder)!;

      value = field.name;
      originalValue = camelCase(field.name) + "_";
    }

    let isOneOf = curr + 1 < info.length && info[curr + 1].endsWith("Case_");
    if (isOneOf) {
      output += `${TAB}oneof ${value} {\n`;
      isCurrentlyInOneOf = true;

      curr += 2; // skip the case field
      continue;
    }

    if (isClassName) {
      if (name !== value)
        await parseMesage(findClassPath(value, imports, packageName), value);

      if (isCurrentlyInOneOf) {
        const field = fields.find((field) => field.order === currOrder)!;
        output += `${TAB + TAB}${value} ${field.name} = ${field.order};\n`;
        currOrder++;
        curr++;
      }
    } else {
      if (isCurrentlyInOneOf) {
        output += `${TAB}}\n\n`;
        isCurrentlyInOneOf = false;
      }

      let { type, value: variableValue } = variables.find(
        ({ name }) => name === originalValue
      )!;

      if (variableValue) {
        // repeated protobuf
        if (variableValue.endsWith(".emptyProtobufList()")) {
          let next = info[curr + 1];

          // if next exists and is a class name
          if (next && next.endsWith(".class")) {
            let classNameForArray = info[curr + 1].replace(/.class$/, "");

            if (classNameForArray !== name)
              await parseMesage(
                findClassPath(classNameForArray, imports, packageName),
                classNameForArray
              );

            output += `${TAB}repeated ${classNameForArray} ${value} = ${currOrder};\n`;

            currOrder++;
            curr += 2; // skip the class name field in info
          }
          // a repeated string
          // NOTE: not sure if it's always a string?
          else {
            output += `${TAB}repeated string ${value} = ${currOrder};\n`;

            currOrder++;
            curr++;
          }

          continue;
        }

        // map!
        if (variableValue.endsWith(".emptyMapField()")) {
          const parser = info[curr + 1];
          const type = await extractMapTypeFromParser(
            parser,
            imports,
            packageName
          );

          output += `${TAB}${type} ${value} = ${currOrder};\n`;

          currOrder++;
          curr += 2; // skip the parser in info

          continue;
        }

        // repeated int32
        if (variableValue.endsWith(".emptyIntList()")) {
          output += `${TAB}repeated int32 ${value} = ${currOrder};\n`;

          currOrder++;
          curr++;

          continue;
        }

        // ByteString.EMPTY
        if (variableValue.endsWith(".EMPTY")) {
          output += `${TAB}bytes ${value} = ${currOrder};\n`;

          currOrder++;
          curr++;

          continue;
        }
      }

      switch (type) {
        case "String":
          type = "string";
          break;
        case "int":
          type = "int32";
          break;
        case "long":
          type = "int64";
          break;
        case "float":
          type = "float";
          break;
        case "boolean":
          type = "bool";
          break;
        default:
          console.log("unknown type:", type, originalValue);
          if (type !== name)
            await parseMesage(findClassPath(type, imports, packageName), type);
      }

      output += `${TAB}${type} ${value} = ${currOrder};\n`;

      currOrder++;
      curr++;
    }
  }

  // When the last instruction is the oneof, this case can happen...
  if (isCurrentlyInOneOf) {
    output += `${TAB}}\n`;
  }

  output += `}\n`;
  console.log(output);
  messages.set(name, output);
};

for (const entrypoint of entrypoints) {
  await parseMesage(entrypoint.path, entrypoint.name);
}
