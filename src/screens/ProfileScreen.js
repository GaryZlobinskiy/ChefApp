import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { UserContext } from "../context/UserContext";
import { FirebaseContext } from "../context/FirebaseContext";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import firebase from 'firebase';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useContext(UserContext);
    const firebase2 = useContext(FirebaseContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setTimeout(async () => {
            const user = firebase2.getCurrentUser();
            const userInfo = await firebase2.getUserInfo(user.uid);
            await setUser({
                isLoggedIn: true,
                email: userInfo.email,
                uid: user.uid,
                posts: userInfo.posts,
                username: userInfo.username
            });
        }, 100);
        getPosts();
    }, []);

    const getPosts = async () => {
        var tempList = [];
        await firebase.firestore().collection('allPosts')
          .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {;
              if (doc.data().userId === firebase.auth().currentUser.uid) {
                tempList.push({
                  payment: doc.data().payment,
                  postDescription: doc.data().postDescription,
                  postTitle: doc.data().postTitle,
                  userId: doc.data().userId,
                  timePosted: doc.data().timePosted
                });
              }
            })
          });
        setPosts(tempList.sort((a, b) => (a.timePosted < b.timePosted) ? 1 : -1));
    }

    getPosts();

    const signOut = async () => {
        const signedOut = await firebase2.signOut();

        if (signedOut) {
            setUser(state => ({ ...state, isLoggedIn: false }));
        }
    };

    return (
        <View>
            <View style={styles.header}>
              <Text style={styles.userNameText}>{user.username}</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.subHeadText}>Your Posts</Text>
                <View style={styles.line} />
                <View style={{height: 20}}></View>
                <FlatList
                style={styles.list}
                    data={posts}
                    renderItem={({ item }) => (
                      <View style={styles.listItem}>
                          <View style={styles.textBody}>
                              <Text style={styles.username}>{item.postTitle}</Text>
                              <Text style={styles.subText}>{item.postDescription}</Text>
                              <Text style={styles.subSubText}>{item.payment}</Text>
                          </View>
                          <View style={styles.delBody}>
                              <TouchableOpacity onPress={() => firebase2.remove(item)}>
                                  <AntDesign color="#bf1363" size={24} name="delete" />
                              </TouchableOpacity>
                          </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.timePosted}
                />
                <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    list: {
      height: 450
    },
    delBody: {
      width: 30
    },
    buttonText: {
        fontSize: 22,
        color: '#deeeea',
        fontFamily: 'Avenir',
        paddingRight: 6,
        fontWeight: "600"
    },
    signOutButton: {
        flexDirection: 'row',
        shadowColor: 'gray',
        shadowOffset: {width: 5, height: 8},
        shadowOpacity: 0.1,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 60,
        marginTop: 15,
        backgroundColor: '#39a6a3',
        alignSelf: 'center'
    },
    userNameText: {
        fontSize: 30,
        fontFamily: "Avenir",
        fontWeight: "800",
        marginLeft: 30,
        marginRight: 30,
        textAlign: 'center',
        color: '#231e23',
        marginTop: 20
    },
    listItem: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {width: 3, height: 3}
    },
    username: {
        fontSize: 23,
        fontFamily: "Avenir",
        paddingBottom: 3,
        fontWeight: 'bold',
        color: '#231e23'
    },
    subText: {
        fontSize: 17,
        fontFamily: "Avenir",
        color: '#231e23'
    },
    subSubText: {
        fontSize: 15,
        fontFamily: "Avenir",
        color: '#bf1363',
        marginTop: 5
    },
    textBody: {
        flex: 1,
        justifyContent: 'center'
    },
    header: {
      marginTop: 40
    },
    subHeadText: {
      fontSize: 20,
      fontFamily: "Avenir",
      color: '#231e23',
      alignSelf: 'center',
      fontWeight: '500',
      marginTop: 6
    }
});

export default ProfileScreen;
