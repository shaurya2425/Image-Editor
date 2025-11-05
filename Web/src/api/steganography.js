const API_BASE = "http://localhost:8000"; // change this if your FastAPI runs somewhere else

// ********************* TEXT STEGANOGRAPHY **********************//

export const encodeText = async (carrierFile, textBlob) => {
  const formData = new FormData();
  formData.append("carrier_image", carrierFile);
  formData.append("secret_file", textBlob);

  const response = await fetch(`${API_BASE}/encode`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Encoding failed");

  return response.blob();
};

export const decodeText = async (stegFile) => {
  const formData = new FormData();
  formData.append("steg_image", stegFile);

  const response = await fetch(`${API_BASE}/decode`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Decoding failed");

  return response.blob();
};

// ********************* IMAGE STEGANOGRAPHY **********************//

export const encodeImage = async (carrierFile, secretFile) => {
  const formData = new FormData();
  formData.append("carrier_image", carrierFile);
  formData.append("secret_image", secretFile);

  const response = await fetch(`${API_BASE}/encode-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Encoding failed");

  return response.blob();
};

export const decodeImage = async (stegFile, format = "png") => {
  const formData = new FormData();
  formData.append("steg_image", stegFile);
  formData.append("output_format", format);

  const response = await fetch(`${API_BASE}/decode-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Decoding failed");

  return response.blob();
};
