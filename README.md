# Tick-Tick-TimeTrack

Quick Project Structure
├── index.html              # Entry HTML            ...
├── auth.js                 # Authentication       ......
├── firebase.js             # config firebase       .....
├── styles.css              # CSS config         ......... 
├──  app.js 
├──  app.html
├──  spa.js
├──  dashboard.html
├──  dashboard.css

TimeTrack — Productivity & Activity Tracking App

TimeTrack is a clean, modern Single Page Application (SPA) designed to help users track their daily activities, calculate total minutes, analyze categories, and monitor time usage through a dashboard.
The project is built using HTML, CSS, JavaScript, Firebase Authentication & Realtime Database.

🚀 Features
Authentication
Email/password login
Secure session using Firebase Auth
Auto-redirect after login

📊 Dashboard
Shows statistics for the current date:
Total Minutes Logged
Top Category
Daily Average
Remaining Minutes
Recent Activities



🎨 UI/UX

Modern glassmorphism design
Dark theme
Fully responsive layout
Sidebar navigation SPA
Smooth page switching

🛠️ Tech Stack
Technology	Purpose
HTML / CSS / JS	Core frontend
Firebase Auth	User login
Firebase Realtime Database	Store activities
Chart.js (future)	Analytics & graphs
Vanilla SPA Router	Page switching

📁 Project Structure
TimeTrack/
│
├── index.html / app.html     # Main app (SPA)
├── styles.css                # UI styling
├── app.js                    # Main logic
├── spa.js                    # SPA navigation
├── firebase.js               # Firebase config (optional)
├── README.md                 # Documentation

🔧 Firebase Setup

Go to Firebase Console

Create a project

Enable:
Authentication → Email/Password
Realtime Database → Set rules to allow only authenticated read/write

Copy Firebase config:

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
firebase.initializeApp(firebaseConfig);


Database structure:

users
 └─ USER_ID
     └─ activities
            └─ YYYY-MM-DD
                   └─ ACTIVITY_ID
                        ├─ name
                        ├─ category
                        └─ minutes

▶️ Run the Project

Open with Live Server or any local server:
# Using VS Code Live Server
Right-click → "Open with Live Server"

📌 Future Enhancements

Weekly summary
Category Pie Chart
Daily analytics graph
Notifications
AI productivity insights
