export enum ProtoSyntax {
  PROTO2 = "PROTO2",
  PROTO3 = "PROTO3",
  EDITIONS = "EDITIONS",
}

export interface MessageInfo {
  getSyntax(): ProtoSyntax;
  isMessageSetWireFormat(): boolean;
}

/**
 * RawMessageInfo stores the same amount of information as MessageInfo but in a more compact
 * format.
 */
export class RawMessageInfo implements MessageInfo {
  private static readonly IS_PROTO2_BIT = 0x1;
  private static readonly IS_EDITION_BIT = 0x4;

  /**
   * The compact format packs everything in a String object and a Object[] array. The String object
   * is encoded with field number, field type, hasbits offset, oneof index, etc., whereas the
   * Object[] array contains field references, class references, instance references, etc.
   *
   * The String object encodes a sequence of integers into UTF-16 characters. For each int, it
   * will be encoding into 1 to 3 UTF-16 characters depending on its unsigned value:
   *
   * - 1 char: [c1: 0x0000 - 0xD7FF] = int of the same value.
   * - 2 chars: [c1: 0xE000 - 0xFFFF], [c2: 0x0000 - 0xD7FF] = (c2 << 13) | (c1 & 0x1FFF)
   * - 3 chars: [c1: 0xE000 - 0xFFFF], [c2: 0xE000 - 0xFFFF], [c3: 0x0000 - 0xD7FF] = (c3 << 26)
   *       | ((c2 & 0x1FFF) << 13) | (c1 & 0x1FFF)
   *
   * Note that we don't use UTF-16 surrogate pairs [0xD800 - 0xDFFF] because they have to come in
   * pairs to form a valid UTF-16char sequence and don't help us encode values more efficiently.
   *
   * The integer sequence encoded in the String object has the following layout:
   *
   * - [0]: flags, flags & 0x1 = is proto2?, flags & 0x2 = is message?, flags & 0x4 = is edition?
   * - [1]: field count, if 0, this is the end of the integer sequence and the corresponding
   *       Object[] array should be null.
   * - [2]: oneof count
   * - [3]: hasbits count, how many hasbits integers are generated.
   * - [4]: min field number
   * - [5]: max field number
   * - [6]: total number of entries need to allocate
   * - [7]: map field count
   * - [8]: repeated field count, this doesn't include map fields.
   * - [9]: size of checkInitialized array
   * - [...]: field entries
   *
   * Each field entry starts with a field number and the field type:
   *
   * - [0]: field number
   * - [1]: field type with extra bits:
   *     - v & 0xFF = field type as defined in the FieldType class
   *     - v & 0x0100 = is required?
   *     - v & 0x0200 = is checkUtf8?
   *     - v & 0x0400 = needs isInitialized check?
   *     - v & 0x0800 = is enum field or map field enum value with legacy closedness?
   *     - v & 0x1000 = supports presence checking?
   *
   * If the (singular) field supports presence checking:
   *
   * - [2]: hasbits offset
   *
   * If the field is in an oneof:
   *
   * - [2]: oneof index
   *
   * For other types, the field entry only has field number and field type.
   *
   * The Object[] array has 3 sections:
   *
   * - ---- oneof section ----
   *     - [0]: value field for oneof 1.
   *     - [1]: case field for oneof 1.
   *     - ...
   *     - [.]: value field for oneof n.
   *     - [.]: case field for oneof n.
   * - ---- hasbits section ----
   *     - [.]: hasbits field 1
   *     - [.]: hasbits field 2
   *     - ...
   *     - [.]: hasbits field n
   * - ---- field section ----
   *     - [...]: field entries
   *
   * In the Object[] array, field entries are ordered in the same way as field entries in the
   * String object. The size of each entry is determined by the field type.
   *
   * - Oneof field:
   *     - Oneof message field:
   *         - [0]: message class reference.
   *     - Oneof enum fieldin proto2:
   *         - [0]: EnumLiteMap
   *     - For all other oneof fields, field entry in the Object[] array is empty.
   * - Repeated message field:
   *     - [0]: field reference
   *     - [1]: message class reference
   * - Proto2 singular/repeated enum field:
   *     - [0]: field reference
   *     - [1]: EnumLiteMap
   * - Map field with a proto2 enum value:
   *     - [0]: field reference
   *     - [1]: map default entry instance
   *     - [2]: EnumLiteMap
   * - Map field with other value types:
   *     - [0]: field reference
   *     - [1]: map default entry instance
   * - All other field type:
   *     - [0]: field reference
   *
   * In order to read the field info from this compact format, a reader needs to progress through
   * the String object and the Object[] array simultaneously.
   */
  private readonly info: string;

  private readonly objects: any[];
  private readonly flags: number;

  constructor(info: string, objects: any[]) {
    this.info = info;
    this.objects = objects;

    let position = 0;
    let value = info.charCodeAt(position++);

    if (value < 0xd800) {
      this.flags = value;
    } else {
      let result = value & 0x1fff;
      let shift = 13;

      while ((value = info.charCodeAt(position++)) >= 0xd800) {
        result |= (value & 0x1fff) << shift;
        shift += 13;
      }

      this.flags = result | (value << shift);
    }
  }

  getStringInfo(): string {
    return this.info;
  }

  getObjects(): any[] {
    return this.objects;
  }

  getSyntax(): ProtoSyntax {
    if ((this.flags & RawMessageInfo.IS_PROTO2_BIT) !== 0) {
      return ProtoSyntax.PROTO2;
    } else if ((this.flags & RawMessageInfo.IS_EDITION_BIT) === 0x4) {
      return ProtoSyntax.EDITIONS;
    } else {
      return ProtoSyntax.PROTO3;
    }
  }

  isMessageSetWireFormat(): boolean {
    return (this.flags & 0x2) === 0x2;
  }
}

// Constants from Java implementation
export const INTS_PER_FIELD = 3;
export const OFFSET_BITS = 20;
export const OFFSET_MASK = 0xfffff;
export const FIELD_TYPE_MASK = 0x0ff00000;
export const REQUIRED_MASK = 0x10000000;
export const ENFORCE_UTF8_MASK = 0x20000000;
export const LEGACY_ENUM_IS_CLOSED_MASK = 0x80000000;
export const NO_PRESENCE_SENTINEL = -1 & OFFSET_MASK;
export const EMPTY_INT_ARRAY: number[] = [];

// Bit masks for field type extra feature bits
export const REQUIRED_BIT = 0x100;
export const UTF8_CHECK_BIT = 0x200;
export const CHECK_INITIALIZED_BIT = 0x400;
export const LEGACY_ENUM_IS_CLOSED_BIT = 0x800;
export const HAS_HAS_BIT = 0x1000;

// Field type offset for oneof fields
export const ONEOF_TYPE_OFFSET = 51;

export interface FieldInfo {
  fieldNumber: number;
  fieldType: number;
  fieldTypeWithExtraBits: number;
  fieldOffset: number;
  presenceFieldOffset: number;
  presenceMaskShift: number;
}

export class MessageSchema {
  private readonly buffer: number[];
  private readonly objects: any[];
  private readonly minFieldNumber: number;
  private readonly maxFieldNumber: number;
  private readonly intArray: number[];
  private readonly checkInitializedCount: number;
  private readonly repeatedFieldOffsetStart: number;

  constructor(
    buffer: number[],
    objects: any[],
    minFieldNumber: number,
    maxFieldNumber: number,
    intArray: number[],
    checkInitialized: number,
    mapFieldPositions: number
  ) {
    this.buffer = buffer;
    this.objects = objects;
    this.minFieldNumber = minFieldNumber;
    this.maxFieldNumber = maxFieldNumber;
    this.intArray = intArray;
    this.checkInitializedCount = checkInitialized;
    this.repeatedFieldOffsetStart = mapFieldPositions;
  }

  /**
   * Decodes a variable-length integer from the string format used in protobuf schema info.
   * This matches the Java implementation's decoding logic.
   */
  private static decodeVarint(
    info: string,
    position: { value: number }
  ): number {
    let next = info.charCodeAt(position.value++);

    if (next < 0xd800) {
      return next;
    }

    let result = next & 0x1fff;
    let shift = 13;

    while ((next = info.charCodeAt(position.value++)) >= 0xd800) {
      result |= (next & 0x1fff) << shift;
      shift += 13;
    }

    return result | (next << shift);
  }

  /**
   * Creates a new MessageSchema from RawMessageInfo.
   * This is the TypeScript equivalent of the Java newSchemaForRawMessageInfo method.
   */
  static newSchemaForRawMessageInfo(
    messageInfo: RawMessageInfo
  ): MessageSchema {
    const info = messageInfo.getStringInfo();
    const messageInfoObjects = messageInfo.getObjects();
    const length = info.length;
    let i = 0;

    // Decode flags
    let next = info.charCodeAt(i++);
    if (next >= 0xd800) {
      let result = next & 0x1fff;
      let shift = 13;
      while ((next = info.charCodeAt(i++)) >= 0xd800) {
        result |= (next & 0x1fff) << shift;
        shift += 13;
      }
      next = result | (next << shift);
    }
    const unusedFlags = next;

    // Decode field count
    next = info.charCodeAt(i++);
    if (next >= 0xd800) {
      let result = next & 0x1fff;
      let shift = 13;
      while ((next = info.charCodeAt(i++)) >= 0xd800) {
        result |= (next & 0x1fff) << shift;
        shift += 13;
      }
      next = result | (next << shift);
    }
    const fieldCount = next;

    let oneofCount: number;
    let hasBitsCount: number;
    let minFieldNumber: number;
    let maxFieldNumber: number;
    let numEntries: number;
    let mapFieldCount: number;
    let repeatedFieldCount: number;
    let checkInitialized: number;
    let intArray: number[];
    let objectsPosition: number;

    if (fieldCount === 0) {
      oneofCount = 0;
      hasBitsCount = 0;
      minFieldNumber = 0;
      maxFieldNumber = 0;
      numEntries = 0;
      mapFieldCount = 0;
      repeatedFieldCount = 0;
      checkInitialized = 0;
      intArray = EMPTY_INT_ARRAY;
      objectsPosition = 0;
    } else {
      // Decode oneofCount
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      oneofCount = next;

      // Decode hasBitsCount
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      hasBitsCount = next;

      // Decode minFieldNumber
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      minFieldNumber = next;

      // Decode maxFieldNumber
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      maxFieldNumber = next;

      // Decode numEntries
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      numEntries = next;

      // Decode mapFieldCount
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      mapFieldCount = next;

      // Decode repeatedFieldCount
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      repeatedFieldCount = next;

      // Decode checkInitialized
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      checkInitialized = next;
      intArray = new Array(
        checkInitialized + mapFieldCount + repeatedFieldCount
      );
      // Field objects are after a list of (oneof, oneofCase) pairs + a list of hasbits fields
      objectsPosition = oneofCount * 2 + hasBitsCount;
    }

    let checkInitializedPosition = 0;
    const buffer: number[] = new Array(numEntries * INTS_PER_FIELD);
    const objects: any[] = new Array(numEntries * 2);

    let mapFieldIndex = checkInitialized;
    let repeatedFieldIndex = checkInitialized + mapFieldCount;

    let bufferIndex = 0;
    while (i < length) {
      // Decode field number
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      const fieldNumber = next;

      // Decode field type with extra bits
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
      const fieldTypeWithExtraBits = next;
      const fieldType = fieldTypeWithExtraBits & 0xff;

      if ((fieldTypeWithExtraBits & CHECK_INITIALIZED_BIT) !== 0) {
        intArray[checkInitializedPosition++] = bufferIndex;
      }

      let fieldOffset: number;
      let presenceMaskShift: number;
      let presenceFieldOffset: number;

      // Oneof field handling
      if (fieldType >= ONEOF_TYPE_OFFSET) {
        // Decode oneof index
        next = info.charCodeAt(i++);
        if (next >= 0xd800) {
          let result = next & 0x1fff;
          let shift = 13;
          while ((next = info.charCodeAt(i++)) >= 0xd800) {
            result |= (next & 0x1fff) << shift;
            shift += 13;
          }
          next = result | (next << shift);
        }
        const oneofIndex = next;

        const oneofFieldType = fieldType - ONEOF_TYPE_OFFSET;
        if (
          oneofFieldType === 9 /* MESSAGE */ ||
          oneofFieldType === 17 /* GROUP */
        ) {
          objects[Math.floor(bufferIndex / INTS_PER_FIELD) * 2 + 1] =
            messageInfoObjects[objectsPosition++];
        } else if (oneofFieldType === 12 /* ENUM */) {
          if (
            messageInfo.getSyntax() === ProtoSyntax.PROTO2 ||
            (fieldTypeWithExtraBits & LEGACY_ENUM_IS_CLOSED_BIT) !== 0
          ) {
            objects[Math.floor(bufferIndex / INTS_PER_FIELD) * 2 + 1] =
              messageInfoObjects[objectsPosition++];
          }
        }

        // In TypeScript, we simulate field offset calculation
        // The Java code uses unsafe.objectFieldOffset() which we can't replicate exactly
        fieldOffset = oneofIndex; // Simplified offset calculation
        presenceFieldOffset = oneofIndex + 1000; // Simulate case field offset
        presenceMaskShift = 0;
      } else {
        // Regular field handling
        const fieldName = messageInfoObjects[objectsPosition++];

        if (fieldType === 9 /* MESSAGE */ || fieldType === 17 /* GROUP */) {
          objects[Math.floor(bufferIndex / INTS_PER_FIELD) * 2 + 1] = fieldName; // Use field name for MESSAGE/GROUP
        } else if (
          fieldType === 27 /* MESSAGE_LIST */ ||
          fieldType === 49 /* GROUP_LIST */
        ) {
          objects[Math.floor(bufferIndex / INTS_PER_FIELD) * 2 + 1] =
            messageInfoObjects[objectsPosition++];
        } else if (
          fieldType === 12 /* ENUM */ ||
          fieldType === 30 /* ENUM_LIST */ ||
          fieldType === 44 /* ENUM_LIST_PACKED */
        ) {
          if (
            messageInfo.getSyntax() === ProtoSyntax.PROTO2 ||
            (fieldTypeWithExtraBits & LEGACY_ENUM_IS_CLOSED_BIT) !== 0
          ) {
            objects[Math.floor(bufferIndex / INTS_PER_FIELD) * 2 + 1] =
              messageInfoObjects[objectsPosition++];
          }
        } else if (fieldType === 50 /* MAP */) {
          intArray[mapFieldIndex++] = bufferIndex;
          objects[Math.floor(bufferIndex / INTS_PER_FIELD) * 2] =
            messageInfoObjects[objectsPosition++];
          if ((fieldTypeWithExtraBits & LEGACY_ENUM_IS_CLOSED_BIT) !== 0) {
            objects[Math.floor(bufferIndex / INTS_PER_FIELD) * 2 + 1] =
              messageInfoObjects[objectsPosition++];
          }
        }

        // Simulate field offset (in Java this uses unsafe.objectFieldOffset)
        // For our purposes, we'll use the field number as a simple offset
        fieldOffset = fieldNumber;

        const hasHasBit = (fieldTypeWithExtraBits & HAS_HAS_BIT) !== 0;
        if (hasHasBit && fieldType <= 17 /* GROUP */) {
          // Decode hasBits index
          next = info.charCodeAt(i++);
          if (next >= 0xd800) {
            let result = next & 0x1fff;
            let shift = 13;
            while ((next = info.charCodeAt(i++)) >= 0xd800) {
              result |= (next & 0x1fff) << shift;
              shift += 13;
            }
            next = result | (next << shift);
          }
          const hasBitsIndex = next;

          presenceFieldOffset = oneofCount * 2 + Math.floor(hasBitsIndex / 32);
          presenceMaskShift = hasBitsIndex % 32;
        } else {
          presenceFieldOffset = NO_PRESENCE_SENTINEL;
          presenceMaskShift = 0;
        }

        if (fieldType >= 18 && fieldType <= 49) {
          // Field types of repeated fields are in a consecutive range from 18 (DOUBLE_LIST) to 49 (GROUP_LIST)
          intArray[repeatedFieldIndex++] = fieldOffset;
        }
      }

      buffer[bufferIndex++] = fieldNumber;
      buffer[bufferIndex++] =
        ((fieldTypeWithExtraBits & UTF8_CHECK_BIT) !== 0
          ? ENFORCE_UTF8_MASK
          : 0) |
        ((fieldTypeWithExtraBits & REQUIRED_BIT) !== 0 ? REQUIRED_MASK : 0) |
        ((fieldTypeWithExtraBits & LEGACY_ENUM_IS_CLOSED_BIT) !== 0
          ? LEGACY_ENUM_IS_CLOSED_MASK
          : 0) |
        (fieldType << OFFSET_BITS) |
        fieldOffset;
      buffer[bufferIndex++] =
        (presenceMaskShift << OFFSET_BITS) | presenceFieldOffset;
    }

    return new MessageSchema(
      buffer,
      objects,
      minFieldNumber,
      maxFieldNumber,
      intArray,
      checkInitialized,
      checkInitialized + mapFieldCount
    );
  }

  // Getters for accessing the parsed data
  getBuffer(): number[] {
    return this.buffer;
  }

  getObjects(): any[] {
    return this.objects;
  }

  getMinFieldNumber(): number {
    return this.minFieldNumber;
  }

  getMaxFieldNumber(): number {
    return this.maxFieldNumber;
  }

  getIntArray(): number[] {
    return this.intArray;
  }
}

export interface DecodedFieldInfo {
  fieldNumber: number;
  fieldType: number;
  fieldTypeName: string;
  fieldOffset: number;
  presenceFieldOffset: number;
  presenceMaskShift: number;
  isRequired: boolean;
  hasUtf8Check: boolean;
  isLegacyEnum: boolean;
  fieldName?: string;
  associatedObject?: string; // For MESSAGE, ENUM, and other types that reference objects
  oneofInfo?: {
    oneofIndex: number;
    oneofFieldName: string;
    oneofCaseFieldName: string;
    associatedObject?: string; // For oneof MESSAGE/GROUP types
  };
}

// Field type names based on Google Protocol Buffers FieldType enum
// Reference: protobuf Java source comments in MessageSchema.java
const FIELD_TYPE_NAMES: { [key: number]: string } = {
  0: "DOUBLE",
  1: "FLOAT",
  2: "INT64",
  3: "UINT64",
  4: "INT32",
  5: "FIXED64",
  6: "FIXED32",
  7: "BOOL",
  8: "STRING",
  9: "MESSAGE",
  10: "BYTES",
  11: "UINT32",
  12: "ENUM",
  13: "SFIXED32",
  14: "SFIXED64",
  15: "SINT32",
  16: "SINT64",
  17: "GROUP",
  18: "DOUBLE_LIST",
  19: "FLOAT_LIST",
  20: "INT64_LIST",
  21: "UINT64_LIST",
  22: "INT32_LIST",
  23: "FIXED64_LIST",
  24: "FIXED32_LIST",
  25: "BOOL_LIST",
  26: "STRING_LIST",
  27: "MESSAGE_LIST",
  28: "BYTES_LIST",
  29: "UINT32_LIST",
  30: "ENUM_LIST",
  31: "SFIXED32_LIST",
  32: "SFIXED64_LIST",
  33: "SINT32_LIST",
  34: "SINT64_LIST",
  35: "DOUBLE_LIST_PACKED",
  36: "FLOAT_LIST_PACKED",
  37: "INT64_LIST_PACKED",
  38: "UINT64_LIST_PACKED",
  39: "INT32_LIST_PACKED",
  40: "FIXED64_LIST_PACKED",
  41: "FIXED32_LIST_PACKED",
  42: "BOOL_LIST_PACKED",
  43: "UINT32_LIST_PACKED",
  44: "ENUM_LIST_PACKED",
  45: "SFIXED32_LIST_PACKED",
  46: "SFIXED64_LIST_PACKED",
  47: "SINT32_LIST_PACKED",
  48: "SINT64_LIST_PACKED",
  49: "GROUP_LIST",
  50: "MAP",
  51: "ONEOF_DOUBLE",
  52: "ONEOF_FLOAT",
  53: "ONEOF_INT64",
  54: "ONEOF_UINT64",
  55: "ONEOF_INT32",
  56: "ONEOF_FIXED64",
  57: "ONEOF_FIXED32",
  58: "ONEOF_BOOL",
  59: "ONEOF_STRING",
  60: "ONEOF_MESSAGE",
  61: "ONEOF_BYTES",
  62: "ONEOF_UINT32",
  63: "ONEOF_ENUM",
  64: "ONEOF_SFIXED32",
  65: "ONEOF_SFIXED64",
  66: "ONEOF_SINT32",
  67: "ONEOF_SINT64",
  68: "ONEOF_GROUP",
};

export function decodeSchema(
  rawMessageInfo: RawMessageInfo,
  info: string,
  objects: any[]
): DecodedFieldInfo[] {
  const messageSchema =
    MessageSchema.newSchemaForRawMessageInfo(rawMessageInfo);

  const buffer = messageSchema.getBuffer();
  const schemaObjects = messageSchema.getObjects();
  const fields: DecodedFieldInfo[] = [];

  const INTS_PER_FIELD = 3;
  const OFFSET_BITS = 20;
  const OFFSET_MASK = 0xfffff;
  const REQUIRED_MASK = 0x10000000;
  const ENFORCE_UTF8_MASK = 0x20000000;
  const LEGACY_ENUM_IS_CLOSED_MASK = 0x80000000;
  const ONEOF_TYPE_OFFSET = 51;

  // First, let's parse the header to understand the structure
  let i = 0;
  const length = info.length;

  // Parse unusedFlags
  let next = info.charCodeAt(i++);
  if (next >= 0xd800) {
    let result = next & 0x1fff;
    let shift = 13;
    while ((next = info.charCodeAt(i++)) >= 0xd800) {
      result |= (next & 0x1fff) << shift;
      shift += 13;
    }
    next = result | (next << shift);
  }
  const unusedFlags = next;

  // Parse fieldCount
  next = info.charCodeAt(i++);
  if (next >= 0xd800) {
    let result = next & 0x1fff;
    let shift = 13;
    while ((next = info.charCodeAt(i++)) >= 0xd800) {
      result |= (next & 0x1fff) << shift;
      shift += 13;
    }
    next = result | (next << shift);
  }
  const fieldCount = next;

  let oneofCount = 0;
  let hasBitsCount = 0;
  let objectsPosition = 0;

  if (fieldCount > 0) {
    // Parse oneofCount
    next = info.charCodeAt(i++);
    if (next >= 0xd800) {
      let result = next & 0x1fff;
      let shift = 13;
      while ((next = info.charCodeAt(i++)) >= 0xd800) {
        result |= (next & 0x1fff) << shift;
        shift += 13;
      }
      next = result | (next << shift);
    }
    oneofCount = next;

    // Parse hasBitsCount
    next = info.charCodeAt(i++);
    if (next >= 0xd800) {
      let result = next & 0x1fff;
      let shift = 13;
      while ((next = info.charCodeAt(i++)) >= 0xd800) {
        result |= (next & 0x1fff) << shift;
        shift += 13;
      }
      next = result | (next << shift);
    }
    hasBitsCount = next;

    // Skip minFieldNumber, maxFieldNumber, numEntries, mapFieldCount, repeatedFieldCount, checkInitialized
    for (let j = 0; j < 6; j++) {
      next = info.charCodeAt(i++);
      if (next >= 0xd800) {
        let result = next & 0x1fff;
        let shift = 13;
        while ((next = info.charCodeAt(i++)) >= 0xd800) {
          result |= (next & 0x1fff) << shift;
          shift += 13;
        }
        next = result | (next << shift);
      }
    }

    // Field objects are after a list of (oneof, oneofCase) pairs + a list of hasbits fields
    objectsPosition = oneofCount * 2 + hasBitsCount;
  }

  // Now parse the actual fields
  let currentObjectsPosition = objectsPosition; // Track the current position in objects array
  for (
    let bufferIndex = 0;
    bufferIndex < buffer.length;
    bufferIndex += INTS_PER_FIELD
  ) {
    const fieldNumber = buffer[bufferIndex];
    const typeAndFlags = buffer[bufferIndex + 1];
    const presenceInfo = buffer[bufferIndex + 2];

    const fieldType = (typeAndFlags >>> OFFSET_BITS) & 0xff;
    const fieldOffset = typeAndFlags & OFFSET_MASK;
    const presenceFieldOffset = presenceInfo & OFFSET_MASK;
    const presenceMaskShift = (presenceInfo >>> OFFSET_BITS) & 0xff;

    const isRequired = (typeAndFlags & REQUIRED_MASK) !== 0;
    const hasUtf8Check = (typeAndFlags & ENFORCE_UTF8_MASK) !== 0;
    const isLegacyEnum = (typeAndFlags & LEGACY_ENUM_IS_CLOSED_MASK) !== 0;

    const isOneof = fieldType >= ONEOF_TYPE_OFFSET;
    const actualFieldType = isOneof ? fieldType - ONEOF_TYPE_OFFSET : fieldType;
    const fieldTypeName =
      FIELD_TYPE_NAMES[actualFieldType] || `UNKNOWN_${actualFieldType}`;

    // Handle field name resolution based on field type
    let fieldName: string | undefined;
    let associatedObject: string | undefined;
    let oneofInfo:
      | {
          oneofIndex: number;
          oneofFieldName: string;
          oneofCaseFieldName: string;
          associatedObject?: string;
        }
      | undefined;

    if (isOneof) {
      // For oneof fields, get names from oneof pairs and track oneof group
      const oneofIndex = fieldOffset;
      const oneofFieldName = objects[oneofIndex * 2];
      const oneofCaseName = objects[oneofIndex * 2 + 1];

      if (
        typeof oneofFieldName === "string" &&
        typeof oneofCaseName === "string"
      ) {
        fieldName = `${oneofFieldName}[${fieldNumber}]`;
        oneofInfo = {
          oneofIndex,
          oneofFieldName,
          oneofCaseFieldName: oneofCaseName,
        };
      }

      // Oneof fields consume additional objects for MESSAGE/GROUP types only
      if (
        actualFieldType === 9 /* MESSAGE */ ||
        actualFieldType === 17 /* GROUP */
      ) {
        if (currentObjectsPosition < objects.length) {
          const objName = objects[currentObjectsPosition];
          if (typeof objName === "string") {
            if (oneofInfo) {
              oneofInfo.associatedObject = objName;
            }
          }
        }
        currentObjectsPosition++; // Consume additional object for message class
      }
    } else {
      // For regular fields, consume field name from objects array
      if (
        currentObjectsPosition < objects.length &&
        typeof objects[currentObjectsPosition] === "string"
      ) {
        fieldName = objects[currentObjectsPosition];
      }
      currentObjectsPosition++; // Regular fields consume field name object

      // Some regular field types consume additional objects
      if (
        actualFieldType === 27 /* MESSAGE_LIST */ ||
        actualFieldType === 49 /* GROUP_LIST */
      ) {
        if (currentObjectsPosition < objects.length) {
          const objName = objects[currentObjectsPosition];
          if (typeof objName === "string") {
            associatedObject = objName;
          }
        }
        currentObjectsPosition++; // Consume additional object for message class
      } else if (
        actualFieldType === 12 /* ENUM */ ||
        actualFieldType === 30 /* ENUM_LIST */ ||
        actualFieldType === 44 /* ENUM_LIST_PACKED */
      ) {
        // ENUM fields might consume additional object for enum verifier
        if (
          currentObjectsPosition < objects.length &&
          typeof objects[currentObjectsPosition] !== "string"
        ) {
          // This is likely an enum verifier, but let's capture it anyway
          const objName = objects[currentObjectsPosition];
          if (objName && typeof objName === "object") {
            associatedObject = objName.toString();
          }
          currentObjectsPosition++; // Consume enum verifier object
        }
      } else if (actualFieldType === 50 /* MAP */) {
        if (currentObjectsPosition < objects.length) {
          const objName = objects[currentObjectsPosition];
          if (typeof objName === "string") {
            associatedObject = objName;
          }
        }
        currentObjectsPosition++; // MAP fields consume additional object
      }
    }

    fields.push({
      fieldNumber,
      fieldType: actualFieldType,
      fieldTypeName: isOneof ? `ONEOF_${fieldTypeName}` : fieldTypeName,
      fieldOffset,
      presenceFieldOffset,
      presenceMaskShift,
      isRequired,
      hasUtf8Check,
      isLegacyEnum,
      fieldName,
      associatedObject,
      oneofInfo,
    });
  }

  return fields.sort((a, b) => a.fieldNumber - b.fieldNumber);
}
