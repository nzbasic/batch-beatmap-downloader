export const bytesToFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return "N/A";
  }

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
