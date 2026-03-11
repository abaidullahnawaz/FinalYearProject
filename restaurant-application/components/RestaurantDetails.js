// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { imageMap } from "./imageMap";

// const screenWidth = Dimensions.get("window").width;
// const cardWidth = screenWidth / 2 - 20;


//   export default function RestaurantDetails({ route }) {
//   const { restaurant } = route.params;

//   const renderMeal = ({ item }) => (
//     <View style={styles.mealCard}>
//       <Image source={imageMap[item.image]} style={styles.mealImage} />
//       <Text style={styles.mealName}>{item.mealName}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>

//       <Image source={imageMap[restaurant.image]} style={styles.banner} />

//       <Text style={styles.name}>{restaurant.restaurantName}</Text>
//       <Text style={styles.location}>{restaurant.location}</Text>
//       <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
//       <Text style={styles.description}>{restaurant.description}</Text>

//       <Text style={styles.menuTitle}>Menu</Text>

//       <FlatList
//         data={restaurant.meals}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderMeal}
//         numColumns={2}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 15,
//   },

//   banner: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//   },

//   name: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginTop: 10,
//   },

//   location: {
//     color: "#777",
//   },

//   rating: {
//     marginTop: 5,
//   },

//   description: {
//     marginTop: 10,
//     color: "#444",
//   },

//   menuTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 20,
//     marginBottom: 10,
//   },

//   mealCard: {
//     width: cardWidth,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 10,
//     margin: 5,
//     overflow: "hidden",
//   },

//   mealImage: {
//     width: "100%",
//     height: 120,
//   },

//   mealName: {
//     padding: 10,
//     fontWeight: "600",
//   },

// });






import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { imageMap } from "./imageMap";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 20;

export default function RestaurantDetails({ route }) {
  const navigation = useNavigation();
  const { restaurant } = route.params;

  const renderMeal = ({ item }) => (
    <View style={styles.mealCard}>
      <Image source={imageMap[item.image]} style={styles.mealImage} />
      <Text style={styles.mealName}>{item.mealName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

  <FlatList
  data={restaurant.meals}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderMeal}
  numColumns={2}
  ListHeaderComponent={
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Image source={imageMap[restaurant.image]} style={styles.banner} />

      <Text style={styles.name}>{restaurant.restaurantName}</Text>
      <Text style={styles.location}>{restaurant.location}</Text>
      <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>

      <Text style={styles.menuTitle}>Menu</Text>
    </>
  }
  contentContainerStyle={{
    padding: 15,
    paddingBottom: 100,
  }}
/>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
  flex: 1,
  backgroundColor: "#fff",
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

  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  mealCard: {
    width: cardWidth,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    margin: 5,
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