"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Tags } from "exifreader";
import { useCallback, useState } from "react";

const containerStyle = {
  width: "400px",
  height: "200px",
  borderRadius: "12px",
};

export const Map = ({ exifData }: { exifData: Tags }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API ?? "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds;
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  if (
    !exifData.GPSLatitude ||
    !exifData.GPSLongitude ||
    !exifData.GPSLatitudeRef ||
    !exifData.GPSLongitudeRef
  )
    return <></>;

  const center = {
    lat:
      parseFloat(exifData.GPSLatitude.description) *
      (exifData.GPSLatitudeRef.description.toLocaleLowerCase().includes("north")
        ? 1
        : -1),
    lng:
      parseFloat(exifData.GPSLongitude.description) *
      (exifData.GPSLongitudeRef.description.toLocaleLowerCase().includes("east")
        ? 1
        : -1),
  };
  const marker = center;

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
        clickableIcons: true,
        // gestureHandling: "none",
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <Marker position={marker} />
    </GoogleMap>
  ) : (
    <></>
  );
};
