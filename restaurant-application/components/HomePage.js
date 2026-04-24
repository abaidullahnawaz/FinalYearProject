import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TopBanner from "./Top_Banner";
import restaurants from "./restaurant.json"; //Restaurant Data
import { imageMap } from "./imageMap"; //Images of restaurants

// Navigation hooks
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

// Local Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get screen width for responsive card sizing
const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 20; //Each card takes up half of the screen

export default function HomePage() {
  // Search input state
  const [searchText, setSearchText] = useState("");
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Favourite restaurants state
  const [favourites, setFavourites] = useState([]);
// Navigation object to transition between screens
  const navigation = useNavigation();

// Generates unique categories from restaurant data
// Example: 'All', 'Fast Food'...
// ... are the spread operator that converts the set back into a normal array
//new Set removes all duplicates if any
// ...unique takes all values in unique and inserts them into a new array
  const categories = useMemo(() => {
    const unique = [...new Set(restaurants.map((r) => r.category))];
    return ["All", ...unique];
  }, []);

// Filters the restaurants in terms of categories
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.restaurantName
        .toLowerCase()
        .includes(searchText.toLowerCase());

// Matches the selected categories
// If the selected category is equal to the restaurant category then it dis[plays those restaurant names
      const matchesCategory =
        selectedCategory === "All" ||
        restaurant.category === selectedCategory;

// Returns items with both conditions
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);


// Loads the page with the favourites selected from last time
  useFocusEffect(
  useCallback(() => {
    const loadFavourites = async () => {
      const currentUser = await AsyncStorage.getItem("currentUser");
      const user = currentUser ? JSON.parse(currentUser) : null;

    // If no user, clear favourites
      if (!user) {
        setFavourites([]);
        return;
      }

    // Fetch favourites specific to the user
      const stored = await AsyncStorage.getItem(`FAVOURITES_${user.email}`);
    // Update states if favourites exist
      if (stored) {
        setFavourites(JSON.parse(stored));
      } else {
        setFavourites([]);
      }
    };

    loadFavourites();
  }, [])
);

// add or remove a restaurant from favourites
const toggleFavourite = async (item) => {
  const currentUser = await AsyncStorage.getItem("currentUser");
  const user = currentUser ? JSON.parse(currentUser) : null;

  if (!user) return;

  // Check if restaurant is already in the favourites
  setFavourites((prevFavourites) => {
    const exists = prevFavourites.find((r) => r.id === item.id);

    let updated;

    if (exists) {
      updated = prevFavourites.filter((r) => r.id !== item.id);
    } else {
      updated = [...prevFavourites, item];
    }

    // Save using updated state
    AsyncStorage.setItem(
      `FAVOURITES_${user.email}`,
      JSON.stringify(updated)
    );

    return updated;
  });
};

// check if a restaurant is already marked as favourite
const isFavourite = (id) => {
  return favourites.some((r) => r.id === id);
};

// Render each restaurant card in a grid
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("RestaurantDetails", { restaurant: item })
      }
    >
      {/* Heart Icon */}
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering parent onPress
          toggleFavourite(item);
        }}
      >
        <Text style={{ fontSize: 18 }}>
         {/* Filled heart if favourite, otherwise outline */}
          {isFavourite(item.id) ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>

      {/* Restaurant image */}
      <Image source={imageMap[item.image]} style={styles.image} />
      <Text style={styles.name}>{item.restaurantName}</Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBanner />

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search restaurants..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.filterTag,
                selectedCategory === category && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.activeFilterText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  searchContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    elevation: 2,
  },

  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 120,
  },

  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 120,
  },

  name: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingTop: 5,
  },

  rating: {
    fontSize: 12,
    paddingHorizontal: 5,
    color: "#555",
  },

  category: {
    fontSize: 11,
    paddingHorizontal: 5,
    paddingBottom: 8,
    color: "#888",
  },

  filtersContainer: {
    marginTop: 15,
    marginBottom: 10,
    paddingLeft: 15,
  },

  filterTag: {
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  filterText: {
    fontSize: 12,
    color: "#555",
  },

  activeFilter: {
    backgroundColor: "#9E090F",
  },

  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
  },

  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
});