import requests
import json

# Test if backend is running
try:
    response = requests.get("http://localhost:8000/")
    print(f"Root endpoint: {response.status_code}")
except Exception as e:
    print(f"Backend not accessible: {e}")

# Test registration endpoint
test_user = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "age": 25,
    "skin_type": "normal",
    "skin_concerns": ["acne", "dryness"],
    "current_products": "cleanser",
    "goals": "clear skin"
}

try:
    response = requests.post(
        "http://localhost:8000/auth/register",
        json=test_user,
        headers={"Content-Type": "application/json"}
    )
    print(f"Registration test: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Registration failed: {e}")