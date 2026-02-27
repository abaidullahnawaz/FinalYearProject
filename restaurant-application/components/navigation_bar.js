import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Image } from "react-native";

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
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/nav/home.png")} // dummy icon
              style={[
                styles.home_icon,
                { tintColor: focused ? "#fff" : "#f5c6c6" },
              ]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={Page2}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/nav/add.png")} // dummy icon
              style={[
                styles.add_icon,
                { tintColor: focused ? "#fff" : "#f5c6c6" },
              ]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favourites"
        component={Page3}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/nav/heart.png")} // dummy icon
              style={[
                styles.heart_icon,
                { tintColor: focused ? "#fff" : "#f5c6c6" },
              ]}
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
    left: 20,
    right: 20,
    elevation: 10,
    backgroundColor: "#9E090F",
    borderRadius: 37,
    height: 50,
  },
  home_icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    paddingBottom: 15,
  },
  add_icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  heart_icon: {
    width: 23,
    height: 23,
    resizeMode: "contain",
  },
});