import React from "react";
import { View, Text, StyleSheet, ActivityIndicator,Image } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/App_Logo.png')} style={styles.image} />
      <Text style={styles.title}>TrustBite</Text>
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
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});