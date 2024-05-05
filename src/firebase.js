// firebase.js
import {initializeApp} from 'firebase/app';
import { getStorage } from "firebase/storage"
 // Add the services you need

const firebaseConfig = {
    apiKey: "AIzaSyDf6kAOQf7F6Wq1LXvC1LMYoUvDVw2Ov3c",
    authDomain: "bcccproject.firebaseapp.com",
    projectId: "bcccproject",
    storageBucket: "bcccproject.appspot.com",
    messagingSenderId: "110400709905",
    appId: "1:110400709905:web:2eb7818aa3926b4d9858b0",
    measurementId: "G-ZX1YJGX203"
  };

const firebaseApp = initializeApp(firebaseConfig);


export const imageDB = getStorage(firebaseApp);
