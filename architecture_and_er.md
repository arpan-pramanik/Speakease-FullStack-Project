# SpeakEase Architecture and ER Diagram

## Project Architecture

The SpeakEase project follows a modern MERN (MongoDB, Express, React, Node.js) stack architecture augmented with WebGL for 3D rendering and Google OAuth 2.0 for seamless authentication.

```mermaid
graph TD
    Client[Client / Web Browser]
    subgraph Frontend [Frontend React / Vite]
        UI[React User Interface]
        ThreeJS[React Three Fiber / Three.js 3D Engine]
        GSAP[GSAP Animations]
        State[React Context / State Management]
    end

    subgraph Backend [Backend Node.js / Express]
        API[Express REST API]
        Auth[JWT Authentication & Google OAuth]
        Admin[Admin Dashboard Routes]
        Controllers[Business Logic / Controllers]
        Models[Mongoose Data Models]
    end

    subgraph Database [Database]
        MongoDB[(MongoDB NoSQL Database)]
    end

    subgraph External [External Services]
        GoogleOAuth[Google OAuth Provider]
        MistralAI[Mistral AI Service]
    end

    Client -->|HTTP Requests / JSON| Frontend
    Client -->|OAuth Token Request| GoogleOAuth
    GoogleOAuth -->|Credential| Client
    Frontend -->|Axios REST Calls| API
    UI --> State
    ThreeJS --> UI
    GSAP --> UI
    API --> Auth
    API --> Admin
    API --> Controllers
    Controllers --> MistralAI
    Auth --> Controllers
    Admin --> Controllers
    Controllers --> Models
    Models -->|Mongoose Queries| MongoDB
```

### Architecture Description
1. **Frontend**: Built using React and Vite. It utilizes React Three Fiber for the 3D 'Neural Void' cinematic background and GSAP for fluid, hardware-accelerated animations. Google OAuth allows easy sign-in.
2. **Backend**: An Express.js REST API providing secure endpoints for user management, progression tracking, content delivery, and an Admin panel. It features standard JWT and Google OAuth authentication.
3. **External Services**: Uses Google's OAuth 2.0 system for login and integrates with Mistral AI for dynamic content generation.
4. **Database**: A MongoDB NoSQL database used to store flexible schemas for users, languages, structured lessons, and user progress.

## Entity-Relationship (ER) Diagram

The following ER diagram maps the data models used within the SpeakEase application.

```mermaid
erDiagram
    User ||--o{ Progress : "has"
    User {
        ObjectId _id
        String name
        String email
        String password
        String role
        String avatar
        ObjectId selectedLanguage
        Number streakDays
        Date lastActive
        Number totalXP
    }

    Language ||--o{ User : "selected by"
    Language ||--o{ Lesson : "contains"
    Language {
        ObjectId _id
        String languageName
        String code
        String level
        String description
        Number totalLessons
        Boolean isActive
    }

    Lesson ||--o{ Quiz : "has"
    Lesson {
        ObjectId _id
        ObjectId languageId
        String title
        String description
        String difficulty
        Number order
        Object content
        Number xpReward
    }

    Quiz {
        ObjectId _id
        ObjectId lessonId
        String title
        Object[] questions
        Number totalPoints
        Number passingScore
    }

    Progress ||--o{ Lesson : "tracks completion of"
    Progress ||--o{ Quiz : "tracks scores of"
    Progress ||--o{ Language : "tracks current language"
    Progress {
        ObjectId _id
        ObjectId userId
        ObjectId currentLanguage
        Object[] completedLessons
        Object[] quizScores
        Number streakDays
        Number totalXP
    }
```

### ER Diagram Description
- **User**: Stores authentication and profile data. Supports users created via standard email/password or Google OAuth (using a generated random password). Includes role-based access (`user` vs `admin`).
- **Language**: The core entity representing a language curriculum (e.g., Spanish, French). It contains multiple Lessons.
- **Lesson**: Structured learning content linked to a specific Language. Contains vocabulary and grammar notes.
- **Quiz**: Assessment content linked directly to a specific Lesson.
- **Progress**: A complex tracking entity that logs a User's completed lessons, quiz scores, earned XP, and activity timestamps to maintain streaks.
