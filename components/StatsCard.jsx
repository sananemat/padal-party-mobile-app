import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function StatsCard({
  profileImage,
  name = "Noor Ali Khan",
  city = "Islamabad",
  percentage = "87%",
  stats = { matches: 32, wins: 26, winRate: "81%" },
  attributes = ["Right Handed", "Left Side", "Attacking"],
  racket = "ADIDAS METALBONE 3.4",
  racketIcon,
  style,
}) {
  return (
    <View style={[styles.card, style]}>
      {/* LEFT SECTION */}
      <View style={styles.leftSection}>
        {/* Profile Image with neon border */}
        <LinearGradient
          colors={["#38C6F4","#3C54A5", "#EE3C79"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.profileBorder}
        >
          <Image source={profileImage} style={styles.profileImage} />
        </LinearGradient>

        {/* Name + City */}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.city}>{city}</Text>

        {/* Horizontal neon line */}
        <LinearGradient
          colors={["#3C54A5", "#38C6F4", "#3C54A5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.neonLine}
        />
      </View>

      {/* RIGHT SECTION */}
      <View style={styles.rightSection}>
        {/* Circle with percentage */}
        <LinearGradient
          colors={["#3C54A5","#38C6F4", "#EE3C79"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.circleBorder}
        >
          <View style={styles.circleContent}>
            <Text style={styles.percentage}>{percentage}</Text>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: "Matches", value: stats.matches },
            { label: "Wins", value: stats.wins },
            { label: "Win%", value: stats.winRate },
          ].map((item, idx) => (
            <React.Fragment key={idx}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
              {idx < 2 && (
                <LinearGradient
                  colors={["#38C6F4", "#EE3C79"]}
                  style={styles.verticalLine}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Horizontal neon line */}
        <LinearGradient
          colors={["#3C54A5","#3C54A5", "#EE3C79","#3C54A5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.neonLine}
        />

        {/* Attributes Row */}
        <View style={styles.statsRow}>
          {attributes.map((attr, idx) => (
            <React.Fragment key={idx}>
              <View style={styles.statBlock}>
                <Text style={styles.attr}>{attr}</Text>
              </View>
              {idx < attributes.length - 1 && (
                <LinearGradient
                  colors={["#38C6F4", "#EE3C79"]}
                  style={styles.verticalLine}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Racket Row */}
        <View style={styles.racketRow}>
          {racketIcon && (
            <Image source={racketIcon} style={styles.racketIcon} />
          )}
          <Text style={styles.racketName}>{racket}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#01032cff",
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: "#070b2aff",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  leftSection: {
    width: "40%",
    alignItems: "center",
  },
  profileBorder: {
    padding: 1,
    borderRadius: 10,
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  city: {
    color: "#aaa",
    fontSize: 12,
  },
  neonLine: {
    height: 2,
    width: "80%",
    marginTop: 8,
    borderRadius: 2,
  },
  rightSection: {
    width: "60%",
    alignItems: "center",
  },
  circleBorder: {
    alignSelf: "center",
    padding: 3,
    borderRadius: 50,
    marginBottom: 10,
  },
  circleContent: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 6,
  },
  statBlock: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  statLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  attr: {
    color: "#fff",
    fontSize: 10.5,
  },
  verticalLine: {
    width: 2,
    height: "80%",
    borderRadius: 2,
  },
  racketRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  racketIcon: {
    marginRight: 6,
  },
  racketName: {
    color: "#fff",
    fontSize: 14,
  },
});
