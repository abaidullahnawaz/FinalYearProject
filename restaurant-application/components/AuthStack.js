import React from "react";
// This allows us to move between different screens
import { createStackNavigator } from "@react-navigation/stack";

// Import your screen components
import SignupScreen from "./SignupScreen";
import LoginScreen from "./LoginScreen";
import NavigationBar from "./navigation_bar";

// Create an instance of the Stack Navigator to navigate the flow between the screens
const Stack = createStackNavigator();

// Main authentication stack component
//Stack.Navigator wraps all the screens and defines naviagtion behaviour
export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={NavigationBar} />
    </Stack.Navigator>
  );
}