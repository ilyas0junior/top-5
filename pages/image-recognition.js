import React, { useState, useRef } from "react";
import axios from "axios";

export default function ImageRecognition() {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState("");
  const fileInputRef = useRef();

  const loadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const recognizeImage = async () => {
    if (!fileInputRef.current.files[0]) return;

    const formData = new FormData();
    formData.append("image", fileInputRef.current.files[0]);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPredictions(response.data.prediction);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>AI Image Recognition (CNTK)</h1>
      <input
        type="file"
        accept="image/*"
        onChange={loadImage}
        ref={fileInputRef}
      />
      <br />
      {image && (
        <div>
          <img
            id="input-image"
            src={image}
            alt="Uploaded"
            style={{ maxWidth: "300px", marginTop: "20px" }}
          />
          <br />
          <button onClick={recognizeImage} style={{ marginTop: "20px" }}>
            Recognize Image
          </button>
        </div>
      )}
      {predictions && (
        <div style={{ marginTop: "20px" }}>
          <h3>Predictions:</h3>
          <p>{predictions}</p>
        </div>
      )}
    </div>
  );
}
