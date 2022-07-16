import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDOx5GtGGt2nhtRg6V4XKUa2RueTCYE0iA',
  authDomain: 'music-3843c.firebaseapp.com',
  projectId: 'music-3843c',
  storageBucket: 'music-3843c.appspot.com',
  messagingSenderId: '581204879662',
  appId: '1:581204879662:web:18522919d43a21c1d032bf'
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const userCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentCollection = db.collection('comments');

export {
  auth,
  db,
  userCollection,
  songsCollection,
  commentCollection,
  storage
};
