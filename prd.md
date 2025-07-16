
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

## **6. Features & Requirements (V1.0)**

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
    * **Requirement:** Upon expansion, a simple chart (e.g., a bar chart from Recharts) will visualize the data comparison (e.g., average Mood on days with vs. without the tag).

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
