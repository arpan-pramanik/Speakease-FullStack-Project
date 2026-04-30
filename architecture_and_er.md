# SpeakEase Architecture and ER Diagram

## Project Architecture

The SpeakEase project follows a modern MERN (MongoDB, Express, React, Node.js) stack architecture augmented with WebGL for 3D rendering.

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
        API[Express REST API API Routes]
        Auth[JWT Authentication]
        Controllers[Business Logic / Controllers]
        Models[Mongoose Data Models]
    end

    subgraph Database [Database]
        MongoDB[(MongoDB NoSQL Database)]
    end

    Client -->|HTTP Requests / JSON| Frontend
    Frontend -->|Axios REST Calls| API
    UI --> State
    ThreeJS --> UI
    GSAP --> UI
    API --> Auth
    Auth --> Controllers
    Controllers --> Models
    Models -->|Mongoose Queries| MongoDB
```

### Architecture Description
1. **Frontend**: Built using React and Vite. It utilizes React Three Fiber for the 3D 'Neural Void' cinematic background and GSAP for fluid, hardware-accelerated animations. 
2. **Backend**: An Express.js REST API providing secure endpoints for user management, progression tracking, and content delivery. It handles business logic, scoring, and user state.
3. **Database**: A MongoDB NoSQL database used to store flexible schemas for users, languages, structured lessons, and user progress. 

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
- **User**: Stores authentication and profile data, along with global XP and streak details. A user selects a default language.
- **Language**: The core entity representing a language curriculum (e.g., Spanish, French). It contains multiple Lessons.
- **Lesson**: Structured learning content linked to a specific Language. Contains vocabulary and grammar notes.
- **Quiz**: Assessment content linked directly to a specific Lesson.
- **Progress**: A complex tracking entity that logs a User's completed lessons, quiz scores, earned XP, and activity timestamps to maintain streaks.
