import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";

import Page1 from "./HomePage";
import Page2 from "./Page2";
import Page3 from "./Page3";

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#f5c6c6",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Page1}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/home.png")} // Dummy icon
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Page2}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/add.png")} // Dummy icon
              style={{ width: 23, height: 23, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={Page3}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/heart.png")} // Dummy icon
              style={{ width: 23, height: 23, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 5,
    right: 5,
    // elevation: 10,
    backgroundColor: "#9E090F",
    borderRadius: 37,
    height: 50,
    // paddingBottom: 10,
    
  },
});