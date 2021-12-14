'use strict';
// Initializes the Demo.
function Demo() {
  document.addEventListener('DOMContentLoaded', function() {
    console.log("fn working")
    // Shortcuts to DOM Elements.
    this.signInButton = document.getElementById('sign-in-button');
    this.signOutButton = document.getElementById('sign-out-button');
    this.signedOutCard = document.getElementById('signed-out-card');
    this.signedInCard = document.getElementById('signed-in-card');
    this.signInButton2 = document.getElementById('sign-in-button2');
    this.signOutButton2 = document.getElementById('sign-out-button2');
    this.signedOutCard2 = document.getElementById('signed-out-card2');
    this.signedInCard2 = document.getElementById('signed-in-card2');
    this.signedOutCard2.style.display = 'block';
    this.signedInCard2.style.display = 'none';

    // Bind events.

    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton2.addEventListener('click', this.signIn.bind(this));
    this.signOutButton2.addEventListener('click', this.signOut.bind(this));
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }.bind(this));
}

// Triggered on Firebase auth state change.
Demo.prototype.onAuthStateChanged = function(user) {
  if (user) {
    this.signedOutCard.style.display = 'none';
    this.signedInCard.style.display = 'block';
    this.signedOutCard2.style.display = 'none';
    this.signedInCard2.style.display = 'block';
    // this.startFunctionsRequest();
    this.startFunctionsCookieRequest(()=>{});
    
  } else {
    this.signedOutCard.style.display = 'block';
    this.signedInCard.style.display = 'none';
    this.signedOutCard2.style.display = 'block';
    this.signedInCard2.style.display = 'none';
  }
};

// Initiates the sign-in flow using GoogleAuthProvider sign in in a popup.
Demo.prototype.signIn = function() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(()=>{
    this.startFunctionsCookieRequest(afterSignIn)   
  });
};
function afterSignIn(){
  var req = new XMLHttpRequest();
      req.open('POST', '/', true);
      req.send();
}
// Signs-out of Firebase.
Demo.prototype.signOut = function() {
  firebase.auth().signOut();
  // clear the __session cookie
  document.cookie = 'session=';
  console.log("signed out")
  window.location = "/"
};

// Does an authenticated request to a Firebase Functions endpoint using a __session cookie.
Demo.prototype.startFunctionsCookieRequest = function(callback) {
  firebase.auth().currentUser.getIdToken(true).then(function(token) {
    // set the __session cookie
    console.log("cookie set");
    document.cookie = 'session=' + token + ';max-age=3600';
    callback();
  }.bind(this));
};


window.demo = new Demo();
