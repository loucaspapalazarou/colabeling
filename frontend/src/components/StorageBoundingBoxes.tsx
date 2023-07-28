import BoundingBox from "./BoundingBox";
import * as Y from "yjs";

interface StorageBoundingBoxesProps {
  currentRoom: string;
  imageRef: React.RefObject<HTMLImageElement>;
  imageSrc: string;
  doc: Y.Doc;
  labels: { [key: string]: string };
}

function StorageBoundingBoxes({
  imageRef,
  imageSrc,
  doc,
  labels,
}: StorageBoundingBoxesProps) {
  return (
    <>
      {Array.from(doc.getArray(imageSrc).toJSON()).map(
        (elem: string, index: number) => {
          const boxProps = JSON.parse(elem);
          return (
            <BoundingBox
              key={index}
              boxStart={{
                x: boxProps.boxStartX,
                y: boxProps.boxStartY,
              }}
              boxEnd={{
                x: boxProps.boxEndX,
                y: boxProps.boxEndY,
              }}
              label={boxProps.label}
              name={"Storage"}
              color={labels[boxProps.label]}
              imageRef={imageRef}
            />
          );
        }
      )}
    </>
  );
}

export default StorageBoundingBoxes;
