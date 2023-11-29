"use client";

import { gsap } from "gsap";
import React, { Dispatch, FocusEvent, SetStateAction } from "react";

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

const Search = ({
  setPhotos,
}: {
  setPhotos: Dispatch<SetStateAction<PhotosStateType>>;
}) => {
  const openSearch = (e: FocusEvent) => {
    const tl = gsap.timeline();
    tl.to("#search-bar", {
      width: 384,
      duration: 0.25,
    });
  };

  const closeSearch = (e: FocusEvent) => {
    const tl = gsap.timeline();
    tl.to("#search-bar", {
      width: 231,
      duration: 0.25,
    });
  };

  return (
    <input
      placeholder="🔍 Search..."
      className="rounded-full px-6 py-2 border border-neutral-300 outline-blue-600 outline-1 h-fit"
      onFocus={openSearch}
      onBlur={closeSearch}
      id="search-bar"
    />
  );
};

export default Search;
