import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from './firebase.config.js'

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
// firebase.analytics();

export default {
	app,
	db,
}