import data from "../../../config.json";

import React, { useEffect, useRef, useState } from "react";
import { useUsers } from "y-presence";
import UserCursors from "./UserCursors";
import UserBoundingBoxes from "./UserBoundingBoxes";
import StorageBoundingBoxes from "./StorageBoundingBoxes";
import { faTrash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Oval } from "react-loader-spinner";
import * as bboxUtils from "../utils/boundingBoxUtils";
import {
  translateBoxDisplayToOriginal,
  translatePointDisplayToOriginal,
} from "../utils/positionTranslators";

interface CollabSpaceProps {
  data: any;
  awareness: any;
  imageSrc: string;
  doc: any;
}

function getUserX(
  e: React.PointerEvent,
  imageRef: React.RefObject<HTMLImageElement>
) {
  if (!imageRef.current) return 0;
  return Math.trunc(e.clientX - imageRef.current.getBoundingClientRect().left);
}

function getUserY(
  e: React.PointerEvent,
  imageRef: React.RefObject<HTMLImageElement>
) {
  if (!imageRef.current) return 0;
  return Math.trunc(e.clientY - imageRef.current.getBoundingClientRect().top);
}

function CollabSpace({ imageSrc, awareness, doc }: CollabSpaceProps) {
  const users = useUsers(awareness);
  const imageRef = useRef<HTMLImageElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(false);
  const [autoLabel, setAutoLabel] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(
    Object.entries(data.LABELS)[0][0]
  );

  useEffect(() => {
    awareness.setLocalStateField("roomName", imageSrc);
    awareness.setLocalStateField("boxStart", { x: null, y: null });
    awareness.setLocalStateField("boxEnd", { x: null, y: null });
  }, [imageSrc]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    window.addEventListener("mousemove", handleResize);
    let [label, color] = Object.entries(data.LABELS)[0];
    awareness.setLocalStateField("color", color);
    awareness.setLocalStateField("label", label);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
      window.removeEventListener("mousemove", handleResize);
    };
  }, []);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  const handleAutoLabelSwitch = () => {
    setAutoLabel((current) => !current);
  };

  const handlePointMove = (e: React.PointerEvent) => {
    awareness.setLocalStateField("cursor", {
      x: getUserX(e, imageRef),
      y: getUserY(e, imageRef),
    });

    if (awareness.getLocalState()["drawing"]) {
      awareness.setLocalStateField("boxEnd", {
        x: getUserX(e, imageRef),
        y: getUserY(e, imageRef),
      });
    }
  };

  const handleAutoLabel = (e: React.PointerEvent) => {
    if (loading) return;
    setLoading(true);

    const translatedPosition = translatePointDisplayToOriginal(
      imageRef,
      getUserX(e, imageRef),
      getUserY(e, imageRef)
    );

    const x = translatedPosition.x;
    const y = translatedPosition.y;
    const sam = `${data["SAM-API"].HOST}:${data["SAM-API"].PORT}`;
    const url = `http://${sam}/predict?x=${x}&y=${y}`;
    const formData = new FormData();

    fetch(imageSrc)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "image.jpg", { type: blob.type });
        formData.append("image", file);
        fetch(url, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            const originalBoundingBox = {
              x1: data.minX,
              y1: data.minY,
              x2: data.maxX,
              y2: data.maxY,
            };
            const translatedBoundingBox = translateBoxDisplayToOriginal(
              imageRef,
              originalBoundingBox
            );
            const newMinX = translatedBoundingBox.x1;
            const newMinY = translatedBoundingBox.y1;
            const newMaxX = translatedBoundingBox.x2;
            const newMaxY = translatedBoundingBox.y2;

            const isValidBox = bboxUtils.isBoxValid(
              imageRef,
              translatedBoundingBox
            );

            if (!isValidBox) {
              alert("The API returned an invalid box");
              return;
            }

            awareness.setLocalStateField("boxStart", {
              x: newMinX,
              y: newMinY,
            });
            awareness.setLocalStateField("boxEnd", {
              x: newMaxX,
              y: newMaxY,
            });
            bboxUtils.saveBox(awareness, doc);
            awareness.setLocalStateField("boxStart", {
              x: null,
              y: null,
            });
            awareness.setLocalStateField("boxEnd", {
              x: null,
              y: null,
            });
          })
          .catch((error) => {
            alert("Error. The SAM API is probably down.");
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClick = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (autoLabel) {
      handleAutoLabel(e);
      return;
    }
    // Rest of the function for left-click event
    // if not drawing
    if (!awareness.getLocalState()["drawing"]) {
      awareness.setLocalStateField("drawing", true);
      awareness.setLocalStateField("boxStart", {
        x: getUserX(e, imageRef),
        y: getUserY(e, imageRef),
      });
      awareness.setLocalStateField("boxEnd", {
        x: getUserX(e, imageRef),
        y: getUserY(e, imageRef),
      });
      return;
    }
  };

  const handleUnClick = (e: React.PointerEvent) => {
    // if drawing
    if (autoLabel) {
      return;
    }
    awareness.setLocalStateField("drawing", false);
    awareness.setLocalStateField("boxEnd", {
      x: getUserX(e, imageRef),
      y: getUserY(e, imageRef),
    });

    const boxStart = awareness.getLocalState()["boxStart"];
    const boxEnd = awareness.getLocalState()["boxEnd"];
    // avoid saving points
    if (boxStart.x !== boxEnd.x || boxStart.y !== boxEnd.y) {
      bboxUtils.saveBox(awareness, doc);
    }

    awareness.setLocalStateField("boxStart", {
      x: null,
      y: null,
    });
    awareness.setLocalStateField("boxEnd", {
      x: null,
      y: null,
    });
  };

  const handleLabelSelection = (labelIndex: any) => {
    if (loading) return;
    let [label, color] = Object.entries(data.LABELS)[labelIndex];
    setSelectedLabel(label);
    awareness.setLocalStateField("label", label);
    awareness.setLocalStateField("color", color);
  };

  const clearYArray = () => {
    const y = doc.getArray(imageSrc);
    y.forEach((key: any) => {
      y.delete(key);
    });
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          onClick={clearYArray}
          className=" text-white font-bold px-2 mt-3 mb-3 me-2 rounded bg-blue-500 hover:bg-blue-800"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Clear
        </button>
        <button
          onClick={handleAutoLabelSwitch}
          className={`text-white font-bold px-2 mt-3 mb-3 rounded ${
            autoLabel ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <FontAwesomeIcon
            icon={autoLabel ? faCheck : faTimes}
            className="mr-2"
          />
          {autoLabel ? "Autolabeling on" : "Autolabeling off"}
        </button>

        <Oval
          height={40}
          width={40}
          color="blue"
          wrapperStyle={{}}
          wrapperClass=""
          visible={loading}
          ariaLabel="oval-loading"
          secondaryColor="blue"
          strokeWidth={10}
          strokeWidthSecondary={10}
        />
      </div>
      <h1 className="font-semibold mb-1">
        Current users: {users.size} | Image: {imageSrc}
      </h1>
      <div
        className="bg-white outline cursor-crosshair"
        onPointerMove={handlePointMove}
        onPointerDown={handleClick}
        onPointerUp={handleUnClick}
      >
        <img
          ref={imageRef}
          src={imageSrc}
          style={{
            filter: loading ? "blur(20px)" : "none",
            maxWidth: "900px",
            maxHeight: "600px",
          }}
        />
        <StorageBoundingBoxes
          currentRoom={imageSrc}
          imageRef={imageRef}
          imageSrc={imageSrc}
          labels={data.LABELS}
          doc={doc}
          key={`${windowWidth}-${windowHeight}-storage`}
        />
        <UserBoundingBoxes
          users={users}
          currentRoom={imageSrc}
          imageRef={imageRef}
          imageSrc={imageSrc}
          key={`${windowWidth}-${windowHeight}-users`}
        />
        <UserCursors
          users={users}
          awareness={awareness}
          currentRoom={imageSrc}
          imageRef={imageRef}
        />
      </div>
      <div className="flex justify-center">
        {Object.entries(data.LABELS).map(([label, color], index) => (
          <button
            key={index}
            onClick={() => handleLabelSelection(index)}
            className={`m-2 text-white font-bold py-2 px-4 rounded`}
            style={{
              backgroundColor: `${color}`,
              opacity: `${label === selectedLabel ? "1" : "0.2"}`,
              zIndex: 4,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export default CollabSpace;
