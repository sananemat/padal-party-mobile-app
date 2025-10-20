// components/CAProfileCard.jsx
import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

export function CAProfileCard({
  children,
  width = "100%",
  height,
  style,
}) {
  const colorScheme = useColorScheme();
  // const theme = Colors[colorScheme] ?? Colors.dark;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: Colors.cardBackground, width, height },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
