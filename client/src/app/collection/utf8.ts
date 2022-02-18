import { OsuReader, OsuWriter } from 'osu-buffer';
import { utf8ByteArrayToString, stringToUtf8ByteArray } from 'utf8-string-bytes'

export const readNameUtf8 = (reader: OsuReader): string => {
  const byte = reader.readBytes(1);
  if (byte[0] !== 0) {
    const length = reader.read7bitInt();
    const bytes = reader.readBytes(length);
    return utf8ByteArrayToString(bytes)
  } else {
    return "";
  }
}

export const writeNameUtf8 = (writer: OsuWriter, name: string): void => {
  if (name == "") {
    writer.writeUint8(0);
  } else {
    writer.writeUint8(11);
    const bytes = stringToUtf8ByteArray(name)
    writer.write7bitInt(bytes.length);
    writer.writeBytes(bytes);
  }
}
