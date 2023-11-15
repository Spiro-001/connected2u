import ExifReader from "exifreader";

export const readPhotoData = (buffer: Buffer) => {
  return ExifReader.load(buffer);
};
