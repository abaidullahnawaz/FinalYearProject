import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { imageMap } from "./imageMap"; //image mapping

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 20;

export default function RestaurantDetails({ route }) {
  const navigation = useNavigation(); //navigation going back n forth
  const { restaurant } = route.params; //get restaurant data passed from previous screen

  return (
    // ScrollView allows vertical scrolling if the content is large
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Image source={imageMap[restaurant.image]} style={styles.banner} />

      {/* Restaurant Info */}
      <Text style={styles.name}>{restaurant.restaurantName}</Text>
      <Text style={styles.location}>{restaurant.location}</Text>
      <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>

      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => navigation.navigate("ReviewPage", { restaurant })}
      >
        <Text style={styles.reviewButtonText}>Add a Review</Text>
      </TouchableOpacity>

      <Text style={styles.menuTitle}>Menu</Text>

      <View style={styles.mealsContainer}>
        {restaurant.meals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <Image source={imageMap[meal.image]} style={styles.mealImage} />
            <Text style={styles.mealName}>{meal.mealName}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    padding: 15,
    paddingBottom: 900,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  backButton: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9E090F",
  },

  banner: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  location: {
    color: "#777",
  },

  rating: {
    marginTop: 5,
  },

  description: {
    marginTop: 10,
    color: "#444",
  },

  /* CTA Button */
  reviewButton: {
    marginTop: 15,
    backgroundColor: "#9E090F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  reviewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  mealsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,

  },

  mealCard: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },

  mealImage: {
    width: "100%",
    height: 120,
  },

  mealName: {
    padding: 10,
    fontWeight: "600",
  },
});