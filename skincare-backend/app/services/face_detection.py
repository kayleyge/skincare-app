import cv2
import numpy as np
from typing import List, Dict, Tuple

class FaceAnalyzer:
    def __init__(self):
        # Load Haar Cascade for face detection
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.eye_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_eye.xml'
        )
    
    def detect_face(self, image: np.ndarray) -> Tuple[bool, List[Tuple[int, int, int, int]]]:
        """Detect faces in the image"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        return len(faces) > 0, faces.tolist() if len(faces) > 0 else []
    
    def extract_face_roi(self, image: np.ndarray, face_rect: Tuple[int, int, int, int]) -> np.ndarray:
        """Extract face region of interest"""
        x, y, w, h = face_rect
        return image[y:y+h, x:x+w]
    
    def detect_skin_issues(self, face_roi: np.ndarray) -> Dict:
        """Detect redness and dark spots in face ROI"""
        # Convert to different color spaces for analysis
        hsv = cv2.cvtColor(face_roi, cv2.COLOR_BGR2HSV)
        lab = cv2.cvtColor(face_roi, cv2.COLOR_BGR2LAB)
        
        # Detect redness
        redness_areas = self._detect_redness(face_roi, hsv)
        
        # Detect dark spots
        dark_spots = self._detect_dark_spots(face_roi, lab)
        
        # Calculate skin score
        skin_score = self._calculate_skin_score(redness_areas, dark_spots, face_roi.shape)
        
        return {
            "redness_areas": redness_areas,
            "dark_spots": dark_spots,
            "skin_score": skin_score
        }
    
    def _detect_redness(self, image: np.ndarray, hsv: np.ndarray) -> List[Dict]:
        """Detect red/inflamed areas"""
        # Define range for red colors in HSV
        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 50, 50])
        upper_red2 = np.array([180, 255, 255])
        
        # Create masks for red regions
        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        red_mask = mask1 + mask2
        
        # Apply morphological operations
        kernel = np.ones((5, 5), np.uint8)
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_CLOSE, kernel)
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_OPEN, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(red_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        redness_areas = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 100:  # Filter small areas
                x, y, w, h = cv2.boundingRect(contour)
                redness_areas.append({
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h),
                    "area": float(area),
                    "severity": self._calculate_severity(area, image.shape)
                })
        
        return redness_areas
    
    def _detect_dark_spots(self, image: np.ndarray, lab: np.ndarray) -> List[Dict]:
        """Detect dark spots/pigmentation"""
        # Extract L channel (lightness)
        l_channel = lab[:, :, 0]
        
        # Apply adaptive thresholding to find dark regions
        _, thresh = cv2.threshold(l_channel, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Invert to get dark regions
        dark_regions = cv2.bitwise_not(thresh)
        
        # Apply morphological operations
        kernel = np.ones((3, 3), np.uint8)
        dark_regions = cv2.morphologyEx(dark_regions, cv2.MORPH_CLOSE, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(dark_regions, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        dark_spots = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if 50 < area < 5000:  # Filter by size
                x, y, w, h = cv2.boundingRect(contour)
                # Additional check for circular dark spots
                circularity = 4 * np.pi * area / (cv2.arcLength(contour, True) ** 2)
                if circularity > 0.4:
                    dark_spots.append({
                        "x": int(x),
                        "y": int(y),
                        "width": int(w),
                        "height": int(h),
                        "area": float(area),
                        "circularity": float(circularity),
                        "severity": self._calculate_severity(area, image.shape)
                    })
        
        return dark_spots
    
    def _calculate_severity(self, area: float, image_shape: Tuple) -> str:
        """Calculate severity based on area relative to face size"""
        total_area = image_shape[0] * image_shape[1]
        ratio = area / total_area
        
        if ratio < 0.001:
            return "mild"
        elif ratio < 0.005:
            return "moderate"
        else:
            return "severe"
    
    def _calculate_skin_score(self, redness_areas: List[Dict], dark_spots: List[Dict], 
                             face_shape: Tuple) -> float:
        """Calculate overall skin score (0-100)"""
        # Base score
        score = 100.0
        
        # Deduct for redness
        for area in redness_areas:
            if area["severity"] == "mild":
                score -= 2
            elif area["severity"] == "moderate":
                score -= 5
            else:
                score -= 10
        
        # Deduct for dark spots
        for spot in dark_spots:
            if spot["severity"] == "mild":
                score -= 1
            elif spot["severity"] == "moderate":
                score -= 3
            else:
                score -= 5
        
        # Ensure score stays within bounds
        return max(0, min(100, score))