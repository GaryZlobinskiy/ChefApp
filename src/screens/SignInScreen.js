import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { FirebaseContext } from "../context/FirebaseContext";
import { UserContext } from "../context/UserContext";

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const firebase = useContext(FirebaseContext);
    const [u, setUser] = useContext(UserContext);

    const signIn = async () => {
        try {
            await firebase.signIn(email, password);

            const uid = firebase.getCurrentUser().uid;

            const userInfo = await firebase.getUserInfo(uid);

            setUser({
                username: userInfo.username,
                email: userInfo.email,
                uid,
                posts: userInfo.posts,
                isLoggedIn: true
            });
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <ScrollView style={{backgroundColor: '#f9f9f9'}}>
            <View style={styles.container}>
                <StatusBar translucent barStyle="dark-content" />
                <Text style={styles.title}>Chuber</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>
                <View style={styles.inputView}>
                    <MaterialIcons style={{color:"#bf1363"}} name="email" size={25} color="black" />
                    <TextInput
                        style={styles.input}
                        label="Email"
                        value={email}
                        onChangeText={(newEmail) => setEmail(newEmail)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Email"
                        autoCompleteType="email"
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.spaceView} />
                <View style={styles.inputView}>
                    <Entypo style={{color:"#bf1363"}} name="lock" size={24} color="black" />
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        label="Password"
                        value={password}
                        onChangeText={(newPassword) => setPassword(newPassword)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Password"
                        autoCompleteType="password"
                    />
                </View>
                <TouchableOpacity style={styles.signInButton} onPress={() => signIn()}>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <AntDesign name="arrowright" size={35} color="#deeeea" />
                </TouchableOpacity>
                <View style={styles.bottomPart}>
                    <Text style={styles.bottomRegularText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={styles.bottomLinkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
        marginTop: 150,
        color: "#39a6a3"
    },
    subtitle: {
        fontSize: 20,
        color: "#bf1363",
        fontWeight: "800",
        marginTop: -12,
        marginBottom: 50,
        fontFamily: "Avenir",
        opacity: 0.8
    },
    input: {
        height: 45,
        width: 250,
        paddingLeft: 10,
        fontFamily: "Avenir",
        fontSize: 18
    },
    inputView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        paddingLeft: 10,
        paddingRight: 20,
        shadowColor: 'gray',
        shadowOffset: {width: 5, height: 8},
        shadowOpacity: 0.1,
        backgroundColor: "#ffffff"
    },
    spaceView: {
        margin: 10
    },
    signInButton: {
        flexDirection: 'row',
        shadowColor: 'gray',
        shadowOffset: {width: 5, height: 8},
        shadowOpacity: 0.1,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginLeft: 130,
        width: 150,
        height: 60,
        backgroundColor: '#39a6a3'
    },
    buttonText: {
        fontSize: 22,
        color: '#deeeea',
        fontFamily: 'Avenir',
        paddingRight: 6,
        fontWeight: "600"
    },
    bottomPart: {
        marginTop: 160,
        flexDirection: 'row',
    },
    bottomRegularText: {
        fontSize: 16,
        paddingRight: 7,
        opacity: 0.23
    },
    bottomLinkText: {
        fontSize: 16,
        color: '#bf1363'
    }
});

export default SignInScreen;
