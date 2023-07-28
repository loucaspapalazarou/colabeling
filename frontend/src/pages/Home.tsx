import { useState, useEffect } from "react";
import CollabSpace from "../components/CollabSpace";

interface HomeProps {
  data: any;
  doc: any;
  provider: any;
  awareness: any;
}

function Home({ data, doc, provider, awareness }: HomeProps) {
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const onSync = (isSynced: boolean) => {
      if (isSynced) {
        setLoading(false);
      }
    };
    provider.on("sync", onSync);
    provider.on("status", (event: any) => {
      if (event.status === "disconnected") {
        setLoading(true);
      } // logs "connected" or "disconnected"
    });

    return () => provider.off("sync", onSync);
  }, []);

  const handlePrevious = () => {
    if (imageIndex === 0) return;
    setImageIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    if (imageIndex === data.IMAGES.length - 1) return;
    setImageIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div>
      {loading ? (
        <h1 className="text-5xl text-white font-bold">Loading...</h1>
      ) : (
        <div>
          <h1 className="text-2xl text-gray-300">
            My username:{" "}
            <span className="t text-white font-bold"> {data.USERNAME}</span>
          </h1>
          <CollabSpace
            data={data}
            doc={doc}
            imageSrc={data.IMAGES[imageIndex]}
            awareness={awareness}
          />
          <div className="flex justify-center">
            <button
              onClick={handlePrevious}
              className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
