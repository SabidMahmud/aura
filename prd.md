
# **Product Requirements Document: Personal Pattern Analyzer (Name: "Aura")**

* **Version:** 1.0
* **Date:** July 17, 2025
* **Status:** Draft

---

## **1. Introduction & Vision**

### 1.1. Overview
This is an outline of the product requirements for "Aura," a web-based application designed to help individuals gain a deeper understanding of their own lives. Aura is a private, intelligent journal that moves beyond simple data tracking. By correlating daily actions with personal well-being metrics and leveraging AI for natural language processing and insight generation, Aura functions as a personal data scientist, revealing the hidden patterns that influence a user's mood, energy, and productivity.

### 1.2. Vision
To empower individuals with data-driven self-awareness, helping them make intentional, positive changes in their lives by understanding the "why" behind their best days.

## **2. The Problem**

Many people strive for self-improvement but lack the tools to understand their own behavior patterns effectively. The core problems are:

* **Lack of Connection:** It's difficult to connect specific daily actions (e.g., what we eat, when we exercise, who we talk to) with their ultimate outcomes (e.g., our mood, energy levels, productivity). We know some days are great and others are not, but the reasons are often a mystery.
* **Unstructured Data:** Traditional journaling is therapeutic but produces unstructured text that is difficult to analyze for patterns over time.
* **Rigid Trackers:** Habit trackers are good for monitoring consistency (e.g., "Did I meditate?") but fail to show the *impact* of that habit on the user's life.
* **High Friction:** Manually logging detailed data is tedious. Most users abandon tracking because the effort outweighs the perceived benefit.

## **3. The Solution**

Aura solves these problems by creating a frictionless, intelligent system for self-reflection.

1.  **Effortless Logging:** Aura provides multiple ways to log data with minimal effort, including one-click tags and an AI-powered natural language journal entry that automatically extracts relevant actions.
2.  **Automated Pattern Discovery:** A backend analysis engine runs automatically, processing the user's data to find statistically significant correlations between their actions (inputs) and their self-rated outcomes.
3.  **Personalized AI Insights:** The system doesn't just present raw data. It uses generative AI to translate complex correlations into simple, encouraging, and actionable insights presented in plain English, acting as a personalized wellness coach.

## **4. Target Audience**

We are building for individuals who are proactive about personal growth and well-being.

* **Persona 1: The Productivity Optimizer ("Samina")**
    * **Demographics:** 25-35 years old, professional in tech, consulting, or a creative field.
    * **Goals:** Maximize energy levels, improve focus, and achieve high performance without burnout.
    * **Pain Points:** Experiences significant fluctuations in daily productivity and can't pinpoint the cause. Wants to build sustainable high-performance habits.
    * **How Aura Helps:** Samina can track inputs like `Deep Work Session`, `Slept <7 Hours`, `Morning Sunlight` and correlate them with her `Productivity` and `Focus` ratings to build an evidence-based daily routine.

* **Persona 2: The Health & Wellness Seeker ("Rahim")**
    * **Demographics:** 40-55+ years old, potentially managing a chronic condition (e.g., migraines, IBD) or simply focused on healthy aging.
    * **Goals:** Identify lifestyle triggers that affect physical symptoms and overall mood. Have concrete data to share with their doctor.
    * **Pain Points:** Doctors ask "Have you noticed any patterns?", but it's hard to remember details accurately. Tracking symptoms and food in separate apps is disconnected.
    * **How Aura Helps:** Rahim can log `Ate Gluten`, `High Stress Day`, `Took Medication` and correlate these with metrics like `Pain Level` or `Energy`, providing clear data to guide his lifestyle choices and medical conversations.

## **5. Goals & Success Metrics**

Our primary goal is to provide genuine, actionable insights that lead to user retention.

| Goal | Metric | Success Target (First 3 Months) |
| :--- | :--- | :--- |
| **User Engagement** | Daily Active Users (DAU) / Monthly Active Users (MAU) Ratio | > 20% |
| | Average Actions Logged per Active Day | > 3 |
| **User Retention** | Day 7 (D7) Retention Rate | > 25% |
| | Day 30 (D30) Retention Rate | > 10% |
| **Product Adoption**| Onboarding Completion Rate | > 90% |
| | Percentage of users receiving their first insight | > 75% (of users active for 14+ days) |

<!-- ## **6. Features & Requirements (V1.0)**

### **Epic 1: User Accounts & Onboarding**

* **User Story 1.1:** As a new user, I want to sign up and log in easily using a third-party provider (e.g., Google) so I don't have to create a new password.
    * **Requirement:** Implement NextAuth.js with at least one OAuth provider.
* **User Story 1.2:** As a new user, I want to be guided through a simple setup process so I can configure the app to my personal needs.
    * **Requirement:** Create a multi-step onboarding flow post-signup.
    * **Requirement:** Users must be able to define the initial `Metrics` they want to track (e.g., Mood, Energy).
    * **Requirement:** Users must be able to create their initial set of `Tags` for actions they want to log.

### **Epic 2: Daily Data Logging**

* **User Story 2.1:** As a user, I want to quickly log a predefined action with a single click so that data entry is fast and frictionless.
    * **Requirement:** The main dashboard must display the user's tags as clickable buttons.
    * **Requirement:** Clicking a tag button will call a Server Action to create an `ActionLog` entry with the current timestamp.
* **User Story 2.2:** As a user, I want to write a journal entry in natural language and have the app intelligently identify and log my actions for me.
    * **Requirement:** The dashboard must include a textarea for journal entries.
    * **Requirement:** A Server Action will send the text to an AI API. The prompt must instruct the AI to extract tags based on the user's personal list of tags. The response must be parsed and saved as `ActionLog` entries.
* **User Story 2.3:** As a user, I want to rate my day across my chosen metrics at the end of the day so the app can analyze my outcomes.
    * **Requirement:** A form with sliders (1-5 scale) for each user-defined `Metric`.
    * **Requirement:** A Server Action will save the ratings to the `DailyRating` table for the current date.

### **Epic 3: Automated Insight Engine**

* **User Story 3.1:** As the system, I want to automatically analyze a user's data periodically to find patterns without the user needing to manually trigger it.
    * **Requirement:** A backend service/function (`runAnalysisForUser`) will contain the correlation logic.
    * **Requirement:** A scheduled Cron Job will trigger this service daily for all active users.
* **User Story 3.2:** As the system, I want to translate statistical findings into encouraging, human-readable summaries so they are easy for the user to understand.
    * **Requirement:** The analysis service will send its statistical findings (e.g., "positive correlation found between 'Tag X' and 'Metric Y'") to a generative AI.
    * **Requirement:** The AI's natural language response will be saved to the `Insight` table in the database.

### **Epic 4: Insights Dashboard**

* **User Story 4.1:** As a user, I want to see all the personalized insights the app has generated for me in one place so I can understand myself better.
    * **Requirement:** A dedicated `/insights` page that displays a list of insight cards.
* **User Story 4.2:** As a user, I want to see the data behind an insight so I can trust the conclusion.
    * **Requirement:** Each insight card will be expandable or clickable.
    * **Requirement:** Upon expansion, a simple chart (e.g., a bar chart from Recharts) will visualize the data comparison (e.g., average Mood on days with vs. without the tag). -->

---

## **Product Requirements and Features: Personal Pattern Analyzer ("Aura") v1.0**

This section outlines the core features and requirements for the initial release of Aura.

### **Epic 1: User Authentication & Onboarding**
* **Goal:** To provide a secure and seamless entry point for users and to personalize their experience from the start.

**User Story 1.1: User Sign-up and Login**
> **As a** new user, **I want to** sign up and log in quickly using a third-party provider **so that** I can access the application without creating a new password.

**Acceptance Criteria:**
* **1.1.1:** The landing page presents a single "Continue with Google" sign-in option.
* **1.1.2:** WHEN a user successfully authenticates with Google, THEN a corresponding `User` record is created in the database.
* **1.1.3:** New users are automatically redirected to the `/onboarding` flow after their first successful login.
* **1.1.4:** Returning users are automatically redirected to the main `/dashboard`.
* **1.1.5:** All application pages (except the landing page) must be protected and require authentication.

**User Story 1.2: First-Time User Onboarding**
> **As a** new user, **I want to** be guided through a setup process **so that** I can define the personal metrics and actions I want to track.

**Acceptance Criteria:**
* **1.2.1:** The onboarding flow consists of two distinct steps: defining `Metrics` and defining `Tags`.
* **1.2.2:** In the "Metrics" step, the user can create and name custom outcome metrics (e.g., "Mood", "Energy").
* **1.2.3:** In the "Tags" step, the user can create and name custom action tags (e.g., "Workout", "Read a Book").
* **1.2.4:** The user can add and remove multiple Metrics and Tags before finalizing.
* **1.2.5:** WHEN the setup is complete, THEN the new `Metrics` and `Tags` are saved to the database, associated with the `userId`, and the user is redirected to the `/dashboard`.

**User Story 1.3: User Sign-up with Email and Password**

> **As a** new user, **I want to** sign up with my email and a secure password **so that** I can create a dedicated account for this application without linking a third-party service.

**Acceptance Criteria:**

* **1.3.1:** The main login page must display a clear link or button, such as `Sign up with email`.

* **1.3.2:** Clicking the link navigates the user to a dedicated sign-up form (`/signup`).

* **1.3.3:** The sign-up form must contain the following fields:

    * Username

    * Email Address

    * Password (with input type `password`)

    * Confirm Password (with input type `password`)

* **1.3.4:** Form submission must have both client-side and server-side validation with clear error messages for the following conditions:

    * All fields are required.

    * Username must be unique and meet length/character requirements (e.g., min 3 characters, `alphanumeric`).

    * Email must be a valid format and must not already exist in the database.

    * Password must meet minimum security requirements (e.g., 8+ characters, contains at least one number).

    * "`Confirm Password`" field must match the "`Password`" field.

* **1.3.5:** WHEN the form is submitted with valid data, THEN the password must be securely hashed before being stored in the database. Plain text passwords must never be stored.

* **1.3.6:** Upon successful account creation, a new User record is created, the user is automatically logged in, and they are redirected to the `/onboarding` flow.

* **1.3.7:** The main login page must also provide fields for returning users to log in with their registered email and password.
---

### **Epic 2: Daily Data Logging**
* **Goal:** To provide a frictionless, multi-modal interface for users to log their daily data with minimal effort.

**User Story 2.1: One-Click Action Logging**
> **As a** user, **I want to** log a predefined action with a single click **so that** I can record my habits quickly throughout the day.

**Acceptance Criteria:**
* **2.1.1:** The `/dashboard` displays all user-defined `Tags` as clickable buttons.
* **2.1.2:** WHEN a user clicks a `Tag` button, THEN a new `ActionLog` record is created with the correct `tagId` and `userId`.
* **2.1.3:** The UI provides immediate visual feedback that the action has been successfully logged (e.g., button state change, toast notification).

**User Story 2.2: AI-Powered Journal Logging**
> **As a** user, **I want to** write a journal entry in natural language **so that** the app can automatically identify and log my actions for me.

**Acceptance Criteria:**
* **2.2.1:** The `/dashboard` contains a `textarea` for journal input.
* **2.2.2:** WHEN the user submits a journal entry, THEN the text is sent to a third-party AI API (e.g., OpenAI).
* **2.2.3:** The AI API is prompted to extract tags from the text based on the user's personal list of `Tags`.
* **2.2.4:** The system correctly parses the AI's JSON response and creates `ActionLog` records for each extracted tag.

**User Story 2.3: Daily Outcome Rating**
> **As a** user, **I want to** rate my day across my personal metrics **so that** the system can correlate my actions with my outcomes.

**Acceptance Criteria:**
* **2.3.1:** The `/dashboard` displays a slider (or similar 1-5 rating input) for each user-defined `Metric`.
* **2.3.2:** WHEN the user submits their ratings, THEN a `DailyRating` record is created for the current date, containing the value for each metric.

---

### **Epic 3: Automated Insight Engine**
* **Goal:** To process user data in the background to automatically discover and summarize meaningful patterns.

**User Story 3.1: Backend Pattern Analysis**
> **As a** system, **I want to** run a daily analysis of user data **so that** I can identify statistically significant correlations between actions and outcomes.

**Acceptance Criteria:**
* **3.1.1:** A scheduled (cron) job is configured to run once every 24 hours.
* **3.1.2:** The job processes data only for users with a sufficient amount of data (e.g., >14 days of logs).
* **3.1.3:** The analysis logic correctly compares the average metric ratings on days a specific tag was logged versus days it was not.
* **3.1.4:** WHEN a statistically significant correlation is found, THEN a new `Insight` record is created in the database.

**User Story 3.2: AI Insight Summarization**
> **As a** system, **I want to** use AI to translate statistical findings into natural language **so that** the insights are encouraging and easy for the user to understand.

**Acceptance Criteria:**
* **3.2.1:** After a correlation is identified, its structured data (e.g., `{tag: 'Workout', metric: 'Energy', effect: 'positive'}`) is sent to an AI API.
* **3.2.2:** The AI is prompted to generate a short, insightful, human-readable summary.
* **3.2.3:** The AI's text response is saved as the `content` of the `Insight` record.

---

### **Epic 4: Insights Dashboard**
* **Goal:** To present the generated insights to the user in a clear, trustworthy, and visually appealing manner.

**User Story 4.1: View Generated Insights**
> **As a** user, **I want to** see all my personalized insights in one place **so that** I can reflect on my behavior patterns.

**Acceptance Criteria:**
* **4.1.1:** A dedicated `/patterns` page fetches and displays all `Insight` records for the logged-in user.
* **4.1.2:** Insights are displayed as a list of individual cards.
* **4.1.3:** If no insights have been generated yet, the page displays a clear and motivating "empty state" message.

**User Story 4.2: Explore Data Behind an Insight**
> **As a** user, **I want to** see the data behind an insight **so that** I can understand and trust the conclusion.

**Acceptance Criteria:**
* **4.2.1:** Each insight card is expandable/clickable.
* **4.2.2:** WHEN a card is expanded, THEN a chart (e.g., a bar chart) is displayed.
* **4.2.3:** The chart accurately visualizes the data comparison supporting the insight (e.g., "Average Mood on days with workout" vs. "Average Mood on days without workout").
* **4.2.4:** The user can collapse the expanded view to return to the main list.

## **7. User Flow / Journey**

1.  **Discovery & Sign-up:** A new user lands on the marketing page, understands the value proposition, and signs up with their Google account.
2.  **Onboarding:** They are immediately taken to the onboarding flow where they define what "Energy" and "Productivity" mean to them (Metrics) and add a few activities they do regularly (Tags) like "Workout" and "Read."
3.  **Daily Logging:** Throughout the week, the user visits the dashboard. Some days they click the "Workout" tag button. Other days, they write "Had a long walk and felt great" in the journal, which the AI tags automatically. Each evening, they rate their Mood and Energy for the day.
4.  **Insight Delivery:** After two weeks, the nightly cron job finds a strong correlation. The AI generates a summary: "It looks like taking a walk has a significant positive impact on your mood!" This is saved as a new `Insight`.
5.  **Discovery:** The next time the user visits the `/insights` page, they see the new card. They smile, and click to see a chart confirming that their average mood rating is indeed much higher on the days they logged a walk. They feel empowered by this new self-knowledge.

## **8. Design & UX Requirements**

* **Aesthetic:** Minimalist, clean, modern, and calming. It should feel like a premium wellness application.
* **Color Palette:** Primarily monochromatic (whites, soft grays) with a single, warm accent color for interactive elements.
* **Typography:** A highly readable, sans-serif font.
* **Data Visualization:** Charts and graphs must be simple, clear, and labeled effectively. Avoid clutter.
* **Responsiveness:** The application must be fully responsive and provide an excellent experience on both mobile and desktop browsers.

## **9. Technical Considerations**

* **Tech Stack:** Next.js (App Router), Prisma, PostgreSQL, NextAuth.js, Tailwind CSS, Recharts, Vercel.
* **Data Privacy:** As the application handles sensitive personal data, all data transfer must be encrypted (HTTPS), and database access must be strictly controlled. A clear privacy policy is required.
* **AI API:** An account with OpenAI or Google AI or DeepSeek is required. Costs and rate limits must be considered. Logic should be in place to handle API failures gracefully.
* **Cron Job Reliability:** The Vercel Cron job configuration needs to be robust. A logging system should be in place to monitor job success and failures.

## **10. Future Work / Version 2.0**

* **Goal Setting:** Allow users to set specific goals (e.g., "Improve Mood") and have the app track progress and tailor insights toward that goal.
* **Predictive Insights:** Use machine learning to predict the user's likely end-of-day state based on actions logged so far.
* **Integrations:** Allow users to connect other data sources, like Google Calendar, Apple Health, or their fitness tracker, for automatic data logging.
* **Advanced Data Export:** Allow users to export their complete data history as a CSV or PDF to share with a professional (doctor, therapist, coach).

## **11. Out of Scope for Version 1.0**

* **Social Features:** There will be no ability to share insights, profiles, or data with other users. The experience is 100% private.
* **Native Mobile App:** This is a web-only application, designed to be mobile-responsive.
* **Direct Monetization:** There will be no subscription or payment features in V1.
* **Admin-defined Templates:** Users must define their own tags and metrics; there will be no pre-built templates.
