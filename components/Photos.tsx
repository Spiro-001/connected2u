"use client";

import { readPhotoData } from "@/utils/exifReader";
import { ArrowCircleLeft, ArrowCircleRight, Close } from "@mui/icons-material";
import { CircularProgress, duration } from "@mui/material";
import { gsap } from "gsap";
import Image from "next/image";
import React, {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import ExifData from "./ExifData";
import { Map } from "./GoogleMaps";

type PhotoType = {
  order?: number;
  key: string;
  signedPhoto: string;
  uploaderId?: string;
  buffer: {
    data: Array<number>;
    type: string;
  };
};

type SelectedPhotoType = {
  node: ReactNode | null;
  photo: PhotoType | null;
  exif: ExifReader.Tags | null;
};

const type = "single";

const Photos = ({
  photos,
  view = "large",
}: {
  photos: Record<number, PhotoType>;
  view?: "small" | "medium" | "large";
}) => {
  const loading = (
    // <div
    //   className="bg-gray-600 bg-opacity-50 w-full max-h-[800px] items-center flex justify-center border-gray-600 border rounded-3xl"
    //   id="highlighted-image"
    // >
    <CircularProgress />
    // </div>
  );

  let keyboardAction = {
    ArrowLeft: () => {},
    ArrowRight: () => {},
  };

  const [selectedPhoto, setSelectedPhoto] = useState<SelectedPhotoType>({
    node: null,
    photo: null,
    exif: null,
  });

  const createImageNode = (
    photoData: PhotoType,
    width: number,
    height: number
  ) => {
    return (
      <Image
        src={
          "data:image;base64," +
          Buffer.from(photoData.buffer.data).toString("base64")
        }
        id="highlighted-image"
        key={photoData.key}
        alt="picture"
        className="rounded-3xl object-contain h-full w-full shadow-md max-w-[1440px] max-h-[800px]"
        height={height}
        width={width}
        style={{
          position: "relative",
          aspectRatio: `auto ${width}/${height}`,
          filter: "blur(5px)",
        }}
        onLoadingComplete={(e) => {
          e.style.filter = "blur(0px)";
          e.className = e.className + " unblur";
        }}
        loading="eager"
        priority
        unoptimized
      />
    );
  };

  const handleOnClickPhoto = async (
    e: MouseEvent,
    photo: PhotoType,
    order: string
  ) => {
    const { uploaderId, key } = photo;
    const main = document.getElementsByTagName("body")[0];
    main.style.overflow = "hidden";
    const dialog = document.getElementById(
      "highlight-selected-photo"
    ) as HTMLDialogElement;
    const removeEXTKey = key.slice(0, key.indexOf("-thumbnail"));
    dialog.showModal();

    setSelectedPhoto({
      node: loading,
      photo: null,
      exif: null,
    });

    const res = await fetch(
      `/api/get/photo?id=${uploaderId}&type=${type}&key=${removeEXTKey}`,
      {
        credentials: "include",
        cache: "force-cache",
      }
    );
    const photoData = (await res.json()) as PhotoType;
    const exifData = photoData.buffer?.data
      ? readPhotoData(Buffer.from(photoData.buffer.data))
      : null;
    if (photoData.signedPhoto && exifData) {
      const width = exifData["Image Width"]?.value ?? 0;
      const height = exifData["Image Height"]?.value ?? 0;
      const imageNode = createImageNode(photoData, width, height);
      const newSelectedPhoto = {
        node: imageNode,
        photo: { ...photoData, order: parseInt(order) },
        exif: exifData,
      };
      setSelectedPhoto(newSelectedPhoto);
    }
  };

  const handleClosePhoto = () => {
    // removeKeyboardListener();
    const main = document.getElementsByTagName("body")[0];
    main.style.overflow = "auto";
    const dialog = document.getElementById(
      "highlight-selected-photo"
    ) as HTMLDialogElement;
    setSelectedPhoto({ node: null, photo: null, exif: null });
    dialog.close();
  };

  const handleNext = async (fwd: boolean) => {
    const tl = gsap.timeline();
    const current = selectedPhoto?.photo?.order;
    let newPhoto;
    let action = fwd ? 1 : -1;

    if (current !== undefined) {
      let newOrder = current + action;
      const max = Object.keys(photos).length - 1;
      if (newOrder < 0) newOrder = max;
      if (newOrder > max) newOrder = 0;
      newPhoto = photos[newOrder];
      if (newPhoto) {
        await tl
          .to("#highlighted-image, #photo-data, #map-container", {
            x: 100 * action * -1,
            opacity: 0,
            duration: 0.2,
          })
          .then(() => {
            setSelectedPhoto({
              node: loading,
              photo: null,
              exif: null,
            });
          });
        const removeEXTKey = newPhoto.key.slice(
          0,
          newPhoto.key.indexOf("-thumbnail")
        );
        const res = await fetch(
          `/api/get/photo?id=${newPhoto.uploaderId}&type=${type}&key=${removeEXTKey}`,
          {
            credentials: "include",
            cache: "force-cache",
          }
        );
        const photoData = (await res.json()) as PhotoType;
        console.log(photoData);
        const exifData = readPhotoData(Buffer.from(photoData.buffer.data));
        if (photoData.signedPhoto) {
          const width = exifData["Image Width"]?.value ?? 0;
          const height = exifData["Image Height"]?.value ?? 0;
          const imageNode = createImageNode(photoData, width, height);
          const newSelectedPhoto = {
            node: imageNode,
            photo: { ...photoData, order: newOrder },
            exif: exifData,
          };
          setSelectedPhoto(newSelectedPhoto);
        }
        tl.to("#photo-data", {
          opacity: 1,
          x: 0,
        });
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        handleNext(false);
        break;
      case "ArrowRight":
        handleNext(true);
        break;
      default:
        break;
    }
  };

  const viewSize = {
    small: [183, 2],
    medium: [212, 1],
    large: [250, 0],
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to("#thumbnail-image", {
      width: viewSize[view][0],
      height: viewSize[view][0],
      duration: 0.2,
      ease: "power4.out",
    });
  }, [view]);

  const fadeIn = (e: HTMLImageElement) => {
    const tl = gsap.timeline();
    tl.fromTo(
      e,
      {
        opacity: 0,
      },
      {
        opacity: 1,
      }
    );
  };

  return (
    <>
      <section
        id="image-container"
        className="flex flex-wrap max-w-[1676px] col-start-2 col-end-3 gap-4 w-full rounded-lg ic-section relative h-auto"
      >
        {Object.keys(photos).map((order) => (
          <Image
            src={photos[parseInt(order)].signedPhoto}
            key={photos[parseInt(order)].key}
            alt="picture"
            height={250}
            width={250}
            placeholder="blur"
            blurDataURL={
              "data:image;base64," +
              Buffer.from(photos[parseInt(order)].buffer.data).toString(
                "base64"
              )
            }
            className="rounded-3xl opacity-0 cursor-pointer shadow-md ti-image transition hover:-translate-y-1.5 hover:shadow-lg hover:shadow-neutral-400"
            onClick={(e) =>
              handleOnClickPhoto(e, photos[parseInt(order)], order)
            }
            onLoadingComplete={(e) => fadeIn(e)}
            id="thumbnail-image"
          />
        ))}
      </section>
      <dialog
        id="highlight-selected-photo"
        className="backdrop:bg-opacity-60 backdrop:bg-black bg-transparent outline-none w-full overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <div className="flex justify-center flex-wrap gap-y-4 gap-x-4">
          {selectedPhoto.exif && (
            <div className="flex flex-col gap-y-2" id="photo-data">
              <h1 className="max-h-[250px] max-w-[450px] overflow-auto h-fit w-full rounded-md px-4 py-2 font-semibold bg-indigo-300 text-white">
                {(() => {
                  const tzIndex = selectedPhoto.photo?.key
                    .split("TTZ")[0]
                    .split("")
                    .reverse()
                    .join("")
                    .indexOf("ZT");
                  const formatted = selectedPhoto.photo?.key.slice(
                    0,
                    (tzIndex ?? 2) - 2
                  );
                  return formatted;
                })()}
              </h1>
              <ExifData
                exifData={selectedPhoto.exif}
                fileSize={
                  Buffer.from(selectedPhoto.photo?.buffer.data ?? []).byteLength
                }
              />
            </div>
          )}
          <div className="flex items-center gap-x-8 relative">
            {selectedPhoto.photo && (
              <Close
                sx={{
                  background: "transparent",
                  fill: "white",
                  height: 28,
                  width: 28,
                }}
                className="outline-none border-none cursor-pointer right-8 top-0 absolute"
                onClick={handleClosePhoto}
              />
            )}
            {selectedPhoto.photo && (
              <ArrowCircleLeft
                sx={{
                  background: "transparent",
                  fill: "white",
                  height: 34,
                  width: 34,
                }}
                className="cursor-pointer"
                onClick={(e) => handleNext(false)}
              />
            )}
            <div className="relative flex flex-col justify-center items-center max-w-[1080px] max-h-[800px] rounded-3xl">
              {selectedPhoto?.node}
            </div>
            {selectedPhoto.photo && (
              <ArrowCircleRight
                sx={{
                  background: "transparent",
                  fill: "white",
                  height: 34,
                  width: 34,
                }}
                className="cursor-pointer"
                onClick={(e) => handleNext(true)}
              />
            )}
          </div>
          {selectedPhoto.exif && (
            <div
              className="mt-auto max-w-[400px] max-h-[200px] w-full h-screen"
              id="map-container"
            >
              <Map exifData={selectedPhoto.exif} />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Photos;
