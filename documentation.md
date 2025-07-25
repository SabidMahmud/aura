# Aura - Developer Documentation

This document provides a technical overview of the Aura project, covering its architecture, setup, and key components.

## 1. Project Overview

Aura is a Next.js application designed to help individuals gain a deeper understanding of their own lives by correlating daily actions with personal well-being metrics. It functions as a personal data scientist, revealing hidden patterns that influence a user's mood, energy and productivity.

**Key Technologies:**
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** Next.js Route Handlers, bcryptjs, jsonwebtoken

## 2. Project Structure

```
/
├── src/                  # Source code directory
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── (authentication)/ # Route group for authentication pages
│   │   │   ├── forgot-password/  # Forgot password page
│   │   │   │   └── page.tsx
│   │   │   ├── login/            # Login page
│   │   │   │   └── page.tsx
│   │   │   ├── onboarding/       # Onboarding page (placeholder)
│   │   │   │   └── page.tsx
│   │   │   └── signup/           # Sign-up page
│   │   │       └── page.tsx
│   │   ├── api/          # API routes
│   │   │   └── auth/     # Authentication API routes
│   │   │       ├── login/route.ts    # Handles user login
│   │   │       └── signup/route.ts   # Handles user registration
│   │   ├── favicon.ico
│   │   ├── globals.css   # Global CSS styles (Tailwind CSS imports)
│   │   ├── layout.tsx    # Root layout for the application
│   │   └── page.tsx      # Main application entry point (e.g., dashboard)
│   ├── lib/              # Utility functions and configurations
│   │   └── db.ts         # MongoDB connection setup
│   └── models/           # Mongoose schemas and models
│       ├── ActionLog.ts
│       ├── DailyRating.ts
│       ├── Insight.ts
│       ├── JournalEntry.ts
│       ├── Metric.ts
│       ├── Tag.ts
│       ├── User.ts       # User schema
│       └── index.ts      # Exports all Mongoose models
├── public/               # Static assets
├── .env.local            # Environment variables (local, ignored by Git)
├── .gitignore
├── next-env.d.ts
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.mjs
├── prd.md                # Product Requirements Document
├── README.md
└── tsconfig.json         # TypeScript configuration
```

## 3. Setup and Installation

To get the project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aura
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory of the project and add the following variables:

    *   `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas). Ensure the database name in the URI is set correctly.
        Example: `mongodb+srv://<username>:<password>@<cluster-url>/<your-database-name>?retryWrites=true&w=majority`
    *   `JWT_SECRET`: A strong, random string used for signing JWTs. You can generate one using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

    Example `.env.local`:
    ```
    MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/aura_db?retryWrites=true&w=majority"
    JWT_SECRET="your_super_long_and_random_secret_string_here"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

## 4. Database

### Connection

The application connects to MongoDB using Mongoose. The connection logic is encapsulated in `src/lib/db.ts`. It implements a caching mechanism to prevent multiple connections during hot reloads in development.

### Models

Mongoose schemas and models are defined in the `src/models/` directory. Each file typically defines an interface for the document and its corresponding Mongoose schema and model. The `src/models/index.ts` file re-exports all models for easier import.

**Key Models:**
*   `User.ts`: Defines the user schema, including fields for email, username, password (hashed), Google ID, and other user-related information. It includes `createdAt` and `updatedAt` timestamps.
*   Other models (e.g., `Metric`, `Tag`, `ActionLog`, `DailyRating`, `Insight`, `JournalEntry`) are defined to support the core functionality of the Aura application as outlined in `prd.md`.

## 5. API Endpoints

API routes are implemented using Next.js Route Handlers (`src/app/api/`). They are RESTful endpoints that handle data interactions.

### Authentication API (`/api/auth`)

*   **`POST /api/auth/signup`**
    *   **Description:** Registers a new user.
    *   **Request Body (JSON):**
        ```json
        {
            "username": "string",
            "email": "string",
            "password": "string"
        }
        ```
    *   **Response:**
        *   `201 Created`: User registered successfully.
        *   `400 Bad Request`: Missing fields or invalid data.
        *   `409 Conflict`: User with email or username already exists.
        *   `500 Internal Server Error`: Server-side error.
    *   **Logic:** Hashes the password using `bcryptjs` and saves the user to the database.

*   **`POST /api/auth/login`**
    *   **Description:** Authenticates a user and creates a session.
    *   **Request Body (JSON):**
        ```json
        {
            "email": "string",
            "password": "string"
        }
        ```
    *   **Response:**
        *   `200 OK`: Login successful. Sets an `httpOnly` cookie containing a JWT.
        *   `400 Bad Request`: Missing fields.
        *   `401 Unauthorized`: Invalid credentials.
        *   `500 Internal Server Error`: Server-side error.
    *   **Logic:** Verifies credentials, generates a JWT using `jsonwebtoken`, and sets it as an `httpOnly` cookie.

## 6. Frontend Pages

Frontend pages are built with React components within the Next.js App Router (`src/app/`).

*   **`/login` (`src/app/(authentication)/login/page.tsx`)**
    *   **Description:** User login interface.
    *   **Design:** Two-column layout with a branding panel on the left and a login form on the right.
    *   **Functionality:** Handles email/password input, form submission to `/api/auth/login`, and displays error messages. Includes links to sign-up and forgot password pages.

*   **`/signup` (`src/app/(authentication)/signup/page.tsx`)**
    *   **Description:** User registration interface.
    *   **Design:** Similar two-column layout as the login page.
    *   **Functionality:** Handles username, email, password, and confirm password input. Submits data to `/api/auth/signup` and redirects to `/onboarding` on success. Includes client-side password matching validation.

*   **`/forgot-password` (`src/app/(authentication)/forgot-password/page.tsx`)**
    *   **Description:** Page for initiating password reset.
    *   **Design:** Similar two-column layout.
    *   **Functionality:** Collects user's email to send a password reset link (backend logic for this is not yet implemented).

*   **`/onboarding` (`src/app/(authentication)/onboarding/page.tsx`)**
    *   **Description:** Placeholder page for the initial user onboarding flow.
    *   **Functionality:** Currently a basic placeholder. Will be expanded to allow users to define metrics and tags as per `prd.md`.

## 7. Authentication Flow

Authentication in Aura is handled using JWTs stored in `httpOnly` cookies.

1.  **Login:** Upon successful login, the `/api/auth/login` endpoint generates a JWT and sets it as an `httpOnly` cookie in the user's browser. This cookie is automatically sent with subsequent requests to the server.
2.  **Authorization (Future):** Middleware or server-side checks will be implemented to validate the JWT from the cookie on protected routes, ensuring only authenticated users can access certain resources.

## 8. Environment Variables

Ensure the following environment variables are defined in your `.env.local` file:

*   `MONGODB_URI`: Connection string for your MongoDB database.
*   `JWT_SECRET`: Secret key for signing JSON Web Tokens.

## 9. Future Enhancements

Based on the `prd.md`, planned future enhancements include:

*   Full implementation of the onboarding flow (defining metrics and tags).
*   Daily data logging features (one-click actions, AI-powered journal).
*   Automated insight engine for pattern analysis.
*   Insights dashboard for displaying personalized insights.
*   User profile management (editing metrics/tags, account deletion).
*   Integration with third-party AI services (e.g., OpenAI) for natural language processing and insight generation.
*   Google OAuth integration.

This documentation will be updated as the project evolves.