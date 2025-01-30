import qrcode from "qrcode";

export const qrCodeGenerator = async (data: string): Promise<string> => {
  const qrString = await qrcode.toString(data, { type: "svg" });

  if (!qrString) {
    throw new Error("Qrcode generator error");
  }

  return qrString;
};
