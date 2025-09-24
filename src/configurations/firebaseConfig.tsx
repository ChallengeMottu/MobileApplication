import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { getReactNativePersistence } = require("firebase/auth") as any;

const firebaseConfig = {
  apiKey: "AIzaSyAyxD94IbiUir4xx1TV_885VfB4liuVnTs",
  authDomain: "aulafirebaseauth-15f9d.firebaseapp.com",
  projectId: "aulafirebaseauth-15f9d",
  storageBucket: "aulafirebaseauth-15f9d.firebasestorage.app",
  messagingSenderId: "394472672848",
  appId: "1:394472672848:web:6b09556c908a409f5ecb55"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
