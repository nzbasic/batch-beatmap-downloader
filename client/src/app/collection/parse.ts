import { OsuReader, OsuWriter } from "osu-buffer";
import * as fs from "fs";
import { readNameUtf8, writeNameUtf8 } from "./utf8";
import { stringToUtf8ByteArray } from 'utf8-string-bytes'

export interface Collections {
  version: number;
  numberCollections: number;
  collections: Collection[];
}

export interface Collection {
  name: string;
  numberMaps: number;
  hashes: string[];
}

/**
 * Reads a binary collections file to memory
 * @param path Path to collection.db file
 */
export const readCollections = async (path: string) => {
  const buffer = await fs.promises.readFile(path + "\\collection.db");
  const reader = new OsuReader(buffer.buffer);

  const collections: Collections = {
    version: reader.readInt32(),
    numberCollections: reader.readInt32(),
    collections: [],
  };

  for (let colIdx = 0; colIdx < collections.numberCollections; colIdx++) {
    const collection: Collection = {
      name: readNameUtf8(reader),
      numberMaps: reader.readInt32(),
      hashes: [],
    }

    for (let mapIdx = 0; mapIdx < collection.numberMaps; mapIdx++) {
      collection.hashes.push(reader.readString() ?? "");
    }

    collections.collections.push(collection);
  }

  return collections
};

/**
 * Writes the current collections to disk
 */
export const writeCollections = async (osuPath: string, collections: Collections) => {
  let writer: OsuWriter;

  try {
    const length = calculateLength(collections);
    const arrayBuffer = new ArrayBuffer(length);
    writer = new OsuWriter(arrayBuffer);

    writer.writeInt32(collections.version);
    writer.writeInt32(collections.numberCollections);

    collections.collections.forEach((collection) => {
      writeNameUtf8(writer, collection.name);
      writer.writeInt32(collection.numberMaps);

      collection.hashes.forEach((hash) => {
        writer.writeString(hash);
      });
    });

    const buffer = Buffer.from(writer.buff);
    const path = osuPath + "/collection.db"
    await fs.promises.writeFile(path, buffer);
  } catch(err) {
    console.log(err)
  }
};

/**
 * Calculates the length of the given collections in bytes for use in a buffer
 * @param collections Collections to calculate
 * @returns Byte length
 */
const calculateLength = (collections: Collections): number => {
  // starts at 8 for version + numberCollections
  let count = 8;

  collections.collections.forEach((collection) => {
    // 1 byte for empty name, length+2 for anything else
    if (collection.name == "") {
      count += 1;
    } else {
      count += stringToUtf8ByteArray(collection.name).length + 2;
    }

    // 4 bytes for numberMaps
    count += 4;

    // 34 bytes for each hash
    count += 34 * collection.numberMaps;
  });

  return count;
};

