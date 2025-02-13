// Function for uploading an image
export async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data; // { message: "Image uploaded successfully", image: "/uploads/filename.jpg" }
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while uploading image"
    );
  }
}
