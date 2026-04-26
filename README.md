# SpeakEase: Immersive AI Language Learning

SpeakEase is a high-fidelity, immersive language learning platform that combines cinematic UI/UX with modern AI to create a truly engaging education experience.

![Dashboard Preview](https://img.stackshare.io/service_logos/vite.png)

## Features

- **Immersive 3D/Cinematic UI**: Built with React, Framer Motion, and custom Web Audio for a premium "theatre-like" experience.
- **AI-Powered Curriculum**: Dynamic lesson and quiz generation powered by Mistral AI.
- **Interactive Exercises**: Support for multiple exercise types including multiple choice, fill-in-the-blanks, sentence formation, and matching.
- **Progress Tracking**: Real-time tracking of XP, levels, and learning streaks.
- **Global Leaderboard**: Compete with other learners worldwide.
- **AI Chatbot**: A friendly AI tutor always available for advice and conversation.

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **Mistral API Key**

### Getting a Mistral API Key

1. Go to the [Mistral AI Console](https://console.mistral.ai/).
2. Create an account or sign in.
3. Navigate to the **API Keys** section.
4. Click **Create new key**.
5. Copy the key immediately (you won't be able to see it again).

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arpan-pramanik/Speakease-FullStack-Project.git
   cd Speakease-FullStack-Project
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   MISTRAL_API_KEY=your_mistral_key
   ```

3. **Setup Client**:
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_MISTRAL_API_KEY=your_mistral_key
   ```

4. **Seed the Database**:
   ```bash
   cd ../server
   node seed.js
   node add100Languages.js
   node addExpandedLessons.js
   ```

5. **Run the Application**:
   ```bash
   cd ..
   npm run dev
   ```

## Tech Stack

- **Frontend**: Vite, React, Framer Motion, Lenis Scroll.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI Engine**: Mistral AI (Small & Large models).
- **Authentication**: JWT, Google OAuth.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
