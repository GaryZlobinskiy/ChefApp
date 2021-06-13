import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from "../context/UserContext";
import firebase from 'firebase';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const firebaseNew = useContext(FirebaseContext);
    const [u, setUser] = useContext(UserContext);

    const signUp = async () => {
        const user = {username, email, password};

        try {
            if (username === '') {
                alert('Please enter a username.')
            } else {
                if (username.length > 30) {
                    alert("Your username is too long. Please keep it under 30 characters.");
                } else {
                    try {
                        const createdUser = await firebaseNew.createUser(user);
                        if (createdUser !== undefined) {
                            setUser({ ...createdUser, isLoggedIn: true });
                        }
                    } catch (err) {
                        console.log("Error at signUp: ", err);
                    }
                }
            }
        } catch (err) {
            return;
        }
    };

    return (
        <ScrollView style={{backgroundColor: '#f9f9f9'}}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate("SignIn")}>
                <Ionicons name="arrow-back" size={30} color="#39a6a3" />
            </TouchableOpacity>
            <View style={styles.container}>
                <StatusBar translucent barStyle="dark-content" />
                <Text style={styles.title}>Create an Account</Text>
                <View style={styles.spaceView} />
                <View style={styles.inputView}>
                    <Ionicons style={{color:"#bf1363"}} name="person" size={25} color="black" />
                    <TextInput
                        style={styles.input}
                        label="Username"
                        value={username}
                        onChangeText={(newUsername) => setUsername(newUsername)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Username"
                    />
                </View>
                <View style={styles.spaceView} />
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
                <TouchableOpacity style={styles.signInButton} onPress={() => signUp()}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                    <AntDesign name="arrowright" size={35} color="#deeeea" />
                </TouchableOpacity>
                <View style={styles.bottomPart}>
                    <Text style={styles.bottomRegularText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                        <Text style={styles.bottomLinkText}>Sign In</Text>
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
        fontSize: 30,
        fontWeight: "800",
        fontFamily: "Avenir",
        marginTop: 85,
        color: "#39a6a3",
        marginBottom: 10
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
        marginTop: 190,
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
    },
    goBackButton: {
        marginTop: 60,
        marginLeft: 30,
        width: 46,
        height: 46,
        borderRadius: 23
    }
});

export default SignUpScreen;
