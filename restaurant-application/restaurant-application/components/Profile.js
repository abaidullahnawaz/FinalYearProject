import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Page3({ navigation }) {

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedIn");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9E090F",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#9E090F",
    fontWeight: "bold",
  },
});