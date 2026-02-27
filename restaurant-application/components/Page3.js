import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TopBanner from "./Top_Banner";


export default function Page3() {
  return (
    <View style={styles.container}>
    <TopBanner/>
      <Text style={styles.text}>⭐ Profile / Favourites Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
});