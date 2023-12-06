"use client";

import React, { useEffect, useRef, useState } from "react";
import Year from "../../components/Year";
import Photos from "../../components/Photos";
import ItemView from "@/components/ItemView";
import Search from "@/components/Search";
import { getSession } from "next-auth/react";
import { ISODateString } from "next-auth";

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

type SessionType = {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string | null;
    sessionToken?: string | null;
  };
  expires: ISODateString;
};

const type = "single";

const Home = () => {
  const entries = useRef<string[]>([]);
  const [photos, setPhotos] = useState<PhotosStateType>({
    loading: true,
    data: [],
  });
  const [photosExist, setPhotosExist] = useState(false);
  const [view, setView] = useState<"small" | "medium" | "large">("large");

  const getPhotosKey = async () => {
    const session = (await getSession()) as SessionType;
    if (session && session.user) {
      const res = await fetch(`/api/photos`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ id: session.user.id, type: "userId" }),
        cache: "no-cache",
      });
      const photosKey: PhotoKeyType[] = await res.json();
      if (photosKey.length === 0) setPhotosExist(false);
      else setPhotosExist(true);
      return photosKey;
    }
  };

  const getPhotos = async (uploaderId: string, key: string, order: number) => {
    if (!entries.current.includes(key)) {
      entries.current.push(key);
      const res = await fetch(
        `/api/get/photo?id=${uploaderId}&type=${type}&key=${key}`,
        {
          credentials: "include",
          cache: "force-cache",
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
        if (photosKey) {
          photosKey.forEach((photoKey, idx) => {
            getPhotos(photoKey.uploaderId, photoKey.key + "-thumbnail", idx);
          });
          setPhotos((prev) => ({
            loading: false,
            data: prev.data,
          }));
        }
      })();
    }
  }, [photos.loading]);

  return (
    <div className="flex flex-col px-4 gap-y-4" style={{ width: "90%" }}>
      {photos.loading && <h1>Loading</h1>}
      <div className="col-start-2 col-end-3 flex justify-between items-start">
        <Year years={["2019", "2020", "2021", "2022"]} />
        <Search setPhotos={setPhotos} />
      </div>
      <div className="flex w-full gap-x-10">
        <ItemView setView={setView} />
        {!photos.loading && (
          <Photos photos={photos.data} view={view} photosExist={photosExist} />
        )}
      </div>
    </div>
  );
};

export default Home;
