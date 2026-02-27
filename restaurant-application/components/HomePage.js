import React, { useState, useMemo } from "react";
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
import restaurants from "./restaurant.json";
import { imageMap } from "./imageMap";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 20;

export default function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ✅ Get Unique Categories */
  const categories = useMemo(() => {
    const unique = [...new Set(restaurants.map((r) => r.category))];
    return ["All", ...unique];
  }, []);

  /* ✅ Filtered Data (Search + Category) */
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.restaurantName
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        restaurant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={imageMap[item.image]} style={styles.image} />
      <Text style={styles.name}>{item.restaurantName}</Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBanner />

      {/* 🔎 Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search restaurants..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* ✅ Filter Tags */}
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

      {/* 🍽 Restaurant List */}
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

  /* Search */
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

  

  /* Cards */
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
   /* Filters */
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
});