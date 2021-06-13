import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from "../screens/HomeScreen";
import PostScreen from "../screens/PostScreen";
import ProfileScreen from "../screens/ProfileScreen";

const MainStackScreens = () => {
    const MainStack = createBottomTabNavigator();

    const tabBarOptions = {
        showLabel: false,
        style: {
            backgroundColor: "#39a6a3",
            paddingBottom: 12
        }
    };

    const screenOptions =(({ route }) => ({
        tabBarIcon: ({ focused }) => {
            let iconName = "ios-home";

            switch (route.name) {
                case "Home":
                    iconName = "ios-home";
                    break;

                case "Profile":
                    iconName = "ios-person";
                    break;

                default:
                    iconName = "ios-home";
            }

            if (route.name === "Post") {
                return (
                    <Ionicons name="ios-add-circle" size={60} color="#bf1363" style={{ shadowColor: '#deeeea', shadowOpacity: 0.7, shadowRadius: 10, width: 54 }} />
                );
            }

            return (
                <Ionicons name={iconName} size={26} color={focused ? "#ffffff" : "#deeeea"} />
            )
        }
    }));

    return (
        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
            <MainStack.Screen name="Home" component={ HomeScreen } />
            <MainStack.Screen name="Post" component={ PostScreen } />
            <MainStack.Screen name="Profile" component={ ProfileScreen } />
        </MainStack.Navigator>
    );
};

export default MainStackScreens;
