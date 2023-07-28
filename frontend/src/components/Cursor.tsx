import React from "react";

interface CursorProps {
  cursor: {
    x: number;
    y: number;
  };
  color: string;
  name: string;
  drawing: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
}

function Cursor({ cursor, color, name, imageRef }: CursorProps) {
  const { x, y } = cursor;
  const xr = imageRef.current
    ? x + Math.trunc(imageRef.current.getBoundingClientRect().left)
    : 0;
  const yr = imageRef.current
    ? y + Math.trunc(imageRef.current.getBoundingClientRect().top)
    : 0;

  return (
    <div
      style={{
        zIndex: "1",
        position: "absolute",
        pointerEvents: "none",
        userSelect: "none",
        left: 0,
        top: 0,
        transition: "transform 0.5s cubic-bezier(.17,.93,.38,1)",
        transform: `translateX(${xr}px) translateY(${yr}px)`,
      }}
    >
      <svg
        className="cursor"
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        stroke="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>

      <div
        style={{
          backgroundColor: color,
          borderRadius: 4,
          position: "absolute",
          top: 20,
          left: 10,
          padding: "5px 10px",
          display: "block",
        }}
      >
        <p
          style={{
            whiteSpace: "nowrap",
            fontSize: 12,
            color: "white",
          }}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

export default Cursor;
