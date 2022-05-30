import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDf47tj2nQYEAHPPAcoz4DVTbkcsY79aFU",
  authDomain: "whatsapp-mern-90d15.firebaseapp.com",
  projectId: "whatsapp-mern-90d15",
  storageBucket: "whatsapp-mern-90d15.appspot.com",
  messagingSenderId: "543702923364",
  appId: "1:543702923364:web:1fa9b3281d99299e4a8771",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
