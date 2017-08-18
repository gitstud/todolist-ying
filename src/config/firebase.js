import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDn9UaSG23fl134JIZSmVZbIcZepqlC4n0",
  authDomain: "ying-e3a7e.firebaseapp.com",
  databaseURL: "https://ying-e3a7e.firebaseio.com",
  projectId: "ying-e3a7e",
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
