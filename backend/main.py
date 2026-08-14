from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import aiohttp
import shutil
import uuid
import os
from datetime import datetime, timezone
from inference import predict_fake_real, predict_from_image

app = FastAPI()

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    timestamp = datetime.now(timezone.utc).isoformat()

    if not SUPABASE_URL or not SUPABASE_KEY:
        return {"status": "ok", "timestamp": timestamp, "supabase": "not configured"}

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/anonymous_scan_limits?select=ip_address&limit=1"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }

    try:
        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    raise RuntimeError(f"Supabase returned {response.status}")
    except Exception as e:
        raise HTTPException(status_code=503, detail={
            "status": "error",
            "timestamp": timestamp,
            "supabase": str(e),
        })

    return {"status": "ok", "timestamp": timestamp}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    temp_path = None
    try:
        ext = file.filename.split(".")[-1]
        print(f"Received file: {file.filename}, processing...")
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
        print(f"Result: {label}, Confidence: {confidence}")

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