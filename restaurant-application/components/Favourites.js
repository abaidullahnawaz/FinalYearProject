import React, { useState, useEffect, useCallback  } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";

import TopBanner from "./Top_Banner"; // Import custom top banner component
import { imageMap } from "./imageMap"; //Loads images from the objects
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Favourites() {
const [favourites, setFavourites] = useState([]); //state to store the favourite restaurant

// gets the favourited restaurants and sets favourites if icon clicked on
//getItem gets the currentUser's favourites and displays them
useFocusEffect(
  useCallback(() => {
    const loadFavourites = async () => {
      const currentUser = await AsyncStorage.getItem("currentUser");
      const user = currentUser ? JSON.parse(currentUser) : null;

      //If no user is logged in, clear the favourites
      if (!user) {
        setFavourites([]);
        return;
      }

    /*Retrieves the favourites of the current logged in user since each user as its own separate favourites list*/ 
      const stored = await AsyncStorage.getItem(`FAVOURITES_${user.email}`);

      /*If favourites exitst in the storage, parse and set them in a state variable*/
      if (stored) {
        setFavourites(JSON.parse(stored));
      } else {
        /*if no favourites found then set an empty list*/
        setFavourites([]);
      }
    };
    /*Call the function to load favourites*/
    loadFavourites();
  }, [])
);

  return (
    <View style={styles.container}>
      <TopBanner />
      /*Screen heading*/
      <Text style={styles.heading}>Favourites</Text>
      // If no favourites added
      {favourites.length === 0 ? (
        <Text style={styles.text}>No favourites added ❤️</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id.toString()} // Unique key for each item in the Flat list
          /*Defines how each restaurant name is to be displayed on the screen*/
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={imageMap[item.image]} style={styles.image} />
              <Text style={styles.name}>{item.restaurantName}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    color: "#222",
  },

  text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
    color: "#555",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    padding: 10,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // Android shadow
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },

  rating: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },

  category: {
    fontSize: 13,
    marginTop: 2,
    color: "#777",
  },
});