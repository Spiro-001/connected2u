"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sortByDate } from "@/utils/photoSort";

type PhotosStateType = {
  loading: boolean;
  data: PhotoType[];
};

type PhotoType = {
  key: string;
  signedPhoto: string;
};

type PhotoKeyType = {
  id: string;
  key: string;
  uploaderId: string;
};

const id = "b3e4b777-58bb-45c9-a383-e0f96ff26751";
const type = "single";
// const key = "IMG_1221TZ2023:07:14TTZ12:38:54";

const Home = () => {
  const entries = useRef<string[]>([]);
  const [photos, setPhotos] = useState<PhotosStateType>({
    loading: true,
    data: [],
  });

  const getPhotosKey = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/photos`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ id, type: "userId" }),
    });
    const photosKey: PhotoKeyType[] = await res.json();
    return photosKey;
  };

  const getPhotos = async (uploaderId: string, key: string) => {
    if (!entries.current.includes(key)) {
      entries.current.push(key);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/get/photo?id=${uploaderId}&type=${type}&key=${key}`,
        {
          credentials: "include",
        }
      );
      const photo = (await res.json()) as PhotoType;
      if (photo.signedPhoto) {
        setPhotos((prev) => ({
          loading: false,
          data: [...prev.data, photo],
        }));
      }
    }
  };

  useEffect(() => {
    if (photos.loading) {
      (async function () {
        const photosKey = await getPhotosKey();
        photosKey.forEach((photoKey) => {
          getPhotos(photoKey.uploaderId, photoKey.key + "-thumbnail");
        });
        setPhotos((prev) => ({
          loading: false,
          data: prev.data,
        }));
      })();
    }
  }, [photos.loading]);

  return (
    <div className="bg-red-50 flex flex-col items-center h-screen">
      {photos.loading && <h1>Loading</h1>}
      <h1>Photos</h1>
      <section className="flex flex-wrap gap-x-2 gap-y-2 w-fit">
        {photos.data.map((photo) => (
          <Image
            src={photo.signedPhoto}
            key={photo.key}
            alt="picture"
            height={0}
            width={100}
            className="rounded-md"
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
