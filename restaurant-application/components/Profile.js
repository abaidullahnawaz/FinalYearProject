
// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function Page3({ navigation }) {
//   const [user, setUser] = useState(null);
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const currentUser = await AsyncStorage.getItem("currentUser");
//       const parsedUser = currentUser ? JSON.parse(currentUser) : null;

//       setUser(parsedUser);

//       const storedReviews = await AsyncStorage.getItem("reviews");
//       const allReviews = storedReviews ? JSON.parse(storedReviews) : [];

//       const userReviews = allReviews.filter(
//         (r) => r.email === parsedUser?.email
//       );

//       setReviews(userReviews);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("loggedIn");
//     await AsyncStorage.removeItem("currentUser");
//     navigation.replace("Login");
//   };

//   return (
//     <View style={styles.container}>

//       {/* HEADER */}
//       <Text style={styles.title}>Profile</Text>

//       {/* USER NAME CARD */}
//       <View style={styles.userCard}>
//         <Text style={styles.welcome}>👋 Welcome</Text>
//         <Text style={styles.name}>{user?.name || "User"}</Text>
//       </View>

//       {/* REVIEWS SECTION */}
//       <Text style={styles.sectionTitle}>Your Reviews</Text>

//       <FlatList
//         data={reviews}
//         keyExtractor={(item, index) => index.toString()}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No reviews yet</Text>
//         }
//         renderItem={({ item }) => (
//           <View style={styles.reviewCard}>

//             <Text style={styles.restaurant}>
//               🍽 {item.restaurant}
//             </Text>

//             <Text style={styles.reviewText}>
//               "{item.review}"
//             </Text>

//             <Text style={styles.rating}>
//               ⭐ Rating: {item.rating}
//             </Text>

//           </View>
//         )}
//       />

//       {/* LOGOUT */}
//       <TouchableOpacity style={styles.button} onPress={handleLogout}>
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>

//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#9E090F",
//     padding: 20,
//   },

//   title: {
//     color: "#fff",
//     fontSize: 26,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },

//   userCard: {
//     backgroundColor: "#fff",
//     padding: 18,
//     borderRadius: 15,
//     alignItems: "center",
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   welcome: {
//     fontSize: 16,
//     color: "#777",
//   },

//   name: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#9E090F",
//     marginTop: 5,
//   },

//   sectionTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },

//   reviewCard: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },

//   restaurant: {
//     fontWeight: "bold",
//     fontSize: 15,
//     marginBottom: 5,
//     color: "#333",
//   },

//   reviewText: {
//     fontStyle: "italic",
//     color: "#444",
//     marginBottom: 8,
//     lineHeight: 18,
//   },

//   rating: {
//     color: "#9E090F",
//     fontWeight: "bold",
//   },

//   emptyText: {
//     color: "#fff",
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 14,
//   },

//   button: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 20,
//     alignItems: "center",
//   },

//   buttonText: {
//     color: "#9E090F",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });


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
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  // ✅ FIXED: runs every time you open Profile tab
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      const parsedUser = currentUser ? JSON.parse(currentUser) : null;

      setUser(parsedUser);

      const storedReviews = await AsyncStorage.getItem("reviews");
      const allReviews = storedReviews ? JSON.parse(storedReviews) : [];

      if (!parsedUser?.email) {
        setReviews([]);
        return;
      }

      const userReviews = allReviews.filter(
        (r) => r.email === parsedUser.email
      );

      setReviews(userReviews);
    } catch (err) {
      console.log("Profile load error:", err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedIn");
    await AsyncStorage.removeItem("currentUser");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.userCard}>
        <Text style={styles.welcome}>👋 Welcome</Text>
        <Text style={styles.name}>{user?.name || "User"}</Text>
      </View>

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