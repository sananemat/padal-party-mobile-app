// app/clubadmin/catournaments.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import CABreadcrumbs from "../../components/CABreadcrumbs";
import { CAProfileCard } from "../../components/CAProfileCard";
import { router } from "expo-router";

export default function CATournaments() {
  return (
    <ThemedView style={styles.container}>
      {/* 🔹 Breadcrumbs */}
      <CABreadcrumbs />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer height={16} />

        {/* 🔹 Create Tournament Button */}
        <TouchableOpacity style={styles.createButton} onPress={() => router.push("/cacreatetourney")}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.createButtonText}>Create Tournament</Text>
        </TouchableOpacity>

        {/* 🔹 Future content will go here */}
        <Spacer height={20} />
        <Text style={styles.comingSoon}>Tournament management features coming soon...</Text>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
    paddingTop: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EE3C79",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  comingSoon: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
  },
});