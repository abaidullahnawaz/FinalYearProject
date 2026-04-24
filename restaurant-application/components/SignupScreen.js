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

export default function SignupScreen({ navigation }) {
  //form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

// Show error in modal
  const showError = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

// regex to see if the email is valid
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

//validation for signup
  const handleSignup = async () => {
    if (!name || !email || !password) {
      return showError("Please fill all fields");
    }

    if (!isValidEmail(email)) {
      return showError("Invalid email format");
    }

    if (password.length < 4) {
      return showError("Password must be at least 4 characters");
    }

    try {
      // Retrieve existing users from AsycStorage
      const storedUsers = await AsyncStorage.getItem("users");

      // Covert stored JSON string into JS Array
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists in stored users
      const existingUser = users.find((u) => u.email === email);

      
      if (existingUser) {
        return showError("Email already exists. Please login.");
      }
      
      // Create new user object
      const newUser = { name, email, password };
      // Add new user to users array
      users.push(newUser);

    // Save updated user list back to AsyncStorage
      await AsyncStorage.setItem("users", JSON.stringify(users));
      // Store current logged in user
      await AsyncStorage.setItem("currentUser", JSON.stringify(newUser));
      // Set login status flag
      await AsyncStorage.setItem("loggedIn", "true");

      navigation.replace("Home");
    } catch (error) {
      showError("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
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