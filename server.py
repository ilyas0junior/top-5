from flask import Flask, request, jsonify
from PIL import Image
import cntk as C
import numpy as np
import io

app = Flask(__name__)

# Load your CNTK model (assuming you have a pre-trained model file)
model = C.load_model("model_path.dnn")

def preprocess_image(image):
    # Example: Resize and convert to the appropriate format
    image = image.resize((224, 224))  # Adjust size to model input
    image_array = np.array(image, dtype=np.float32) / 255.0
    image_array = np.transpose(image_array, (2, 0, 1))  # Channel first
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded."}), 400

    image_file = request.files["image"].read()
    image = Image.open(io.BytesIO(image_file)).convert("RGB")
    processed_image = preprocess_image(image)

    # Get predictions from the model
    input_var = C.input_variable((3, 224, 224))
    model_output = model(input_var).eval({input_var: processed_image})
    
    # Dummy processing, replace this with actual result parsing
    top_prediction = np.argmax(model_output)
    
    return jsonify({"prediction": int(top_prediction)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
