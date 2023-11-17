import React from "react";

const ExifData = ({
  exifData,
  fileSize,
}: {
  exifData: ExifReader.Tags | null;
  fileSize: number;
}) => {
  if (!exifData) return;

  const orientation = exifData.Orientation?.value ?? 1;
  const height =
    orientation === 1
      ? exifData["Image Height"]?.value
      : exifData["Image Width"]?.value;
  const width =
    orientation === 1
      ? exifData["Image Width"]?.value
      : exifData["Image Height"]?.value;
  const focalLength = exifData.FocalLengthIn35mmFilm?.value;
  const fstop = exifData.FNumber?.description;
  const iso = exifData.ISOSpeedRatings?.value;
  const shutterSpeed = exifData.ShutterSpeedValue?.description;

  const getMake = () => {
    if (!exifData["Make"]?.description || !exifData["Model"]?.description)
      return false;
    else
      return `${exifData["Make"].description} ${exifData["Model"].description}`;
  };

  const getResoultion = () => {
    if (!width || !height) return "No data";
    else return `${width} x ${height}`;
  };

  return (
    <div className="bg-white h-fit w-screen max-h-[250px] max-w-[300px] overflow-auto rounded-md text-sm">
      <section className="flex px-3 py-2 bg-neutral-400 justify-between text-white items-center font-semibold shadow-sm">
        <h1>{getMake()}</h1>
        <p className="bg-neutral-500 px-2 py-0.5 rounded-md">{`${exifData["FileType"].description}`}</p>
      </section>
      <section className="py-1 px-3 border-t border-neutral-200">
        <span className="flex gap-x-1">
          <p>{focalLength ? focalLength + " mm" : false}</p>
          <p>{fstop ? `ƒ/${fstop.slice(2, fstop.length)}` : false}</p>
        </span>
        <span className="flex gap-x-1">
          <p>
            {width && height && `${Math.floor((width * height) / 1000000)} MP`}
          </p>
          •<p>{getResoultion()}</p>•
          <p>{`${Math.round(fileSize / 100000) / 10} MB`}</p>
        </span>
      </section>
      <section>
        <span className="flex border-t border-neutral-200 py-1 text-xs text-center">
          <p className="border-r border-neutral-200 px-2 flex-1">
            {iso ? `ISO ${iso}` : false}
          </p>
          <p className="border-r border-neutral-200 px-2 flex-1">
            {focalLength ? focalLength + " mm" : false}
          </p>
          <p className="border-r border-neutral-200 px-2 flex-1">
            {fstop ? `ƒ/${fstop.slice(2, fstop.length)}` : false}
          </p>
          <p className="border-r border-neutral-200 px-2 flex-1">
            {shutterSpeed ? `${shutterSpeed} s` : false}
          </p>
        </span>
      </section>
    </div>
  );
};

export default ExifData;
