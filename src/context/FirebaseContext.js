import React from 'react';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import config from '../config/firebase';
import { Linking } from "react-native";
import qs from 'qs';

const FirebaseContext = React.createContext();

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const db = firebase.firestore();
const batch = db.batch();

const Firebase = {
    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },
    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            await db.collection("users").doc(uid).set({
                username: user.username,
                email: user.email,
                posts: []
            });

            delete user.password;

            return { ...user, uid };
        } catch (err) {
            alert(err.message);
        }
    },
    createPost: async (post) => {
        try {
            const uid = Firebase.getCurrentUser().uid;

            const newPost = await db.collection("allPosts").add({
                postTitle: post.title,
                postDescription: post.description,
                userId: uid,
                payment: post.payment,
                timePosted: post.time
            });

            await db.collection("users").doc(uid).update({
                posts: firebase.firestore.FieldValue.arrayUnion(newPost._delegate._key.path.segments[1])
            });

            alert("Post created. An email will be sent to you when it is fullfilled.")
        } catch (err) {
            alert(err.message);
        }
    },
    remove: async (post) => {
      const user = await Firebase.getCurrentUser();
      const userInfo = await Firebase.getUserInfo(user.uid);
      await db.collection('allPosts')
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc._delegate._document.data.value.mapValue.fields.timePosted.integerValue === ("" + post.timePosted)) {
              const postId = doc._delegate._document.key.path.segments[6];
              db.collection('allPosts').doc(postId).delete();
              db.collection('users').doc(user.uid).update({
                posts: firebase.firestore.FieldValue.arrayRemove(postId)
              });
              alert('Post was successfully deleted.');
            }
          })
        });
    },
    fulfill: async (post) => {
      const otherUser = await db.collection("users").doc(post.userId).get();
      const user = Firebase.getCurrentUser();
      let url = `mailto:${otherUser._delegate._document.data.value.mapValue.fields.email.stringValue}`;
      const query = qs.stringify({
        subject: 'Your post for "' + post.postTitle + '" was fulfilled!',
        body: "Please contact " + user.email + " to discuss more about your order and details on how to fulfill it."
      });
      if (query.length) {
        url += `?${query}`;
      }
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        console.log("Error sending email. Please try again another time.");
      };
      Linking.openURL(url);

      await db.collection('allPosts')
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc._delegate._document.data.value.mapValue.fields.timePosted.integerValue === ("" + post.timePosted)) {
              const postId = doc._delegate._document.key.path.segments[6];
              db.collection('allPosts').doc(postId).delete();
              db.collection('users').doc(post.userId).update({
                posts: firebase.firestore.FieldValue.arrayRemove(postId)
              });
              alert('Post was successfully fulfilled! Await an email from ' + otherUser._delegate._document.data.value.mapValue.fields.username.stringValue + ' to fulfill the order.');
            }
          })
        });
    },
    getUserInfo: async (uid) => {
        try {
            const user = await db.collection("users").doc(uid).get();

            if (user.exists) {
                return user.data();
            }
        } catch (err) {
            console.log("Error getting user info", err);
        }
    },
    signOut: async () => {
        try {
            await firebase.auth().signOut();

            return true;
        } catch (err) {
            console.log("Error signing out.", err);
        }
        return false;
    },
    signIn: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }
};

const FirebaseProvider = (props) => {
    return (
        <FirebaseContext.Provider value={Firebase}>
            {props.children}
        </FirebaseContext.Provider>
    );
}

export { FirebaseContext, FirebaseProvider };
