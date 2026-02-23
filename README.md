# Is This True? 📱🔍

A mobile app that lets users fact-check any screen content with a single tap.

## Features

- **Sticky Overlay Button** - The "IS THIS TRUE" button floats on top of any app
- **One-Tap Analysis** - Take a screenshot and get instant fact-checking results
- **Truth Percentage** - See how likely a claim is to be true (0-100%)
- **Source Attribution** - Get links to fact-checking sources

## Screenshots

![Home Screen](docs/home.png)
![Permissions](docs/permissions.png)
![Result Popup](docs/result.png)

## Tech Stack

- **Mobile App**: React Native with Expo
- **Backend**: FastAPI (Python)
- **OCR**: Google Cloud Vision API or Tesseract
- **Search**: Brave Search API

## Project Structure

```
is-this-true/
├── app/                    # React Native Expo app
│   ├── App.tsx            # Main app component
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   └── PermissionsScreen.tsx
│   ├── components/        # UI components
│   │   ├── OverlayButton.tsx
│   │   └── ResultPopup.tsx
│   ├── services/          # API & screenshot services
│   └── constants/         # Theme & constants
├── backend/               # Python FastAPI backend
│   ├── main.py
│   └── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Expo CLI
- Google Cloud Vision API key (optional, for production)
- Brave Search API key (optional, for production)

### Install & Run

#### Mobile App

```bash
cd app
npm install
npx expo start
```

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Permissions Required

### Android
- `SYSTEM_ALERT_WINDOW` - Display over other apps
- `READ_EXTERNAL_STORAGE` - Access screenshots
- `FOREGROUND_SERVICE` - Keep running in background

### iOS
- Screen Recording permission
- Photo Library access

## How It Works

1. **Install & Setup** - User installs app and grants permissions
2. **Overlay Appears** - The "IS THIS TRUE" button appears on screen
3. **User Taps** - When user sees something to fact-check, they tap the button
4. **Screenshot Captured** - App captures current screen
5. **Analysis** - Backend extracts text and searches for facts
6. **Results** - User sees truth percentage and summary

## API Endpoints

### POST /analyze
Analyze an image for fact-checking.

**Request:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "claim": "Extracted claim text",
    "percentage": 23,
    "summary": "No credible evidence found...",
    "sources": ["Reuters", "Snopes", "FactCheck.org"]
  }
}
```

## Production Deployment

### Mobile App
1. Build with `expo build` or `eas build`
2. Submit to App Store / Play Store
3. Configure permissions properly

### Backend
1. Deploy to cloud (Render, Railway, Heroku, etc.)
2. Add API keys as environment variables
3. Configure CORS for mobile app

## License

MIT

## Author

Built with ⚔️ by Zoro
