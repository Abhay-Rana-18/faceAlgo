import cv2
import os

# Known faces directory path (modify this path)
known_faces_dir = r"d:\web\unique\face-algo\src\app\logic\known_faces"

# Unknown image path (modify this path)
unknown_image_path = r"d:\web\unique\face-algo\src\app\logic\christiano.jpg"

# Load a pre-trained face detection model (Haar cascade)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load all known images and their labels (names)
known_faces = []
known_labels = []

for filename in os.listdir(known_faces_dir):
    img = cv2.imread(os.path.join(known_faces_dir, filename))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    # Assuming only one face per image in known faces directory
    if len(faces) > 0:
        x, y, w, h = faces[0]
        roi_gray = gray[y:y+h, x:x+w]
        known_faces.append(roi_gray)
        known_labels.append(os.path.splitext(filename)[0])  # Extract name from filename

# Load the unknown image
unknown_image = cv2.imread(unknown_image_path)
gray = cv2.cvtColor(unknown_image, cv2.COLOR_BGR2GRAY)

# Detect faces in the unknown image
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

# Variables to store results
best_match_distance = 0
best_match_label = None

# Loop through detected faces in the unknown image
for (x, y, w, h) in faces:
    # Extract the face region of interest (ROI) from the unknown image
    roi_gray = gray[y:y+h, x:x+w]

    # Use template matching to compare the unknown face with each known face
    for i, known_face in enumerate(known_faces):
        result = cv2.matchTemplate(roi_gray, known_face, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, _ = cv2.minMaxLoc(result)
        print(max_val)
        print(known_labels[i])
        # Update best match if a better match is found (based on correlation coefficient)
        if max_val > best_match_distance:
            best_match_distance = max_val
            best_match_label = known_labels[i]  # Update best match label

# Print results
if best_match_label:
    print(f"Most similar face: {best_match_label} (Similarity score: {best_match_distance:.2f})")
else:
    print("No similar faces found in the known faces directory.")

# Optional: Draw a bounding box around the detected face in the unknown image
if len(faces) > 0:
    x, y, w, h = faces[0]
    cv2.rectangle(unknown_image, (x, y), (x+w, y+h), (0, 255, 0), 2)
    cv2.imshow('Unknown Image with Detected Face', unknown_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
