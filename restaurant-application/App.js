import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "./components/splashscreen";
import AuthStack from "./components/AuthStack";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    setTimeout(async () => {
      const loggedIn = await AsyncStorage.getItem("loggedIn");
      setIsLoading(false);
    }, 2000);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}