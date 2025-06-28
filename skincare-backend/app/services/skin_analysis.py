import cv2
import numpy as np
import base64
from typing import Dict, List, Tuple
from app.services.face_detection import FaceAnalyzer

class SkinAnalysisService:
    def __init__(self):
        self.face_analyzer = FaceAnalyzer()
    
    async def analyze_skin(self, image_data: str) -> Dict:
        """Analyze skin from base64 encoded image"""
        try:
            # Decode base64 image
            image = self._decode_base64_image(image_data)
            
            # Detect face
            has_face, faces = self.face_analyzer.detect_face(image)
            
            if not has_face:
                return {
                    "success": False,
                    "error": "No face detected in the image"
                }
            
            # Use the first detected face
            face_rect = faces[0]
            face_roi = self.face_analyzer.extract_face_roi(image, face_rect)
            
            # Analyze skin issues
            analysis_result = self.face_analyzer.detect_skin_issues(face_roi)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(analysis_result)
            
            # Create annotated image
            annotated_image = self._create_annotated_image(
                image, face_rect, analysis_result
            )
            
            return {
                "success": True,
                "skin_score": analysis_result["skin_score"],
                "detected_issues": {
                    "redness_count": len(analysis_result["redness_areas"]),
                    "dark_spots_count": len(analysis_result["dark_spots"])
                },
                "redness_areas": analysis_result["redness_areas"],
                "dark_spot_areas": analysis_result["dark_spots"],
                "recommendations": recommendations,
                "annotated_image": self._encode_image_base64(annotated_image),
                "face_location": {
                    "x": face_rect[0],
                    "y": face_rect[1],
                    "width": face_rect[2],
                    "height": face_rect[3]
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _decode_base64_image(self, image_data: str) -> np.ndarray:
        """Decode base64 image to numpy array"""
        # Remove data:image/jpeg;base64, prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return image
    
    def _encode_image_base64(self, image: np.ndarray) -> str:
        """Encode numpy array image to base64"""
        _, buffer = cv2.imencode('.jpg', image)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/jpeg;base64,{image_base64}"
    
    def _create_annotated_image(self, image: np.ndarray, face_rect: Tuple, 
                                analysis_result: Dict) -> np.ndarray:
        """Create annotated image with detected issues marked"""
        annotated = image.copy()
        x, y, w, h = face_rect
        
        # Draw face rectangle
        cv2.rectangle(annotated, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
        # Draw redness areas
        for area in analysis_result["redness_areas"]:
            rx = x + area["x"]
            ry = y + area["y"]
            rw = area["width"]
            rh = area["height"]
            cv2.rectangle(annotated, (rx, ry), (rx + rw, ry + rh), (0, 0, 255), 2)
            cv2.putText(annotated, "R", (rx, ry - 5), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        
        # Draw dark spots
        for spot in analysis_result["dark_spots"]:
            sx = x + spot["x"]
            sy = y + spot["y"]
            sw = spot["width"]
            sh = spot["height"]
            cv2.ellipse(annotated, (sx + sw//2, sy + sh//2), 
                       (sw//2, sh//2), 0, 0, 360, (255, 0, 255), 2)
            cv2.putText(annotated, "D", (sx, sy - 5), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 255), 1)
        
        # Add skin score
        cv2.putText(annotated, f"Skin Score: {analysis_result['skin_score']:.1f}", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        return annotated
    
    def _generate_recommendations(self, analysis_result: Dict) -> List[str]:
        """Generate skincare recommendations based on analysis"""
        recommendations = []
        
        # Recommendations based on redness
        redness_count = len(analysis_result["redness_areas"])
        if redness_count > 5:
            recommendations.append("Consider using anti-inflammatory products with niacinamide or centella asiatica")
            recommendations.append("Avoid harsh exfoliants and focus on gentle, soothing skincare")
        elif redness_count > 0:
            recommendations.append("Use a gentle cleanser and moisturizer suitable for sensitive skin")
        
        # Recommendations based on dark spots
        dark_spots_count = len(analysis_result["dark_spots"])
        if dark_spots_count > 10:
            recommendations.append("Consider using vitamin C serum or products with kojic acid for hyperpigmentation")
            recommendations.append("Always use SPF 30+ sunscreen to prevent further dark spots")
        elif dark_spots_count > 0:
            recommendations.append("Use a daily SPF to prevent dark spots from worsening")
        
        # General recommendations based on score
        score = analysis_result["skin_score"]
        if score >= 90:
            recommendations.append("Your skin looks great! Maintain your current routine")
        elif score >= 70:
            recommendations.append("Focus on consistency with your skincare routine")
        else:
            recommendations.append("Consider consulting a dermatologist for personalized advice")
        
        return recommendations