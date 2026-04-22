import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import your screen components
import SignupScreen from "./SignupScreen";
import LoginScreen from "./LoginScreen";
import NavigationBar from "./navigation_bar";

// Create a Stack Navigator instance
const Stack = createStackNavigator();

// Main authentication stack component
export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={NavigationBar} />
    </Stack.Navigator>
  );
}