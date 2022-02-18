declare module 'utf8-string-bytes' {
  export function utf8ByteArrayToString(bytes: number[]): string;
  export function stringToUtf8ByteArray(string: string): number[];
}
