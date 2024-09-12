# HeartBugTechnical
This is a simple To do application for heartbug technical challenge developed using Angular Framework, and Node js in the backend along with Firebase firestore database.



HeartBug To-Do Application
This project is a To-Do Application built as a technical challenge solution for HeartBug. The application uses Angular 18 for the frontend, Node.js for the backend, and Firebase Firestore for the database.

#Technologies Used
Frontend: Angular 18
Backend: Node.js
Database: Firebase Firestore
Hosting: App URL
#Features
Add, edit, delete tasks
Filter tasks based on status and priority
Responsive design for mobile and desktop
Real-time data synchronization with Firebase Firestore
#How to Run Locally
#Backend Setup (Node.js)
1. Navigate to the Backend directory:
cd HeartBugTechnical/Backend
2.Install dependencies:
npm install
3. Create a .env file in the Backend folder and add your Firebase Firestore database URL:
databaseURL="yourdatabaseurlforfirebase"
4. Add serviceAccount.json: Place the serviceAccount.json file (downloadable from your Firebase console) in the root directory of the Backend, at the same level as server.js.
5. Run the backend server:
node server.js
The backend server will be running on http://localhost:8084.

#Frontend Setup (Angular)
1.Navigate to the Frontend directory:
cd Frontend
2.Install dependencies:
npm install
4.Update the environment.prod.ts file in the src/environments/ folder:
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8084' // Change this to your local backend URL
};
4. Run the frontend server:

ng serve
The frontend will be running on http://localhost:4200.

#Environment Configuration
Ensure you have a .env file in the backend directory with the following content:
databaseURL="yourdatabaseurlforfirebase"
#Firebase Configuration
You also need to add serviceAccount.json in the Backend directory at the root level (next to server.js). This file contains the credentials to connect to Firebase Firestore.
#Hosting Information
The application is hosted at: http://roshanaalemagar.com:8083/home

#Repository
The source code is available in this repository: HeartBugTechnical
