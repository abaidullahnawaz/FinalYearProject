import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import TopBanner from "./Top_Banner";
import { imageMap } from "./imageMap";
import Sentiment from "sentiment";
import restaurants from "./restaurant.json";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReviewPage({ route }) {
  const restaurant = route.params?.restaurant || null;

  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurant);
  const [restaurantDropdownVisible, setRestaurantDropdownVisible] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showCTA, setShowCTA] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  const navigation = useNavigation();

  const [currentRating, setCurrentRating] = useState(restaurant?.rating || 0);
  const [reviewCount, setReviewCount] = useState(50);

// ✅ FIXED: moved ABOVE handleSubmit so it NEVER breaks
  const saveReview = async (rating) => {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      const user = currentUser ? JSON.parse(currentUser) : null;

      const stored = await AsyncStorage.getItem("reviews");
      let reviews = stored ? JSON.parse(stored) : [];

      const newReview = {
        email: user?.email,
        name: user?.name,
        restaurant: selectedRestaurant?.restaurantName,
        review: reviewText,
        rating: rating,
        createdAt: new Date().toISOString(),
      };

      reviews.push(newReview);

      await AsyncStorage.setItem("reviews", JSON.stringify(reviews));
    } catch (err) {
      console.log("Error saving review:", err);
    }
  };


const handleSubmit = async () => {
      if (!reviewText.trim() || !selectedRestaurant) return;

    setLoading(true);
    setShowCTA(false);

    setTimeout(() => {
      try {
        const startTime = Date.now(); // ✅ ADD HERE

        // const sentiment = new Sentiment();

const sentiment = new Sentiment({
  extras: {
    // 🔴 Negative strong words
    pathetic: -5,
    horrible: -5,
    disgusting: -5,
    trash: -5,
    awful: -4,
    terrible: -4,
    worst: -5,
    inedible: -5,
    bland: -2,
    disappointing: -3,
    garbage: -5,
    rubbish: -4,
    mid: -2,

    // 🔴 Strong emotional negatives
    gross: -4,
    useless: -4,

    // 🟢 Strong positive words
    amazing: 5,
    excellent: 5,
    outstanding: 5,
    delicious: 5,
    tasty: 4,
    perfect: 5,
    brilliant: 4,
    fantastic: 5,
    incredible: 5,
    yummy: 4,
    great: 4,
    awesome: 5,

    // 🟢 Slang positive
    fire: 4,
    lit: 4,
    banging: 4,
  },
});
        // ✅ FIXED VARIABLES
        const tokens = reviewText.toLowerCase().split(/\s+/);
        const clauses = reviewText.toLowerCase().split(/\bbut\b/);

        const result = sentiment.analyze(reviewText);

        // ✅ OVERALL SENTIMENT
        let adjustedScore = 0;

        tokens.forEach((word, idx) => {
          let val = sentiment.analyze(word).score;

          if (
            idx > 0 &&
            ["not", "didn't", "never", "no"].includes(tokens[idx - 1])
          ) {
            val = -val;
          }

          adjustedScore += val;
        });

        let sentimentLabel = "Neutral";
        if (adjustedScore > 1) sentimentLabel = "Positive";
        else if (adjustedScore < -1) sentimentLabel = "Negative";

        let rating = 3;
        if (adjustedScore >= 3) rating = 5;
        else if (adjustedScore >= 1) rating = 4;
        else if (adjustedScore <= -3) rating = 1;
        else if (adjustedScore <= -1) rating = 2;
        
        saveReview(rating);

        // ✅ RATING UPDATE
        const oldRating = currentRating;
        const totalScore = currentRating * reviewCount;

        const newRating = (totalScore + rating) / (reviewCount + 1);
        const roundedNewRating = Number(newRating.toFixed(1));

        setCurrentRating(roundedNewRating);
        setReviewCount(reviewCount + 1);

        setRatingMessage(`⭐ Rating updated from ${oldRating} → ${roundedNewRating}`);
        setRatingModalVisible(true);

        setTimeout(() => {
          setRatingModalVisible(false);
        }, 2500);

        // ✅ ASPECT SENTIMENT (FIXED WITH CLAUSES)
        const aspectKeywords = {
          food: ["food", "meal", "dish", "pizza", "burger", "taste", "flavor"],
          service: ["service", "waiter", "staff", "server"],
          ambience: ["ambience", "environment", "music", "decor", "lighting"],
        };

        const aspects = {};

        Object.keys(aspectKeywords).forEach((aspect) => {
          let score = 0;

          clauses.forEach((clause) => {
            const clauseTokens = clause.trim().split(/\s+/);

            const hasAspect = clauseTokens.some((word) =>
              aspectKeywords[aspect].includes(word)
            );

            if (hasAspect) {
              clauseTokens.forEach((word, idx) => {
                let val = sentiment.analyze(word).score;

                if (
                  idx > 0 &&
                  ["not", "didn't", "never", "no"].includes(clauseTokens[idx - 1])
                ) {
                  val = -val;
                }

                score += val;
              });
            }
          });

          if (score > 0) aspects[aspect] = "Positive";
          else if (score < 0) aspects[aspect] = "Negative";
          else aspects[aspect] = "Neutral";
        });
        const endTime = Date.now();
const timeTaken = endTime - startTime;

        // ✅ SAVE ANALYSIS
        setAnalysis({
          sentiment: sentimentLabel,
          score: adjustedScore,
          rating,
          performance: {
    timeTaken, // ✅ ADD THIS
  },
          details: {
            tokens,
            positive: result.positive,
            negative: result.negative,
            aspects,
          },
        });

      } catch (err) {
        console.log("ERROR:", err);
      } finally {
        setLoading(false);
        setShowCTA(true);
      }
    }, 1000);
  };



const getColor = (value) => {
  if (value === "Positive") return "#2ecc71";
  if (value === "Negative") return "#e74c3c";
  return "#7f8c8d";
};

  return (
    <ScrollView style={styles.container}>
      <TopBanner />

      <View style={styles.content}>
        {restaurant && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Select Restaurant</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setRestaurantDropdownVisible(true)}
        >
          <Text>
            {selectedRestaurant
              ? selectedRestaurant.restaurantName
              : "Choose a restaurant"}
          </Text>
        </TouchableOpacity>

        {selectedRestaurant && (
          <View style={styles.restaurantInfo}>
            <Image
              source={imageMap[selectedRestaurant.image]}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>
                {selectedRestaurant.restaurantName}
              </Text>
              <Text style={styles.infoText}>{selectedRestaurant.location}</Text>
              <Text style={styles.infoText}>{selectedRestaurant.category}</Text>
              <Text style={styles.infoText}>⭐ {currentRating}</Text>
            </View>
          </View>
        )}

        <Text style={styles.reviewTitle}>Write your review below</Text>

        <TextInput
          style={styles.textArea}
          placeholder="Share your experience..."
          value={reviewText}
          onChangeText={setReviewText}
          multiline
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Review</Text>
          )}
        </TouchableOpacity>

        {showCTA && analysis && (
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.detailButtonText}>
              Detailed Sentiment Calculator Analysis
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ RESTAURANT MODAL */}
      <Modal transparent visible={restaurantDropdownVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Restaurant</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {restaurants.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.restaurantItem}
                  onPress={() => {
                    setSelectedRestaurant(r);
                    setCurrentRating(r.rating);
                    setRestaurantDropdownVisible(false);
                  }}
                >
                  <Text>{r.restaurantName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Pressable
              style={styles.closeButton}
              onPress={() => setRestaurantDropdownVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ✅ IMPROVED ANALYSIS MODAL */}
<Modal transparent visible={modalVisible}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>

      <Text style={styles.modalTitle}>📊 Sentiment Analysis</Text>

      <ScrollView style={{ maxHeight: 350 }}>

<Text style={{ marginTop: 10, fontWeight: "bold" }}>
  ⏱️ Analysis Time: {analysis?.performance?.timeTaken} ms
</Text>
        {/* ✅ Overall Sentiment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overall Sentiment</Text>
          <Text
            style={[
              styles.sentimentText,
              { color: getColor(analysis?.sentiment) },
            ]}
          >
            {analysis?.sentiment || "N/A"}
          </Text>
        </View>

        {/* ✅ Aspect Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aspect Breakdown</Text>

          {Object.entries(analysis?.details?.aspects || {}).map(([a, v]) => (
            <View key={a} style={styles.aspectRow}>
              <Text style={styles.aspectName}>{a}</Text>
              <Text style={[styles.aspectValue, { color: getColor(v) }]}>
                {v}
              </Text>
            </View>
          ))}
        </View>

        {/* ✅ Positive Words */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Positive Words</Text>
          <Text style={{ color: "#2ecc71" }}>
            {analysis?.details?.positive?.length
              ? analysis.details.positive.join(", ")
              : "None"}
          </Text>
        </View>

        {/* ✅ Negative Words */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Negative Words</Text>
          <Text style={{ color: "#e74c3c" }}>
            {analysis?.details?.negative?.length
              ? analysis.details.negative.join(", ")
              : "None"}
          </Text>
        </View>

      </ScrollView>

      <Pressable
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>

    </View>
  </View>
</Modal>

      {/* ✅ RATING MODAL */}
      <Modal transparent visible={ratingModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rating Updated</Text>
            <Text style={{ textAlign: "center" }}>{ratingMessage}</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 16, paddingBottom: 30 },

  label: { fontWeight: "bold", marginBottom: 10 },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  restaurantInfo: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },

  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },

  restaurantDetails: { flex: 1 },

  restaurantName: { fontSize: 18, fontWeight: "bold" },

  infoText: { color: "#555", marginTop: 2 },

  reviewTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 120,
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: "#9E090F",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  submitText: { color: "#fff", fontWeight: "bold" },

  detailButton: {
    marginTop: 15,
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  detailButtonText: { color: "#fff", fontWeight: "bold" },

  backButton: { marginBottom: 10 },

  backText: { color: "#9E090F", fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: 20,
  },

  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  restaurantItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: "#9E090F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  closeButtonText: { color: "#fff", fontWeight: "bold" },

  card: {
  backgroundColor: "#f8f9fa",
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
},

cardTitle: {
  fontWeight: "bold",
  marginBottom: 6,
  fontSize: 14,
},

sentimentText: {
  fontSize: 18,
  fontWeight: "bold",
},

aspectRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 4,
},

aspectName: {
  textTransform: "capitalize",
},

aspectValue: {
  fontWeight: "bold",
},
});



