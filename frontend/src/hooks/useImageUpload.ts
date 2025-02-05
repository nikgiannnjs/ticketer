import { axios } from "@/lib/axios";

export async function uploadImage(file: File): Promise<string> {
  try {
    // First, get the pre-signed URL
    const {
      data: { signedUrl, publicUrl },
    } = await axios.get("/venues/getSignedUrls");

    // Then upload directly to R2 using the pre-signed URL
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}
