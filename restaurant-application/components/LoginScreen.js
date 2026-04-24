import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

// State for error modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

// Function to show error in modal
  const showError = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

// Handle login logic
  const handleLogin = async () => {
    console.log("Login clicked");

    // Validation to ensure the fields are not empty
    if (!email || !password) {
      return showError("Please fill all fields");
    }

    try {
      // Retrieve stored users from AsynchStorage
      const storedUsers = await AsyncStorage.getItem("users");
      console.log("Stored users:", storedUsers);

      if (!storedUsers) {
        return showError("No users found. Please sign up.");
      }

      let users = [];

      try {
        // Convert stores JSON string into a JS array
        users = JSON.parse(storedUsers);
        // Ensure parsed data is actually an arry 
        if (!Array.isArray(users)) users = [];
      } catch {
        // If parsing fails, reset users array
        users = [];
      }

// Find matching user by email and password
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

    // Validation for no user
      if (!user) {
        return showError("Invalid email or password");
      }

    // Save logged in user session in AsynchStorage
      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      // Flag to indicate user is logged in
      await AsyncStorage.setItem("loggedIn", "true");

      console.log("Login success");

    // Navigate to the home screen 
    //'replace' prevents going back to login screen
      navigation.replace("Home");
    } catch (error) {
      console.log("Login error:", error);
      showError("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Sign Up
      </Text>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9E090F",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#9E090F",
    fontWeight: "bold",
  },
  link: {
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#9E090F",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#9E090F",
    fontWeight: "bold",
  },
});