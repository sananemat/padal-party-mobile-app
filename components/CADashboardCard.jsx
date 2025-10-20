// components/CADashboardCard.jsx
import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { PlatformPressable, Text } from "@react-navigation/elements";
import { Colors } from "../constants/Colors";

export function CADashboardCard({
  icon,
  title,
  subtitle,
  onPress,
  width = "100%",
  height = "100%",
  style,
}) {
  const colorScheme = useColorScheme();
  //const theme = Colors[colorScheme] ?? Colors.dark
  return (
    <PlatformPressable
      onPress={onPress}
      style={[{ width, height, margin: 6 }, style]}
    >
      <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
        {/* Icon */}
        <View style={styles.iconBox}>{icon}</View>

        {/* Text */}
        <View style={styles.textBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  iconBox: {
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#b0b8f5",
  },
});
