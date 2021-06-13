import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { UserContext } from "../context/UserContext";
import { FirebaseContext } from "../context/FirebaseContext";

const LoadingScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        setTimeout(async () => {
            const user = firebase.getCurrentUser();

            if (user != undefined) {
                const userInfo = await firebase.getUserInfo(user.uid);
                await setUser({
                    isLoggedIn: true,
                    email: userInfo.email,
                    uid: user.uid,
                    posts: userInfo.posts
                });
            } else {
                setUser((state) => ({ ...state, isLoggedIn: false }));
            }
        }, 1000);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>Chuber</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 80,
        fontWeight: "800",
        fontFamily: "Avenir",
        color: "#39a6a3"
    }
});

export default LoadingScreen;
