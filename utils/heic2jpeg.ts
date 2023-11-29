import { Dispatch, ReactNode, SetStateAction } from "react";
import ExifReader from "exifreader";

type FileObjectType = {
  id: number;
  name: string;
  size: number;
  buffer: string;
};

export const convert = async (
  file: File,
  formData: FormData,
  setRenderFiles: Dispatch<SetStateAction<FileObjectType[]>>,
  multi: boolean,
  idx: number
) => {
  setRenderFiles((prev) => {
    const copy = Array.from(prev);
    copy[idx] = {
      id: idx,
      name: "Converting...",
      size: 0,
      buffer: "loading",
    };
    return copy;
  });
  const heic2any = require("heic2any");
  const HEICtoJPEG = (await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 1.0,
  })) as Blob;
  const arrayBuffer = await HEICtoJPEG.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const newFile = new File([await file.arrayBuffer()], file.name, {
    type: "image/heic",
  });
  const fileObject = {
    id: idx,
    name: file.name,
    size: Math.floor(file.size / 10000) / 100,
    buffer: `data:image;base64,${buffer.toString("base64")}`,
  };

  formData.append(`image${multi ? `s[${idx}]` : ""}`, newFile);
  setRenderFiles((prev) => {
    const copy = Array.from(prev);
    copy[idx] = fileObject;
    return copy;
  });
};
