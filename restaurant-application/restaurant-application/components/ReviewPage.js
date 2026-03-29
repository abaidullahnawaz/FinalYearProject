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

export default function ReviewPage({ route }) {
  const { restaurant } = route.params;

  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showCTA, setShowCTA] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  const [currentRating, setCurrentRating] = useState(restaurant.rating);
  const [reviewCount, setReviewCount] = useState(50);

  const handleSubmit = () => {
    if (!reviewText.trim()) return;

    setLoading(true);
    setShowCTA(false);

    setTimeout(() => {
      const sentiment = new Sentiment();
      const tokens = reviewText.split(/\s+/);
      const result = sentiment.analyze(reviewText);

      // Negation handling
      let adjustedScore = 0;
      tokens.forEach((word, idx) => {
        let val = sentiment.analyze(word).score;

        if (
          idx > 0 &&
          ["not", "didn't", "never", "no"].includes(
            tokens[idx - 1].toLowerCase()
          )
        ) {
          val = -val;
        }

        adjustedScore += val;
      });

      // Sentiment label
      let sentimentLabel = "Neutral";
      if (adjustedScore > 1) sentimentLabel = "Positive";
      else if (adjustedScore < -1) sentimentLabel = "Negative";

      // Convert to rating
      let rating = 3;
      if (adjustedScore >= 3) rating = 5;
      else if (adjustedScore >= 1) rating = 4;
      else if (adjustedScore <= -3) rating = 1;
      else if (adjustedScore <= -1) rating = 2;

      const oldRating = currentRating;
      const totalScore = currentRating * reviewCount;

      const newRating =
        (totalScore + rating) / (reviewCount + 1);

      const roundedNewRating = Number(newRating.toFixed(1));

      setCurrentRating(roundedNewRating);
      setReviewCount(reviewCount + 1);

      setRatingMessage(
        `⭐ Rating updated from ${oldRating} → ${roundedNewRating}`
      );
      setRatingModalVisible(true);

      // Auto close after 2.5 sec
      setTimeout(() => {
        setRatingModalVisible(false);
      }, 2500);

      // Aspect analysis
      const aspectKeywords = {
        food: ["food", "meal", "dish", "pizza", "burger", "taste", "flavor"],
        service: ["service", "waiter", "staff", "server", "helpful", "slow"],
        ambience: ["ambience", "environment", "music", "decor", "lighting"],
      };

      const aspects = {};
      Object.keys(aspectKeywords).forEach((aspect) => {
        const hits = tokens.filter((t) =>
          aspectKeywords[aspect].includes(t.toLowerCase())
        );
        if (hits.length > 0) {
          const pos = hits.filter((t) =>
            result.positive.includes(t.toLowerCase())
          );
          const neg = hits.filter((t) =>
            result.negative.includes(t.toLowerCase())
          );
          if (pos.length > neg.length) aspects[aspect] = "Positive";
          else if (neg.length > pos.length) aspects[aspect] = "Negative";
          else aspects[aspect] = "Neutral";
        }
      });

      setAnalysis({
        sentiment: sentimentLabel,
        score: adjustedScore,
        rating,
        details: {
          tokens,
          positive: result.positive,
          negative: result.negative,
          aspects,
        },
      });

      setLoading(false);
      setShowCTA(true);
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TopBanner />

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Image source={imageMap[restaurant.image]} style={styles.restaurantImage} />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
          <Text style={styles.infoText}>{restaurant.location}</Text>
          <Text style={styles.infoText}>{restaurant.category}</Text>
          <Text style={styles.infoText}>⭐ {currentRating}</Text>
        </View>
      </View>

      {/* Review Input */}
      <Text style={styles.reviewTitle}>Write your review below</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Share your experience..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
      />

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Review</Text>
        )}
      </TouchableOpacity>

      {/* CTA */}
      {showCTA && (
        <TouchableOpacity style={styles.detailButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.detailButtonText}>
            Detailed Sentiment Calculator Analysis
          </Text>
        </TouchableOpacity>
      )}

      {/* Sentiment Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detailed Sentiment Analysis</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={{ fontWeight: "bold" }}>Tokens:</Text>
              <Text>{analysis?.details.tokens.join(", ")}</Text>

              <Text style={{ fontWeight: "bold", marginTop: 10 }}>Positive Words:</Text>
              <Text>{analysis?.details.positive.join(", ") || "None"}</Text>

              <Text style={{ fontWeight: "bold", marginTop: 10 }}>Negative Words:</Text>
              <Text>{analysis?.details.negative.join(", ") || "None"}</Text>

              <Text style={{ fontWeight: "bold", marginTop: 10 }}>Aspect Sentiment:</Text>
              {Object.entries(analysis?.details.aspects || {}).map(([a, v]) => (
                <Text key={a}>{a}: {v}</Text>
              ))}
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ✅ NEW: Rating Change Modal */}
      <Modal animationType="slide" transparent={true} visible={ratingModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rating Updated</Text>
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              {ratingMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}







const styles = StyleSheet.create({
  container: 
  { 
    flex: 1, 
    backgroundColor: "#fff" 
    },
  restaurantInfo: { flexDirection: "row", marginTop: 20, marginBottom: 20, alignItems: "center" },
  restaurantImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  restaurantDetails: { flex: 1 },
  restaurantName: { fontSize: 18, fontWeight: "bold" },
  infoText: { color: "#555", marginTop: 2 },
  reviewTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  textArea: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, height: 120, textAlignVertical: "top", marginBottom: 20 },
  submitButton: { backgroundColor: "#9E090F", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  detailButton: { marginTop: 15, backgroundColor: "#444", padding: 12, borderRadius: 8, alignItems: "center" },
  detailButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", width: "90%", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  closeButton: { marginTop: 15, backgroundColor: "#9E090F", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  closeButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});




