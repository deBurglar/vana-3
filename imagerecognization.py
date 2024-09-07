import numpy as np
import cv2
import os
import mysql.connector
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity

# Load the pre-trained MobileNetV2 model for feature extraction
model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')

# MySQL connection setup
db_connection = mysql.connector.connect(
    host="localhost",  # Update with your MySQL server's host
    user="root",  # Update with your MySQL username
    password="4Kbuyjtcs@",  # Update with your MySQL password
    database="agricultural_products"  # Name of the database
)
cursor = db_connection.cursor()

# Load and preprocess the dataset images
def load_and_preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

# Extract features from an image using MobileNetV2
def extract_features(img_array):
    features = model.predict(img_array)
    return features

# Load dataset of agricultural products
dataset_dir = 'C:/Users/gaura/OneDrive/Desktop/coding/python/validation'  # Update with your dataset path
dataset_images = []
dataset_labels = []

for img_name in os.listdir(dataset_dir):
    img_path = os.path.join(dataset_dir, img_name)
    img_array = load_and_preprocess_image(img_path)
    features = extract_features(img_array)
    dataset_images.append(features)
    dataset_labels.append(img_name)

# Function to recognize agricultural products in a frame
def recognize_agricultural_product(frame, similarity_threshold=0.5):
    # Preprocess the frame
    img_resized = cv2.resize(frame, (224, 224))
    img_array = image.img_to_array(img_resized)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    
    # Extract features from the frame
    frame_features = extract_features(img_array)
    
    # Compare frame features with dataset features using cosine similarity
    similarities = []
    for dataset_img_features in dataset_images:
        similarity = cosine_similarity(frame_features, dataset_img_features)
        similarities.append(similarity[0][0])
    
    # Find the most similar product from the dataset
    best_match_idx = np.argmax(similarities)
    best_match_similarity = similarities[best_match_idx]
    
    # Check if the best match exceeds the similarity threshold
    if best_match_similarity >= similarity_threshold:
        best_match_label = dataset_labels[best_match_idx]
    else:
        best_match_label = "Not Detected"
    
    return best_match_label

# Function to insert detected product into MySQL database without date/time
def insert_product_to_db(product_name):
    if product_name != "Not Detected":
        sql = "INSERT INTO detections (product_name) VALUES (%s)"
        val = (product_name,)
        cursor.execute(sql, val)
        db_connection.commit()

# Open the camera
cap = cv2.VideoCapture(0)

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    if not ret:
        break

    # Recognize the agricultural product in the current frame
    best_match_label = recognize_agricultural_product(frame)
    
    # Insert detected product into the database (without date/time)
    insert_product_to_db(best_match_label)
    
    # Display the best match on the frame
    result_text = f"Product: {best_match_label}"
    cv2.putText(frame, result_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Show the frame with predictions
    cv2.imshow('Agricultural Product Recognition', frame)
    
    # Press 'q' to quit the live camera feed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release camera and close MySQL connection
cap.release()
cv2.destroyAllWindows()
db_connection.close()
