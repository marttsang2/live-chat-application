import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTrHVq8OZu-7zcFBRVYjaqa4bOuTccH5A",
  authDomain: "live-chat-application-29e38.firebaseapp.com",
  projectId: "live-chat-application-29e38",
  storageBucket: "live-chat-application-29e38.appspot.com",
  messagingSenderId: "1749541156",
  appId: "1:1749541156:web:7e2b4b729b2b29d40693b1",
  measurementId: "G-PYBZ5RMX2J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
