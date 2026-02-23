# Is This True? - Mobile App Specification

## Project Overview
- **Name:** Is This True?
- **Type:** React Native Mobile Application (iOS + Android)
- **Core Functionality:** Overlay button on user's screen that captures screenshots, analyzes content for fact-checking, and returns truth percentage.

## Technical Stack
- **Frontend:** React Native with Expo
- **Backend:** FastAPI (Python) 
- **OCR:** Google Cloud Vision API or Tesseract
- **Search:** Brave Search API for fact-checking

## Feature List

### 1. App Permission Setup
- Accessibility Service permission (for overlay)
- Screenshot permission
- Overlay permission (SYSTEM_ALERT_WINDOW on Android)
- Notification permission

### 2. Home Screen
- Welcome/intro screen explaining the app
- "Get Started" button to request permissions
- Status display showing which permissions are granted

### 3. Sticky Overlay Button
- Floating button that appears over other apps
- Draggable to any position on screen
- Text: "IS THIS TRUE"
- Visual styling: nice gradient, rounded corners, shadow

### 4. Screenshot Capture
- Captures current screen when button is pressed
- Works in background

### 5. Analysis Popup
- Nice-looking popup with results
- Shows percentage (e.g., "Florida aliens: 5% chance of being true")
- "OK" button to dismiss
- Loading state while analyzing

### 6. Backend API
- Receives image
- Extracts text using OCR
- Performs web search for claims
- Returns truth percentage

## Permission Requirements

### Android
- `SYSTEM_ALERT_WINDOW` - For overlay
- `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` - For screenshots
- `FOREGROUND_SERVICE` - For persistent service
- Accessibility Service - For overlay service

### iOS
- Screen Recording permission
- Limited overlay capabilities (would require some workarounds)

## UI/UX Design

### Colors
- Primary: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Purple)
- Accent: #F59E0B (Amber)
- Background: #0F172A (Dark)
- Text: #FFFFFF
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)

### Typography
- Headings: Bold, 24-32px
- Body: Regular, 16px
- Button: Semi-bold, 18px

### Components
- Gradient buttons with shadows
- Rounded corners (12-16px)
- Modal popups with backdrop blur
- Loading spinners

## File Structure
```
is-this-true/
├── app/                    # React Native Expo app
│   ├── App.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── PermissionsScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── components/
│   │   ├── OverlayButton.tsx
│   │   ├── ResultPopup.tsx
│   │   └── PermissionCard.tsx
│   ├── services/
│   │   ├── screenshot.ts
│   │   └── api.ts
│   └── constants/
│       └── theme.ts
├── backend/               # Python FastAPI backend
│   ├── main.py
│   ├── analysis.py
│   └── requirements.txt
└── README.md
```
