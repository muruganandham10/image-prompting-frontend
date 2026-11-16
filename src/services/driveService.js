// src/services/driveService.js

import { API_BASE_URL } from './imageApi';

export const uploadToDrive = async (imageBlob, imageId) => {
  try {
    console.log("Phase 4: Checking Google Drive for existing image...");

    // 1. Check if the image already exists in Google Drive
    const checkRes = await fetch(`${API_BASE_URL}/api/drive/check-image/${imageId}`);
    const checkData = await checkRes.json();

    let existingFileId = null;

    // 2. If the file exists, ask the user for permission to overwrite
    if (checkData.exists) {
      const userWantsToUpload = window.confirm("This image is already in the Google Drive. Do you want to overwrite it?");

      if (!userWantsToUpload) {
        console.log("Upload cancelled by the user. Image blocked.");
        return; 
      }

      existingFileId = checkData.file_id;
    }

    // 3. Upload the image (New or Overwrite)
    console.log("Phase 4: Uploading image to Google Drive...");

    const imageFile = new File([imageBlob], "temp_image.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("image_id", imageId.toString());

    if (existingFileId) {
      formData.append("existing_file_id", existingFileId);
    }

    const uploadRes = await fetch(`${API_BASE_URL}/api/drive/upload-image/`, {
      method: "POST",
      body: formData,
    });

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      console.log("Phase 4 Success:", uploadData.message);
      alert("Success! Image stored in Google Drive.");
    } else {
      console.error("Phase 4 Error: Upload failed.");
      alert("Failed to upload image to Google Drive.");
    }

  } catch (error) {
    console.error("Phase 4 Error: Connection failed.", error);
  }
};