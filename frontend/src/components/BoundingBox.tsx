import React from "react";

interface BoundingBoxProps {
  boxStart: {
    x: number;
    y: number;
  };
  boxEnd: {
    x: number;
    y: number;
  };
  label: string;
  name: string;
  color: string;
  imageRef: React.RefObject<HTMLImageElement>;
}

function BoundingBox({ boxStart, boxEnd, color, imageRef }: BoundingBoxProps) {
  if (!imageRef.current) {
    return <></>; // Return null if imageRef is null
  }
  const xr = Math.trunc(imageRef.current.getBoundingClientRect().left);
  const yr = Math.trunc(imageRef.current.getBoundingClientRect().top);

  const fillOpacity = 0.5; // Adjust the opacity value as desired (0.0 to 1.0)

  return (
    <div
      style={{
        position: "absolute",
        left: xr + Math.min(boxStart.x, boxEnd.x),
        top: yr + Math.min(boxStart.y, boxEnd.y),
        width: Math.abs(boxEnd.x - boxStart.x),
        height: Math.abs(boxEnd.y - boxStart.y),
        border: `2px solid ${color}`,
        backgroundColor: `rgba(${parseInt(color.slice(-6, -4), 16)}, ${parseInt(
          color.slice(-4, -2),
          16
        )}, ${parseInt(color.slice(-2), 16)}, ${fillOpacity})`,
      }}
    />
  );
}

export default BoundingBox;
