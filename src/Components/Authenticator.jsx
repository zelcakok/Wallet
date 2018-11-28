//Libraries
import firebase from 'firebase';

class Authenticator {
  static instance = null;

  constructor(){
    var config = {
      apiKey: "AIzaSyCffQlrQXqYcwOQZWLPsnsaeGHk6q8W6kw",
      authDomain: "blockchain-1077f.firebaseapp.com",
      databaseURL: "https://blockchain-1077f.firebaseio.com",
      projectId: "blockchain-1077f",
      storageBucket: "blockchain-1077f.appspot.com",
      messagingSenderId: "650452753735"
    };
    this.auth = firebase.initializeApp(config).auth();
  }

  static getInstance(){
    if(Authenticator.instance === null) Authenticator.instance = new Authenticator();
    return Authenticator.instance;
  }

  isLoggedIn=()=>{
    return new Promise((resolve, reject)=>{
      this.auth.onAuthStateChanged((user)=>{
        if(!user) resolve(false)
        else resolve({
          uid: user.uid,
          username: user.email.split("@")[0]
        });
      });
    });
  }

  signOut=()=>{
    this.auth.signOut();
  }
}

export default Authenticator;
