"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Year from "../components/Year";

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
    <div className="grid grid-flow-row auto-cols-[minmax(0.1fr,_0.1fr)_minmax(0,_2fr)_minmax(0.1fr,_0.1fr)]">
      {photos.loading && <h1>Loading</h1>}
      <Year years={["2019", "2020", "2021", "2022"]} />
      <section className="grid grid-flow-row 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 col-start-2 col-end-2 gap-4 w-fit py-12">
        {photos.data.map((photo) => (
          <Image
            src={photo.signedPhoto}
            key={photo.key}
            alt="picture"
            height={250}
            width={250}
            className="rounded-3xl"
          />
        ))}
        {/* {new Array(7 - (photos.data.length % 7)).fill(0).map((a, i) => (
          <span key={i + "-spacers-fill"} style={{ width: 250, height: 250 }} />
        ))} */}
      </section>
    </div>
  );
};

export default Home;
