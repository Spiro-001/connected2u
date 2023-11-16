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
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      "#thumbnail-image",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        stagger: 0.05,
      }
    );
  }, [photos]);

  const loading = (
    <div
      className="bg-gray-600 bg-opacity-50 h-full items-center flex justify-center border-gray-600 border rounded-3xl"
      style={{ width: 400 }}
      id="highlighted-image"
    >
      <CircularProgress />
    </div>
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
        className="rounded-3xl object-contain h-full w-fit shadow-md"
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
      `${process.env.NEXT_PUBLIC_URL}/api/get/photo?id=${uploaderId}&type=${type}&key=${removeEXTKey}`,
      {
        credentials: "include",
        cache: "force-cache",
      }
    );
    const photoData = (await res.json()) as PhotoType;
    const exifData = readPhotoData(Buffer.from(photoData.buffer.data));
    if (photoData.signedPhoto) {
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
          .to("#highlighted-image", {
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
          `${process.env.NEXT_PUBLIC_URL}/api/get/photo?id=${newPhoto.uploaderId}&type=${type}&key=${removeEXTKey}`,
          {
            credentials: "include",
            cache: "force-cache",
          }
        );
        const photoData = (await res.json()) as PhotoType;
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
    console.log(view);
  }, [view]);

  return (
    <>
      <section
        id="image-container"
        className="flex flex-wrap max-w-[1676px] col-start-2 col-end-3 gap-4 w-fit py-12 px-12 rounded-lg ic-section relative h-auto"
        style={{
          backgroundColor: "#E0E9FF",
        }}
      >
        {Object.keys(photos).map((order) => (
          <Image
            src={photos[parseInt(order)].signedPhoto}
            key={photos[parseInt(order)].key}
            alt="picture"
            height={250}
            width={250}
            className="rounded-3xl cursor-pointer shadow-md opacity-0 ti-image transition hover:-translate-y-1.5 hover:shadow-lg hover:shadow-neutral-400"
            onClick={(e) =>
              handleOnClickPhoto(e, photos[parseInt(order)], order)
            }
            id="thumbnail-image"
          />
        ))}
      </section>
      <dialog
        id="highlight-selected-photo"
        className="backdrop:bg-opacity-60 backdrop:bg-black bg-transparent outline-none w-full"
        onKeyDown={handleKeyDown}
      >
        <div className="flex justify-center">
          <div className="flex items-center gap-x-8 relative">
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
            <div className="relative flex justify-center items-center w-fit h-screen max-w-[1440px] max-h-[800px] rounded-3xl">
              {selectedPhoto?.node}
            </div>
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
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Photos;
