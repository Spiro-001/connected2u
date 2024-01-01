"use client";

import { convert } from "@/utils/heic2jpeg";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { gsap } from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, ReactNode, SyntheticEvent, useState } from "react";

type FileObjectType = {
  id: number;
  name: string;
  size: number;
  buffer: string;
};

const Upload = () => {
  const [files, setFiles] = useState<FormData | null>(null);
  const [renderFiles, setRenderFiles] = useState<FileObjectType[]>([]);
  const [status, setStatus] = useState({
    uploading: false,
  });
  const router = useRouter();

  const handleFiles = async (files: FileList | null) => {
    if (typeof window !== "undefined" && files && files?.length !== 0) {
      setFiles(null);
      setRenderFiles([]);
      const formData = new FormData();
      if (files.length > 1) {
        const placeholder = new Array(files.length).fill(0).map((e, idx) => ({
          id: idx,
          name: "loading",
          size: 0,
          buffer: "loading",
        }));
        setRenderFiles(placeholder);
        for (let x = 0; x < files.length; x++) {
          const file = files.item(x);
          if (file) {
            const fileBuffer = await file.arrayBuffer();
            let buffer = Buffer.from(fileBuffer);
            if (file.name.toLocaleLowerCase().includes("heic")) {
              convert(file, formData, setRenderFiles, true, x);
            } else {
              const fileObject = {
                id: x,
                name: file.name,
                size: Math.floor(file.size / 10000) / 100,
                buffer: `data:image;base64,${buffer.toString("base64")}`,
              };
              formData.append(`images[${x}]`, file);
              setRenderFiles((prev) => {
                const copy = Array.from(prev);
                copy[x] = fileObject;
                return copy;
              });
            }
          }
        }
      } else if (files.length === 1) {
        const fileBuffer = await files[0].arrayBuffer();
        let buffer = Buffer.from(fileBuffer);
        if (files[0].name.toLocaleLowerCase().includes("heic")) {
          convert(files[0], formData, setRenderFiles, false, 0);
        } else {
          const fileObject = {
            id: 1,
            name: files[0].name,
            size: Math.floor(files[0].size / 10000) / 100,
            buffer: `data:image;base64,${buffer.toString("base64")}`,
          };
          formData.append("images[0]", files[0]);
          setRenderFiles((prev) => {
            const copy = Array.from(prev);
            copy[0] = fileObject;
            return copy;
          });
        }
      }
      setFiles(formData);
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (files) {
      setStatus({
        uploading: true,
      });
      let fileList = files?.getAll("images") as File[];
      if (fileList) {
        // Multi
        for (let x = 0; x < renderFiles.length; x++) {
          const formData = new FormData();
          const file = files.get(`images[${x}]`) as File;
          if (!file) throw new Error("File does not exist.");
          formData.append("image", file);
          const tl = gsap.timeline();
          tl.to(
            `#img-${file.name
              .slice(0, file.name.indexOf("."))
              .replace("_", "-")}-image-upload-progress-bar`,
            {
              height: 6,
              width: "15%",
            }
          );

          await fetch("/api/upload", {
            method: "POST",
            credentials: "include",
            body: formData,
          })
            .then(async (res) => {
              const data = await res.json();
              return data;
            })
            .then((data) => {
              // console.log(data);
            })
            .finally(async () => {
              await tl.to(
                `#img-${file.name
                  .slice(0, file.name.indexOf("."))
                  .replace("_", "-")}-image-upload-progress-bar`,
                {
                  height: 6,
                  width: "100%",
                }
              );
              await tl
                .to(
                  `#img-${
                    file.name.slice(0, file.name.indexOf(".")) +
                    "-image-upload-container"
                  }`,
                  {
                    y: -50,
                    opacity: 0,
                  }
                )
                .then(() => {
                  setRenderFiles((prev) => {
                    const copy = prev.filter((e, idx) => e.id !== x);
                    return copy;
                  });
                });
            });
        }
        setFiles(null);
        setRenderFiles([]);
        setStatus({
          uploading: false,
        });
        router.push("/home");
      }
      let file = files?.get("image") as File;
      if (file) {
        // Single
        const formData = new FormData();
        formData.append("image", file);
        const tl = gsap.timeline();
        tl.to(
          `#img-${file.name.slice(
            0,
            file.name.indexOf(".")
          )}-image-upload-progress-bar`,
          {
            height: 6,
            width: "15%",
          }
        );
        fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            // console.log(data)
          })
          .finally(async () => {
            setStatus({
              uploading: false,
            });
            await tl.to(
              `#img-${file.name.slice(
                0,
                file.name.indexOf(".")
              )}-image-upload-progress-bar`,
              {
                height: 6,
                width: "100%",
              }
            );
            setRenderFiles([]);
            setFiles(null);
            setStatus({
              uploading: false,
            });
            router.push("/home");
          });
      }
    }
  };

  return (
    <div className="w-full flex flex-col max-w-[1140px] px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-y-4 flex-1"
      >
        <h1 className="text-2xl font-semibold mr-auto">Upload Photos</h1>
        <input
          type="file"
          onChange={(e) => handleFiles(e.target.files)}
          accept="image/png, image/jpeg, image/heic"
          id="input-file-upload"
          multiple
          hidden
        />
        <div
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("input-file-upload")?.click();
          }}
          // onMouseEnter={(e) => console.log(e)}
          onDragEnter={(e) => {
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="w-52 h-52 border-black border cursor-pointer flex flex-col items-center justify-center text-lg font-semibold rounded-md"
        >
          Upload Photos
        </div>
        <div className="flex flex-wrap gap-2 border border-neutral-200 px-2 py-2 rounded-md w-full min-h-[241px]">
          {renderFiles.map((file) => (
            <div
              key={file.id + "-" + file.name}
              className="flex flex-col w-fit text-sm gap-y-1 items-center max-w-[175px]"
              id={
                "img-" +
                file.name.slice(0, file.name.indexOf(".")).replace("_", "-") +
                "-image-upload-container"
              }
            >
              <span className="ml-auto px-1 text-xs bg-yellow-100 rounded-sm">
                {file.size}MB
              </span>
              {file.buffer !== "loading" ? (
                <Image
                  src={file.buffer}
                  height={175}
                  width={175}
                  alt="picture-thumbnail-upload"
                  id={
                    "img-" +
                    file.name
                      .slice(0, file.name.indexOf("."))
                      .replace("_", "-") +
                    "-image-upload"
                  }
                  className="object-cover rounded-md aspect-square"
                />
              ) : (
                <div className="flex justify-center items-center w-screen h-full max-w-[175px] max-h-[175px] aspect-square">
                  <CircularProgress />
                </div>
              )}
              <span className="bg-indigo-100 px-1 rounded-md w-full text-center text-ellipsis">
                {file.name}
              </span>
              <span
                id={
                  "img-" +
                  file.name.slice(0, file.name.indexOf(".")).replace("_", "-") +
                  "-image-upload-progress-bar"
                }
                className="w-full rounded-full bg-blue-300 mr-auto"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="ml-auto px-2 bg-green-300 text-white font-semibold rounded-md flex justify-center items-center"
          hidden={renderFiles.length === 0}
          style={{ width: 69, height: 24 }}
          disabled={status.uploading}
        >
          {status.uploading ? (
            <CircularProgress size={18} sx={{ color: "white" }} />
          ) : (
            "Upload"
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;
