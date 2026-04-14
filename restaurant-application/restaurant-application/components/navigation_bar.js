import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, StyleSheet } from "react-native";

import Page1 from "./HomePage";
import ReviewPage from "./ReviewPage";
import Favourites from "./Favourites";
import RestaurantDetails from "./RestaurantDetails";
import Profile from "./Profile"

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* Bottom Tab Navigator */
function TabNavigator() {
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
              source={require("../assets/home.png")}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={ReviewPage}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/add.png")}
              style={{ width: 23, height: 23, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favourites"
        component={Favourites}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/heart.png")}
              style={{ width: 22, height: 21, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/profile_icon_unselected.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* Stack Navigator */
export default function NavigationBar() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
      <Stack.Screen name="ReviewPage" component={ReviewPage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 5,
    right: 5,
    backgroundColor: "#9E090F",
    borderRadius: 37,
    height: 50,
  },
});

