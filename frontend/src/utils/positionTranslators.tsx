export function translatePointDisplayToOriginal(
  originalImageRef: any,
  mouseX: number,
  mouseY: number
) {
  const originalImage = originalImageRef.current;
  const originalWidth = originalImage.naturalWidth;
  const originalHeight = originalImage.naturalHeight;
  const displayedWidth = originalImage.clientWidth;
  const displayedHeight = originalImage.clientHeight;

  const scaleX = originalWidth / displayedWidth;
  const scaleY = originalHeight / displayedHeight;

  const translatedX = Math.trunc(mouseX * scaleX);
  const translatedY = Math.trunc(mouseY * scaleY);

  return { x: translatedX, y: translatedY };
}

export function translateBoxDisplayToOriginal(
  originalImageRef: { current: any },
  boundingBox: { x1: number; y1: number; x2: number; y2: number }
) {
  const originalImage = originalImageRef.current;
  const originalWidth = originalImage.naturalWidth;
  const originalHeight = originalImage.naturalHeight;
  const displayedWidth = originalImage.clientWidth;
  const displayedHeight = originalImage.clientHeight;

  const scaleX = displayedWidth / originalWidth;
  const scaleY = displayedHeight / originalHeight;

  const translatedX1 = boundingBox.x1 * scaleX;
  const translatedY1 = boundingBox.y1 * scaleY;
  const translatedX2 = boundingBox.x2 * scaleX;
  const translatedY2 = boundingBox.y2 * scaleY;

  return {
    x1: translatedX1,
    y1: translatedY1,
    x2: translatedX2,
    y2: translatedY2,
  };
}
