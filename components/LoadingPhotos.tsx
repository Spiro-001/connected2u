import { Skeleton } from "@mui/material";
import React from "react";

const LoadingPhotos = ({
  view = "large",
}: {
  view?: "small" | "medium" | "large";
}) => {
  let size = 250;
  switch (view) {
    case "large":
      size = 250;
      break;
    case "medium":
      size = 212;
      break;
    case "small":
      size = 183;
      break;
    default:
      size = 250;
      break;
  }
  return (
    <section
      id="image-container"
      className="flex flex-wrap max-w-[1676px] col-start-2 col-end-3 gap-4 w-full rounded-lg ic-section relative h-auto"
    >
      {new Array(24).fill(0).map((x, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={size}
          height={size}
          className="rounded-3xl"
        />
      ))}
    </section>
  );
};

export default LoadingPhotos;
