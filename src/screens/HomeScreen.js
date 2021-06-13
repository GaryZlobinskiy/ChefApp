import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Entypo, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from "../context/UserContext";
import { FirebaseContext } from "../context/FirebaseContext";
import firebase from 'firebase';

const HomeScreen = () => {
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
                posts: userInfo.posts
            });
        }, 100);
        getPosts();
    }, []);

    const getPosts = async () => {
        var tempList = [];
        await firebase.firestore().collection('allPosts')
          .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              tempList.push({
                payment: doc.data().payment,
                postDescription: doc.data().postDescription,
                postTitle: doc.data().postTitle,
                userId: doc.data().userId,
                timePosted: doc.data().timePosted
              });
            })
          });
        setPosts(tempList.sort((a, b) => (a.timePosted < b.timePosted) ? 1 : -1));
    }

    getPosts();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Local Food Posts</Text>
            </View>
            <StatusBar translucent barStyle="dark-content" />
            <View style={{height: 20}}></View>
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <View style={styles.textBody}>
                        <Text style={styles.username}>{item.postTitle}</Text>
                        <Text style={styles.subText}>{item.postDescription}</Text>
                        <Text style={styles.subSubText}>{item.payment}</Text>
                    </View>
                    <TouchableOpacity style={styles.fulfillSection} onPress={() => firebase2.fulfill(item)}>
                        <FontAwesome5 name="check-circle" size="30" color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.timePosted}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 30,
        fontWeight: "800",
        fontFamily: "Avenir",
        color: "#deeeea",
        marginTop: 60,
        marginBottom: 20
    },
    fulfillSection: {
      margin: 10,
      backgroundColor: "#bf1363",
      height: "90%",
      width: "20%",
      borderRadius: 15,
      alignItems: 'center',
      paddingTop: 21
    },
    header: {
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: "#39a6a3"
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
    }
});

export default HomeScreen;
