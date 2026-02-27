import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

export default function TopBanner() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.banner}>
        <Image
          source={require("../assets/App_Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>TrustBite</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#9E090F",
  },
  banner: {
    width: "100%",
    height: 50,
    backgroundColor: "#9E090F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});