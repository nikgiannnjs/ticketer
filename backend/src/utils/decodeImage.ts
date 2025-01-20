export const decoder = async (base64String: string): Promise<Buffer> => {
  const base64Data = base64String.split(";base64,").pop();
  if (!base64Data) {
    throw new Error("Invalid base64 string");
  }
  return Buffer.from(base64Data, "base64");
};
