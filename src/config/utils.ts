export const canUseWebp = document
  .createElement("canvas")
  .toDataURL("image/webp", 0.5)
  .includes("data:image/webp");
