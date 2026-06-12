import cv2
import numpy as np
import tensorflow as tf
from mtcnn import MTCNN
from concurrent.futures import ThreadPoolExecutor

model = tf.keras.models.load_model('model/xception_5o.h5')
IMAGE_SIZE = (224, 224)
MAX_SEQ_LENGTH = 20
BATCH_SIZE = 32
FRAME_SAMPLE_RATE = 2 # Changed from 10 to sample more frames from short clips

feature_extractor = tf.keras.applications.Xception(weights="imagenet", include_top=False, pooling="avg")
detector = MTCNN()

def extract_frames_from_video(video_path, sample_rate=FRAME_SAMPLE_RATE):
    frames = []
    vidcap = cv2.VideoCapture(video_path)
    success, image = vidcap.read()
    count = 0
    while success:
        if count % sample_rate == 0:
            frames.append(image)
        success, image = vidcap.read()
        count += 1
    return frames

def detect_and_crop_faces(frame):
    faces = []
    boxes = []
    
    # Convert OpenCV BGR to MTCNN expected RGB format
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    detections = detector.detect_faces(rgb_frame)
    
    for detection in detections:
        x, y, width, height = detection['box']
    
        face = frame[y:y+height, x:x+width]
        face = cv2.resize(face, IMAGE_SIZE)
        faces.append(face)
        boxes.append((x, y, width, height))
    return faces, boxes

def preprocess_faces(faces):
    face_features = np.zeros((len(faces), *IMAGE_SIZE, 3))
    for i, face in enumerate(faces):
        face_features[i] = tf.keras.applications.xception.preprocess_input(face)
    return face_features

def detect_faces_parallel(frames):
    with ThreadPoolExecutor() as executor:
        results = executor.map(detect_and_crop_faces, frames)
    all_faces = []
    all_boxes = []
    for faces, boxes in results:
        all_faces.extend(faces)
        all_boxes.extend(boxes)
    return all_faces, all_boxes

def preprocess_faces(faces):
    # Strip out any unexpected None entries or zero-size frame artifacts safely
    valid_faces = [f for f in faces if f is not None and f.size > 0]
    
    if not valid_faces:
        # Fallback matrix array so TensorFlow doesn't throw a NoneType Tensor error
        return np.zeros((1, *IMAGE_SIZE, 3))
        
    face_features = np.zeros((len(valid_faces), *IMAGE_SIZE, 3))
    for i, face in enumerate(valid_faces):
        face_features[i] = tf.keras.applications.xception.preprocess_input(face)
    return face_features

def predict_fake_real(video_path):
    frames = extract_frames_from_video(video_path)
    if not frames:
        print("OpenCV could not extract any frames from this video file format.")
        return None, None, None

    all_faces, all_boxes = detect_faces_parallel(frames)

    # Zip lists and safely eliminate any frames where MTCNN failed to extract a face matrix
    valid_pairs = [(f, b) for f, b in zip(all_faces, all_boxes) if f is not None and f.size > 0]

    if not valid_pairs:
        print("No valid faces tracked across the extracted video frames.")
        return None, None, None

    # Re-extract your matching pairs cleanly up to MAX_SEQ_LENGTH
    all_faces = [pair[0] for pair in valid_pairs][:MAX_SEQ_LENGTH]
    all_boxes = [pair[1] for pair in valid_pairs][:MAX_SEQ_LENGTH]

    preprocessed_faces = preprocess_faces(all_faces)
    predictions = []
    for i in range(0, len(preprocessed_faces), BATCH_SIZE):
        batch_faces = preprocessed_faces[i:i+BATCH_SIZE]
        batch_predictions = model.predict(np.array(batch_faces))
        predictions.extend(batch_predictions)

    avg_prediction = float(np.mean(predictions))
    label = 'FAKE' if avg_prediction >= 0.5 else 'REAL'

    confidences = [float(p[0]) for p in predictions]
    
    most_confident_idx = int(np.argmax(confidences)) if label == 'FAKE' else int(np.argmin(confidences))
    representative_box = all_boxes[most_confident_idx]

    return label, avg_prediction, representative_box

def predict_from_image(image_path):
    image = cv2.imread(image_path)
    faces, boxes = detect_and_crop_faces(image)

    if not faces:
        print("No faces detected!")
        return None, None, None

    preprocessed_faces = preprocess_faces(faces)
    predictions = model.predict(np.array(preprocessed_faces))
    avg_prediction = float(np.mean(predictions))
    label = 'FAKE' if avg_prediction >= 0.5 else 'REAL'

    representative_box = boxes[0]

    return label, avg_prediction, representative_box


# Example usage:
if __name__ == "__main__":
    video_path = '410298807-2e9b9b82-fa04-4b70-9f56-b1f68e7672d0 (online-video-cutter.com).mp4' 
    result = predict_fake_real(video_path)
    print(f'The video is {result}')
    image_path = 'test.jpg'
    result = predict_from_image(image_path)
    print(f'The image is {result}')