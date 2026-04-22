import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Page3({ navigation }) {
  // store logged in user
  const [user, setUser] = useState(null);
  // Stores the users reviews
  const [reviews, setReviews] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

// Load user and reviews from storage
  const loadData = async () => {
    try {
      // Get current logged in user
      const currentUser = await AsyncStorage.getItem("currentUser");
      const parsedUser = currentUser ? JSON.parse(currentUser) : null;

      setUser(parsedUser);

      // get all reviews
      const storedReviews = await AsyncStorage.getItem("reviews");
      const allReviews = storedReviews ? JSON.parse(storedReviews) : [];

      if (!parsedUser?.email) {
        setReviews([]);
        return;
      }

    // Filter only this users reviews
      const userReviews = allReviews.filter(
        (r) => r.email === parsedUser.email
      );

      setReviews(userReviews);
    } catch (err) {
      console.log("Profile load error:", err);
    }
  };

// logout function
  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedIn");
    await AsyncStorage.removeItem("currentUser");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.userCard}>
        <Text style={styles.welcome}>👋</Text>
        <Text style={styles.name}>{user?.name || "Welcome"}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Reviews</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.restaurant}>
              🍽 {item.restaurant}
            </Text>

            <Text style={styles.reviewText}>
              "{item.review}"
            </Text>

            
          </View>
        )}
      />

      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9E090F",
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  userCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  welcome: {
    fontSize: 16,
    color: "#777",
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9E090F",
    marginTop: 5,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5
  },

  reviewCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  restaurant: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 5,
    color: "#333",
  },

  reviewText: {
    fontStyle: "italic",
    color: "#444",
    marginBottom: 8,
    lineHeight: 18,
  },

  rating: {
    color: "#9E090F",
    fontWeight: "bold",
  },

  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },

  button: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#9E090F",
    fontWeight: "bold",
    fontSize: 16,
  },
});