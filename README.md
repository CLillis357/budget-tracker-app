# Budget Tracker App
A mobile-friendly budget tracking application built with Angular and Ionic, designed to help users manage their personal finances. The app supports Firebase authentication for secure user accounts and Firestore integration to store and retrieve user-specific data such as income, expenses, and savings goals.

✅ Key Features:

User registration and login with Firebase Auth

Personalized dashboard to view and track income, expenses, and financial goals

Real-time data storage and retrieval using Firestore

Responsive UI optimized for mobile devices with Ionic

Intuitive design following standalone Angular component architecture

Setup Instructions

```bash
git clone https://github.com/your-username/budget-tracker-app.git
cd budget-tracker-app
npm install
ionic serve

ionic build
npx cap add android
npx cap open android
