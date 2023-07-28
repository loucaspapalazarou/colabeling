import { ComponentProps } from "react";
import Cursor from "./Cursor";

interface UserCursorsProps {
  awareness: any;
  users: Map<any, any>;
  currentRoom: string;
  imageRef: React.RefObject<HTMLImageElement>;
}

function UserCursors({
  awareness,
  users,
  currentRoom,
  imageRef,
}: UserCursorsProps) {
  return (
    <>
      {Array.from(users.entries()).map(([key, value]) => {
        if (key === awareness.clientID) return null;
        if (!value.cursor || !value.color || !value.username) return null;
        if (value.roomName != currentRoom) return null;
        return (
          <Cursor
            key={key}
            cursor={value.cursor as ComponentProps<typeof Cursor>["cursor"]}
            color={value.color as ComponentProps<typeof Cursor>["color"]}
            name={value.username as ComponentProps<typeof Cursor>["name"]}
            drawing={value.drawing as ComponentProps<typeof Cursor>["drawing"]}
            imageRef={imageRef}
          />
        );
      })}
    </>
  );
}

export default UserCursors;
