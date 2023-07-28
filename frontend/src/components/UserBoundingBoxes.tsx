import { ComponentProps } from "react";
import BoundingBox from "./BoundingBox";
import Cursor from "../components/Cursor";

interface UserBoundingBoxesProps {
  users: Map<any, any>;
  currentRoom: string;
  imageRef: React.RefObject<HTMLImageElement>;
  imageSrc: string;
}

function UserBoundingBoxes({
  users,
  currentRoom,
  imageRef,
}: UserBoundingBoxesProps) {
  return (
    <>
      {/* Current boxes */}
      {Array.from(users.entries()).map(([key, value]) => {
        if (
          !value.boxStart.x ||
          !value.boxEnd.x ||
          !value.boxStart.y ||
          !value.boxEnd.y
        )
          return null;
        if (value.roomName != currentRoom) return null;
        return (
          <BoundingBox
            key={key}
            name={value.name as ComponentProps<typeof Cursor>["name"]}
            boxStart={
              value.boxStart as ComponentProps<typeof BoundingBox>["boxStart"]
            }
            boxEnd={
              value.boxEnd as ComponentProps<typeof BoundingBox>["boxEnd"]
            }
            label={value.label}
            color={value.color}
            imageRef={imageRef}
          />
        );
      })}
    </>
  );
}

export default UserBoundingBoxes;
