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

import Sentiment from "sentiment"; //Sentiment analysis library

import restaurants from "./restaurant.json";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Used for handling restaurant reviews and sentiment analysis
export default function ReviewPage({ route }) {
  const restaurant = route.params?.restaurant || null; //get restaurant info from the previous screen
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurant); //select restaurant from the dropdown
  const [restaurantDropdownVisible, setRestaurantDropdownVisible] = useState(false); //Dropdown visibility
  const [reviewText, setReviewText] = useState(""); //user input for review
  const [loading, setLoading] = useState(false); //loading states

  //analysis results
  const [analysis, setAnalysis] = useState(null); 
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const [showCTA, setShowCTA] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState("");
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  const navigation = useNavigation();
  const [currentRating, setCurrentRating] = useState(restaurant?.rating || 0);
  const [reviewCount, setReviewCount] = useState(50);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [invalidModalVisible, setInvalidModalVisible] = useState(false);
  const [aiProcessed, setAiProcessed] = useState(false);

// API key used to call GROQ AI Model
 const GROQ_API_KEY = "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";

// Trigger AI only if review is valid
const handleAIButtonPress = () => {
  if (!isMeaningfulReview(reviewText)) {
    setInvalidModalVisible(true);
    return;
  }
  getAIInsight();
};

// Call GROQ API to simplify the review text
// Written a prompt for the model to read
const getAIInsight = async () => {
  if (!reviewText.trim()) return;

  setAiLoading(true);

  try {
    console.log("REVIEW SENT TO AI:", reviewText);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `
Return STRICT JSON ONLY:

{
  "original": "",
  "simplified": "",
  "overall": "",
  "food": "",
  "service": "",
  "ambience": "",
  "tone": ""
}

Rules:
- Convert slang into simple sentiment words
- Example:
  "lit" → "very good"
  "mid" → "average"
  "trash" → "very bad"
- Keep simplified sentence clear and formal
- No explanation

Review:
${reviewText}
`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    console.log("FULL AI RESPONSE:", JSON.stringify(data, null, 2));

// Extract andclean AI response
    const text = data?.choices?.[0]?.message?.content || "{}";

    console.log("RAW TEXT:", text);

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.log("JSON PARSE FAILED:", cleaned);
      parsed = {};
    }

    console.log("PARSED RESULT:", parsed);

// Store processed data
    setSimplifiedText(parsed.simplified || reviewText);

// Store AI processed results
    setAiAnalysis({
      original: parsed.original || reviewText,
      simplified: parsed.simplified || reviewText,
      overall: parsed.overall || "Not specified",
      food: parsed.food || "Not specified",
      service: parsed.service || "Not specified",
      ambience: parsed.ambience || "Not specified",
      tone: parsed.tone || "Neutral",
    });
    setAiProcessed(true);
    setAiModalVisible(true);

  } catch (err) {
    console.log("AI ERROR:", err);
  } finally {
    setAiLoading(false);
  }
};

// Save review to storage
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

// Checks to see if the text is meaningful
const isMeaningfulReview = (text) => {
  const cleaned = text.toLowerCase().trim();
  const words = cleaned.split(/\s+/);

  if (words.length <= 3) return false;
  if (!cleaned.includes("food")) return false;
  const validWords = words.filter((word) => /[aeiou]/.test(word));
  if (validWords.length < words.length / 2) return false;

  return true;
};

// const handleSubmit = async () => {
//   setAnalysis(null);
//   setAiProcessed(false);

//   if (!reviewText.trim() || !selectedRestaurant) return;

//   if (!isMeaningfulReview(reviewText)) {
//     setInvalidModalVisible(true);
//     return;
//   }

//   await getAIInsight();
// };

// Performs sentiment analysis on review text
// Uses custom dictionary to improve accuracy for food-related review
const runSentimentAnalysis = async () => {
const startTime = performance.now();
const overallText = aiAnalysis?.simplified || reviewText;

  console.log("FINAL SENTIMENT INPUT:", overallText);

// Create sentiment analyzer with custom word weights
  const sentiment = new Sentiment({
    extras: {
      average: -2,
      okay: -1,
      ok: -1,
      fine: -1,
      decent: -1,
      normal: -1,
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
      gross: -4,
      useless: -4,
      cold: -2,
      stale: -3,
      soggy: -3,
      oily: -2,
      burnt: -4,
      undercooked: -4,
      overcooked: -3,
      dry: -3,
      tasteless: -4,
      rubbery: -3,
      salty: -2,
      too_spicy: -1,
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
      fresh: 3,
      juicy: 3,
      crispy: 3,
      tender: 4,
      flavorful: 4,
      well_cooked: 4,
      fire: 4,
      lit: 4,
      banging: 4,
    },
  });

  const result = sentiment.analyze(overallText);

  let adjustedScore = result.score;
  let rating = 3;

// convert sentiment scroe into star rating
  if (adjustedScore >= 3) rating = 5;
    else if (adjustedScore >= 1) rating = 4;
    else if (adjustedScore <= -3) rating = 1;
    else if (adjustedScore <= -1) rating = 2;

  await saveReview(rating); //save review

// Update restaurant rating dynamically
const oldRating = currentRating;
const totalScore = currentRating * reviewCount;

// Update restaurant rating ynamically
const newRating = (totalScore + rating) / (reviewCount + 1);
const roundedNewRating = Number(newRating.toFixed(1));

setCurrentRating(roundedNewRating);
setReviewCount(reviewCount + 1);

// Show rating update modal
setRatingMessage(`⭐ Rating updated from ${oldRating} → ${roundedNewRating}`);
setRatingModalVisible(true);

setTimeout(() => {
  setRatingModalVisible(false);
}, 2500);

  let sentimentLabel = "Neutral";
  if (adjustedScore > 1) sentimentLabel = "Positive";
  else if (adjustedScore < -1) sentimentLabel = "Negative";

const endTime = performance.now();
const timeTaken = (endTime - startTime).toFixed(2);

// Set analysis result for UI display
  setAnalysis({
  input: overallText,
  sentiment: sentimentLabel,
  score: adjustedScore,
  rawSentiment: result,
  performance: {
    timeTaken,
  },
});
  setModalVisible(true);
};

// UI 
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

    {selectedRestaurant && reviewText.trim().length > 0 && (
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: "#2c3e50", marginTop: 10 }]}
        onPress={handleAIButtonPress}
        disabled={aiLoading}
      >
        {aiLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>AI Smart Analysis</Text>
        )}
      </TouchableOpacity>
    )}

    {aiProcessed && (
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: "#16a085", marginTop: 10 }]}
        onPress={runSentimentAnalysis}
      >
        <Text style={styles.submitText}>Run Sentiment Analysis</Text>
      </TouchableOpacity>
    )}
  </View>

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

<Modal transparent visible={modalVisible}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>

      <Text style={styles.modalTitle}>📊 Sentiment Analysis</Text>
      <ScrollView style={{ maxHeight: 350 }}>

    <Text style={{ marginTop: 10, fontWeight: "bold" }}>
      ⏱️ Analysis Time: {analysis?.performance?.timeTaken} ms
    </Text>
        <View style={styles.card}>
  <Text style={styles.cardTitle}>Input Sent to Sentiment</Text>
  <Text>{analysis?.input}</Text>
</View>
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

        <View style={styles.card}>
  <Text style={styles.cardTitle}>Raw Sentiment Output</Text>

  <Text>Score: {analysis?.rawSentiment?.score}</Text>

  <Text>Positive Words:</Text>
  <Text>
    {analysis?.rawSentiment?.positive?.length
      ? analysis.rawSentiment.positive.join(", ")
      : "None"}
  </Text>

  <Text>Negative Words:</Text>
  <Text>
    {analysis?.rawSentiment?.negative?.length
      ? analysis.rawSentiment.negative.join(", ")
      : "None"}
  </Text>
  <View style={styles.card}>
  <Text style={styles.cardTitle}>Score → Rating Mapping</Text>

  <Text>Adjusted Score: {analysis?.score}</Text>


  <Text>
    Rating:
    {analysis?.score >= 3
      ? " 5 ⭐"
      : analysis?.score >= 1
      ? " 4 ⭐"
      : analysis?.score <= -3
      ? " 1 ⭐"
      : analysis?.score <= -1
      ? " 2 ⭐"
      : " 3 ⭐"}
  </Text>
</View>
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

      <Modal transparent visible={ratingModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>The review has been submitted</Text>
            <Text style={styles.modalTitle}>Rating Updated</Text>
            <Text style={{ textAlign: "center" }}>{ratingMessage}</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={aiModalVisible}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>

      <Text style={styles.modalTitle}>🧠 AI Review Insight</Text>
      

      <View style={styles.card}>
  <Text style={styles.cardTitle}>Original Review</Text>
  <Text>{aiAnalysis?.original}</Text>
</View>

<View style={styles.card}>
  <Text style={styles.cardTitle}>Simplified (AI Processed)</Text>
  <Text>{aiAnalysis?.simplified}</Text>
</View>

      <ScrollView style={{ maxHeight: 350 }}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overall</Text>
          <Text>{aiAnalysis?.overall}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Food</Text>
          <Text>{aiAnalysis?.food}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service</Text>
          <Text>{aiAnalysis?.service}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ambience</Text>
          <Text>{aiAnalysis?.ambience}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tone</Text>
          <Text>{aiAnalysis?.tone}</Text>
        </View>

      </ScrollView>

      <Pressable
        style={styles.closeButton}
        onPress={() => setAiModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>

    </View>
  </View>
</Modal>


<Modal transparent visible={invalidModalVisible}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Invalid Review</Text>
      <Text style={{ textAlign: "center" }}>
        Please write a proper review.
      </Text>

      <Pressable
        style={styles.closeButton}
        onPress={() => setInvalidModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>OK</Text>
      </Pressable>
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
    marginTop: 20,
    marginBottom: 20
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