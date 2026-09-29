import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDKz4AvQ-viJlZ_OusAAcilnGPTv3M2tX4",
    authDomain: "fm-61069.firebaseapp.com",
    databaseURL: "https://fm-61069-default-rtdb.firebaseio.com",
    projectId: "fm-61069",
    storageBucket: "fm-61069.firebasestorage.app",
    messagingSenderId: "674211748768",
    appId: "1:674211748768:web:2c653c91e4a962ad81e2c5",
    measurementId: "G-C2RH92NKLW"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);