from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os
from inference import predict_fake_real, predict_from_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    temp_path = None
    try:
        ext = file.filename.split(".")[-1]
        temp_path = f"temp_{uuid.uuid4()}.{ext}"

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if ext.lower() in ["mp4", "mov", "avi", "webm"]:
            result = predict_fake_real(temp_path)
        else:
            result = predict_from_image(temp_path)

        if result is None or result[0] is None:
            return {"error": "No faces detected."}

        label, confidence, box = result

        return {
            "result": label,
            "confidence": confidence,
            "prediction_id": str(uuid.uuid4()),
            "box": {"x": box[0], "y": box[1], "width": box[2], "height": box[3]} if box else None
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)