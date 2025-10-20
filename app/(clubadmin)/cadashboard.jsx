// app/clubadmin/cadashboard.jsx
import React from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { CADashboardCard } from "../../components/CADashboardCard";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import { router } from "expo-router";
import { Colors } from "../../constants/Colors";


export default function CADashboard() {

  return (
    <ThemedView style={styles.container}>
      {/* Title */}
      <Text style={styles.heading}>Dashboard Overview</Text>

      <ThemedView style={[styles.grid, ]}>
        <CADashboardCard  style={{flex:1}}
          icon={<Ionicons name="business" size={32} color={Colors.primaryAlt} />}
          title="Club Profile"
          subtitle="Management"
          onPress={() => router.push("/caprofile")}
        />
        <CADashboardCard style={{flex:1}}
          icon={<Ionicons name="tennisball" size={32} color={Colors.primary} />}
          title="Court"
          subtitle="Management"
          onPress={() => router.push("/cacourts")}
        />
      </ThemedView>
      <ThemedView style={[styles.grid, ]}>
        <CADashboardCard style={{flex:1}}
          icon={<Ionicons name="calendar-number" size={32} color={Colors.primary} />}
          title="Booking"
          subtitle="Management"
          onPress={() => router.push("/cabookings")}
        />
        <CADashboardCard style={{flex:1}}
          icon={<Ionicons name="stats-chart" size={32} color={Colors.primaryAlt} />}
          title="Analytics"
          subtitle="Reports"
          onPress={() => router.push("/caanalytics")}
        />
        </ThemedView>
        <ThemedView style={[styles.grid, ]}>
        <CADashboardCard style={{flex:1}}
          icon={<Ionicons name="trophy" size={32} color={Colors.primaryAlt} />}
          title="Tournaments"
          subtitle="Management"
          onPress={() => router.push("/catournaments")}
        />
        <CADashboardCard style={{flex:1}}
          icon={<Ionicons name="chatbubble-ellipses" size={32} color={Colors.primary} />}
          title="Communications"
          subtitle="Notifications"
          onPress={() => router.push("/cacomms")}
        />
        </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column"
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    marginLeft: "2.5%"
    
  },
  grid: {
    flexDirection: "row",
    // flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
