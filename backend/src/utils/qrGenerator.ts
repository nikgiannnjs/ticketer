import qrcode from "qrcode";

export const qrCodeGenerator = async (data: string): Promise<string> => {
  const qrString = await qrcode.toDataURL(data);

  if (!qrString) {
    throw new Error("Qrcode generator error");
  }

  return qrString;
};
