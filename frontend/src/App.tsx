import Home from "./pages/Home";
import jsonData from "../../config.json"; // Replace "your-json-file.json" with the actual path to your JSON file
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface dataProps {
  USERNAME: string;
  IMAGES: string[];
  LABELS: {
    [key: string]: string;
  };
  "Y-WEBSOCKET": {
    HOST: string;
    PORT: number;
    YPERSISTENCE: string;
  };
  "SAM-API": {
    HOST: string;
    PORT: number;
  };
}

const data: dataProps = jsonData;

const doc = new Y.Doc();
const provider = new WebsocketProvider(
  `ws://${data["Y-WEBSOCKET"].HOST}:${data["Y-WEBSOCKET"].PORT}`,
  "default",
  doc
);
const awareness = provider.awareness;

const boxStart = { x: null, y: null };
const boxEnd = { x: null, y: null };
const drawing = false;
const label = null;
const roomName = data.IMAGES[0];
const username = data.USERNAME;

awareness.setLocalState({
  username,
  label,
  roomName,
  boxStart,
  boxEnd,
  drawing,
});

function App() {
  return (
    <Home data={data} doc={doc} provider={provider} awareness={awareness} />
  );
}

export default App;
