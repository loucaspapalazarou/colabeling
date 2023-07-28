export const bboxToJSON = (a: any) => {
  const { name, boxStart, boxEnd, label } = a.getLocalState();
  const data = {
    boxStartX: boxStart.x,
    boxStartY: boxStart.y,
    boxEndX: boxEnd.x,
    boxEndY: boxEnd.y,
    label: label,
    owner: name,
  };

  return JSON.stringify(data);
};

export const saveBox = (awareness: any, doc: any) => {
  const arrayName = awareness.getLocalState()["roomName"];
  const yarray = doc.getArray(arrayName);
  yarray.push([bboxToJSON(awareness)]);
};

export function translateBoundingBox(
  originalSize: { width: any; height: any },
  boundingBox: [any, any, any, any],
  maxSize: { width: any; height: any }
) {
  // Extract original image dimensions
  const originalWidth = originalSize.width;
  const originalHeight = originalSize.height;

  // Extract bounding box coordinates
  const [bboxX, bboxY, bboxWidth, bboxHeight] = boundingBox;

  // Extract maximum display coordinates
  const maxWidth = maxSize.width;
  const maxHeight = maxSize.height;

  // Calculate scaling factors for width and height
  const scaleX = maxWidth / originalWidth;
  const scaleY = maxHeight / originalHeight;

  // Calculate translated bounding box coordinates
  const translatedX = bboxX * scaleX;
  const translatedY = bboxY * scaleY;
  const translatedWidth = bboxWidth * scaleX;
  const translatedHeight = bboxHeight * scaleY;

  return [translatedX, translatedY, translatedWidth, translatedHeight];
}

export const decodeBox = (d: { shape: any; data: any }) => {
  const { shape, data } = d;
  // Decode the base64 string
  const decodedData = atob(data); // Use the `atob` function to decode the base64 string

  // Create a 2D array from the decoded binary mask
  const maskArray = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    maskArray[i] = decodedData.charCodeAt(i);
  }
  // Assuming shape is an object with `width` and `height` properties
  const width = shape[0];
  const height = shape[1];

  // Create a bounding box from the mask
  let minX: number = width;
  let minY: number = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const pixelValue = maskArray[index];

      if (pixelValue) {
        // Update the bounding box coordinates
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { minX, minY, maxX, maxY };
};

export const isBoxValid = (
  originalImageRef: { current: any },
  translatedBoundingBox: { x1: number; x2: number; y1: number; y2: number }
) => {
  const originalImage = originalImageRef.current;
  const displayedWidth = originalImage.clientWidth;
  const displayedHeight = originalImage.clientHeight;

  // Calculate the area of the bounding box
  const boxWidth = Math.abs(
    translatedBoundingBox.x2 - translatedBoundingBox.x1
  );
  const boxHeight = Math.abs(
    translatedBoundingBox.y2 - translatedBoundingBox.y1
  );
  const boundingBoxArea = boxWidth * boxHeight;

  // Calculate the total area of the image
  const totalImageArea = displayedWidth * displayedHeight;

  // Calculate the 90% threshold of the image area
  const maxAllowedArea = 0.9 * totalImageArea;

  // Check if the bounding box's area exceeds the 90% threshold
  if (boundingBoxArea > maxAllowedArea) {
    return false;
  }

  // Check if any of the coordinates are outside the bounds of the displayed image
  const isOutsideX =
    translatedBoundingBox.x1 < 0 ||
    translatedBoundingBox.x1 > displayedWidth ||
    translatedBoundingBox.x2 < 0 ||
    translatedBoundingBox.x2 > displayedWidth;
  const isOutsideY =
    translatedBoundingBox.y1 < 0 ||
    translatedBoundingBox.y1 > displayedHeight ||
    translatedBoundingBox.y2 < 0 ||
    translatedBoundingBox.y2 > displayedHeight;

  // If any coordinate is outside the bounds, the bounding box is invalid
  if (isOutsideX || isOutsideY) {
    return false;
  }

  return true;
};
