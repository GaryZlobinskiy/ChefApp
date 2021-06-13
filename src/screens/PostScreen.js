import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from "../context/UserContext";
import firebase from 'firebase';

const PostScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [payment, setPayment] = useState('');
    const firebaseNew = useContext(FirebaseContext);
    const [u, setUser] = useContext(UserContext);

    const createPost = async () => {
        const uid = firebaseNew.getCurrentUser().uid;
        const post = {
            'title': title,
            'description': description.replace(/\n/g, " "),
            'time': Date.now(),
            'payment': "$" + payment
        };

        try {
            if (title === '') {
                alert('Please enter a title.')
            } else {
                try {
                    await firebaseNew.createPost(post);
                    setTitle("");
                    setDescription("");
                    setPayment("");
                    navigation.navigate("Home");
                } catch (err) {
                    console.log("Error at signUp: ", err);
                }
            }
        } catch (err) {
            return;
        }
    };

    return (
        <ScrollView style={{backgroundColor: '#f9f9f9'}}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="#39a6a3" />
            </TouchableOpacity>
            <View style={styles.container}>
                <StatusBar translucent barStyle="dark-content" />
                <Text style={styles.title}>Create a Post</Text>
                <View style={styles.spaceView} />
                <View style={styles.inputView}>
                    <MaterialCommunityIcons style={{color:"#bf1363"}} name="chef-hat" size={25} color="black" />
                    <TextInput
                        style={styles.input}
                        label="Title"
                        value={title}
                        onChangeText={(newTitle) => setTitle(newTitle)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Title"
                    />
                </View>
                <View style={styles.spaceView} />
                <View style={styles.descInputView}>
                    <MaterialIcons style={{color:"#bf1363", marginBottom: 105 }} name="subtitles" size={25} color="black" />
                    <TextInput
                        style={styles.descInput}
                        label="Description"
                        value={description}
                        onChangeText={(newDescription) => setDescription(newDescription)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Date, Time, Food Description"
                        multiline={true}
                        numberOfLines={3}
                    />
                </View>
                <View style={styles.spaceView} />
                <View style={styles.inputView}>
                    <MaterialIcons style={{color:"#bf1363"}} name="attach-money" size={28} color="black" />
                    <TextInput
                        style={styles.input}
                        label="Payment"
                        value={payment}
                        onChangeText={(newPayment) => setPayment(newPayment)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Payment"
                    />
                </View>
                <TouchableOpacity style={styles.signInButton} onPress={() => createPost()}>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
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
        marginTop: 35,
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
    descInput: {
        height: 150,
        width: 250,
        paddingLeft: 10,
        fontFamily: "Avenir",
        fontSize: 18,
        paddingTop: 10
    },
    descInputView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
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
    goBackButton: {
        marginTop: 60,
        marginLeft: 30,
        width: 46,
        height: 46,
        borderRadius: 23
    }
});

export default PostScreen;
