"use client";

import React, { ChangeEvent, SyntheticEvent, useState } from "react";

const Upload = () => {
  const [files, setFiles] = useState<FormData | null>(null);
  const handleFiles = async (files: FileList | null) => {
    if (files) {
      const formData = new FormData();
      if (files.length > 1) {
        for (let x = 0; x < files.length; x++) {
          const file = files.item(x);
          if (file) {
            formData.append("images", file);
          }
        }
      } else if (files.length === 1) {
        formData.append("image", files[0]);
      }
      setFiles(formData);
    }
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: files,
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Upload Photos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => handleFiles(e.target.files)}
          accept="image/png, image/jpeg, image/heic"
          id="input-file-upload"
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
          className="w-52 h-52 border-black border cursor-pointer"
        >
          drag n drop
        </div>
        <button type="submit">upload</button>
      </form>
    </div>
  );
};

export default Upload;
