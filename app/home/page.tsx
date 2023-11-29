"use client";

import React, { useEffect, useRef, useState } from "react";
import Year from "../../components/Year";
import Photos from "../../components/Photos";
import ItemView from "@/components/ItemView";
import Search from "@/components/Search";

type PhotosStateType = {
  loading: boolean;
  data: Record<number, PhotoType>;
};

type PhotoType = {
  key: string;
  signedPhoto: string;
  uploaderId?: string;
  buffer: {
    data: Array<number>;
    type: string;
  };
};

type PhotoKeyType = {
  id: string;
  key: string;
  uploaderId: string;
};

const id = "b3e4b777-58bb-45c9-a383-e0f96ff26751";
const type = "single";

const Home = () => {
  const entries = useRef<string[]>([]);
  const [photos, setPhotos] = useState<PhotosStateType>({
    loading: true,
    data: [],
  });
  const [view, setView] = useState<"small" | "medium" | "large">("large");

  const getPhotosKey = async () => {
    const res = await fetch(`/api/photos`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ id, type: "userId" }),
      cache: "no-cache",
    });
    const photosKey: PhotoKeyType[] = await res.json();
    return photosKey;
  };

  const getPhotos = async (uploaderId: string, key: string, order: number) => {
    if (!entries.current.includes(key)) {
      entries.current.push(key);
      const res = await fetch(
        `/api/get/photo?id=${uploaderId}&type=${type}&key=${key}`,
        {
          credentials: "include",
        }
      );
      const photo = (await res.json()) as PhotoType;
      if (photo.signedPhoto) {
        setPhotos((prev) => {
          const data: Record<number, PhotoType> = { ...prev.data };
          data[order] = { ...photo, uploaderId };
          return {
            loading: false,
            data,
          };
        });
      }
    }
  };

  useEffect(() => {
    if (photos.loading) {
      (async function () {
        const photosKey = await getPhotosKey();
        photosKey.forEach((photoKey, idx) => {
          getPhotos(photoKey.uploaderId, photoKey.key + "-thumbnail", idx);
        });
        setPhotos((prev) => ({
          loading: false,
          data: prev.data,
        }));
      })();
    }
  }, [photos.loading]);

  return (
    <div className="grid grid-flow-row auto-cols-[minmax(0,_fit-content)_minmax(0,_2fr)_minmax(0,_fit-content)] gap-4">
      {photos.loading && <h1>Loading</h1>}
      <div className="col-start-2 col-end-3 flex justify-between">
        <Year years={["2019", "2020", "2021", "2022"]} />
        <Search />
      </div>
      <ItemView setView={setView} />
      <Photos photos={photos.data} view={view} />
    </div>
  );
};

export default Home;
