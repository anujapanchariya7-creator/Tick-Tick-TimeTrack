// Use your Firebase project's config here (this example uses the values you provided earlier)
var firebaseConfig = {
  apiKey: "AIzaSyDfLyVhyXeRbrBfzr3q0Mh2xXYyYouBZWc",
  authDomain: "tick-tick-tracking.firebaseapp.com",
  databaseURL: "https://tick-tick-tracking-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "tick-tick-tracking",
  storageBucket: "tick-tick-tracking.firebasestorage.app",
  messagingSenderId: "1085881707660",
  appId: "1:1085881707660:web:ef287af9e13dd1a1c89fa9"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
