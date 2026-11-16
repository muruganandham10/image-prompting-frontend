
// Live Backend API URL
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://image-prompt-management-backend.onrender.com'
).replace(/\/+$/, '');

const API_ENDPOINT = `${API_BASE_URL}/api/images`;
const GENERATE_ENDPOINT = `${API_BASE_URL}/api/generate-image`;
const GENERATE_ALL_ENDPOINT = `${API_BASE_URL}/api/generate-all-images`;

// Common API Response Handler
const handleResponse = async (response) => {
  if (!response.ok) {
    let message = `API Error: ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.detail || errorData.message || message;
    } catch {
      // Default error message
    }

    throw new Error(message);
  }

  return response.json();
};

// GET - Fetch All Image Records
export const getImages = async () => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    throw error;
  }
};

// GET - Fetch Image By ID
export const getImageById = async (imageId) => {
  if (imageId === undefined || imageId === null || imageId === '') {
    throw new Error('Image ID is required.');
  }

  try {
    const response = await fetch(
      `${API_ENDPOINT}/${encodeURIComponent(imageId)}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch image details:', error);
    throw error;
  }
};

// POST - Generate Single Image
export const generateImage = async (imageId) => {
  if (imageId === undefined || imageId === null || imageId === '') {
    throw new Error('Image ID is required.');
  }

  try {
    const response = await fetch(GENERATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ image_id: imageId }),
    });

    const data = await handleResponse(response);

    if (!data.image_data) {
      throw new Error('Generated image data is missing.');
    }

    return data;
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  }
};

// POST - Generate All Images
export const generateAllImages = async () => {
  try {
    const response = await fetch(GENERATE_ALL_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to generate all images:', error);
    throw error;
  }
};
