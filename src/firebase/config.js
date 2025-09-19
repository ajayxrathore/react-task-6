import { initializeApp } from "firebase/app";
const firebaseConfig = {
  // apiKey: "AIzaSyApR487FNc8VvSX7hfAfR3enAXId_u5t9Y",
  // authDomain: "react-task-6-d91aa.firebaseapp.com",
  // projectId: "react-task-6-d91aa",
  // storageBucket: "react-task-6-d91aa.firebasestorage.app",
  // messagingSenderId: "1061990484927",
  // appId: "1:1061990484927:web:865b9b93b7dee024f66f0a"
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};
const app = initializeApp(firebaseConfig);


export default app;
