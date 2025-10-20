// app/clubadmin/cacourtavailability.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CAProfileCard } from "../../components/CAProfileCard";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import { useSegments } from "expo-router";
import CABreadcrumbs from "../../components/CABreadcrumbs";
import AddExternalBookingModal from "../../components/AddExternalBookingModal";
import { Colors } from "../../constants/Colors";

// 🔹 Helper to create Date objects
const createDate = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  
  return new Date(year, month - 1, day, hours, minutes);
};

// 🔹 Sample courts data
const SAMPLE_COURTS = [
  {
    id: "1",
    name: "Court 1",
    status: "Active",
  },
  {
    id: "2",
    name: "Court 2",
    status: "Active",
  },
  {
    id: "3",
    name: "Court 3",
    status: "Inactive",
  },
];



export default function CACourtAvailability() {

  const [activeTab, setActiveTab] = useState("Today");
  const [expandedCourts, setExpandedCourts] = useState({});
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  // 🔹 Sample matches data
const [matches, setMatches] = useState([
  {
    id: "1",
    courtId: "1",
    name: "Morning Doubles",
    startDateTime: createDate("2025-10-19", "9:00 AM"),
    endDateTime: createDate("2025-10-19", "10:30 AM"),
    isExternal: false,
  },
  {
    id: "2",
    courtId: "2",
    name: "Lunch Break",
    startDateTime: createDate("2025-10-19", "12:00 PM"),
    endDateTime: createDate("2025-10-19", "1:00 PM"),
    isExternal: true,
  },
  {
    id: "3",
    courtId: "2",
    name: "Afternoon Session",
    startDateTime: createDate("2025-10-19", "3:00 PM"),
    endDateTime: createDate("2025-10-19", "4:30 PM"),
    isExternal: false,
  },
  {
    id: "4",
    courtId: "1",
    name: "Evening Match",
    startDateTime: createDate("2025-10-11", "6:00 PM"),
    endDateTime: createDate("2025-10-11", "7:30 PM"),
    isExternal: false,
  },
  {
    id: "5",
    courtId: "3",
    name: "Tournament Match",
    startDateTime: createDate("2024-06-11", "10:00 AM"),
    endDateTime: createDate("2024-06-11", "11:30 AM"),
    isExternal: false,
  },
]);

  // 🔹 Calculate tab dates (timezone-safe)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // 🔹 Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      // year: 'numeric'
    });
  };

  // 🔹 Get matches for selected tab
  const getMatchesForTab = () => {
    let targetDate;
    if (activeTab === "Today") targetDate = today;
    else if (activeTab === "Tomorrow") targetDate = tomorrow;
    else targetDate = dayAfterTomorrow;
  
    // Get target date components in local timezone
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();
  
    return matches.filter(match => {
      const matchDate = new Date(match.startDateTime);
      const matchYear = matchDate.getFullYear();
      const matchMonth = matchDate.getMonth();
      const matchDay = matchDate.getDate();
      
      return (
        matchYear === targetYear &&
        matchMonth === targetMonth &&
        matchDay === targetDay
      );
    });
  };

  // 🔹 Group matches by court and count them
  const { groupedMatches, courtCounts } = getMatchesForTab().reduce((acc, match) => {
    if (!acc.groupedMatches[match.courtId]) {
      acc.groupedMatches[match.courtId] = [];
      acc.courtCounts[match.courtId] = 0;
    }
    acc.groupedMatches[match.courtId].push(match);
    acc.courtCounts[match.courtId]++;
    return acc;
  }, { groupedMatches: {}, courtCounts: {} });

  // 🔹 Sort courts by number of matches (descending)
  const sortedCourts = [...SAMPLE_COURTS].sort((a, b) => {
    const countA = courtCounts[a.id] || 0;
    const countB = courtCounts[b.id] || 0;
    return countB - countA;
  });

  // 🔹 Initialize expanded state per tab (first court expanded by default)
  useEffect(() => {
    const initialExpanded = {};
    if (sortedCourts.length > 0) {
      initialExpanded[sortedCourts[0].id] = true;
    }
    setExpandedCourts(prev => ({
      ...prev,
      [activeTab]: initialExpanded
    }));
  }, [activeTab]); // Reset expanded state when tab changes

  // 🔹 Toggle court expansion for current tab
  const toggleCourt = (courtId) => {
    setExpandedCourts(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [courtId]: !prev[activeTab]?.[courtId]
      }
    }));
  };

  // 🔹 Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const handleAddBooking = (newBooking) => {
    setMatches(prev => [...prev, newBooking]);
  };

  // 🔹 Get expanded state for current tab
  const currentTabExpanded = expandedCourts[activeTab] || {};

  return (
    <ThemedView style={styles.container}>
      {/* 🔹 Breadcrumbs */}
      <CABreadcrumbs/>

      {/* 🔹 Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: "Today", label: "Today" },
          { key: "Tomorrow", label: "Tomorrow" },
          { key: "DayAfter", label: formatDate(dayAfterTomorrow) },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer height={16} />

        {/* 🔹 Add External Booking Button (Pink background) */}
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add External Booking</Text>
        </TouchableOpacity>

        <Spacer height={16} />

        {/* 🔹 Court Cards */}
        {sortedCourts.map((court) => {
          const courtMatches = groupedMatches[court.id] || [];
          const isExpanded = currentTabExpanded[court.id];
          
          return (
            <CAProfileCard key={`${activeTab}-${court.id}`} style={styles.courtCard}>
              {/* 🔹 Court Header (Always Visible) */}
              <TouchableOpacity 
                style={styles.courtHeader} 
                onPress={() => toggleCourt(court.id)}
              >
                <Text style={styles.courtName}>{court.name}</Text>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>

              {/* 🔹 Booking Bars (Only when expanded) */}
              {isExpanded && courtMatches.length > 0 && (
                <View style={styles.bookingBarsContainer}>
                    <Spacer height={16} />
                  {courtMatches
                    .slice()
                    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)) // Sort by start time ascending
                    .map((match) => (
                    <View
                      key={match.id}
                      style={[
                        styles.bookingBar,
                        match.isExternal ? styles.externalBooking : styles.internalBooking
                      ]}
                    >
                      <Text style={styles.bookingTime}>
                        {formatTime(match.startDateTime)} - {formatTime(match.endDateTime)}
                      </Text>
                      <Text style={styles.bookingStatus}>{match.isExternal?"External":"Booked"}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 🔹 No bookings message */}
              {isExpanded && courtMatches.length === 0 && (
                <Text style={styles.noBookingsText}>No bookings for this court</Text>
              )}
            </CAProfileCard>
          );
        })}
      </ScrollView>
      <AddExternalBookingModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddBooking={handleAddBooking}
        courts={SAMPLE_COURTS}
        matches={matches}
        bookingDate={
            activeTab === "Today" ? today :
            activeTab === "Tomorrow" ? tomorrow :
            dayAfterTomorrow
        }
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
    paddingTop: 16,
  },
  breadcrumbs: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "rgba(56, 198, 244, 0.1)",
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: Colors.primaryAlt,
  },
  tabText: {
    color: "#aaa",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary, // Pink background
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  courtCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden", // For rounded corners on booking bars
  },
  courtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  courtName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bookingBarsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bookingBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  externalBooking: {
    backgroundColor: "#4B5563", // Gray
  },
  internalBooking: {
    backgroundColor: Colors.background, // Dark blue (same as timer boxes)
  },
  bookingTime: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bookingStatus: {
    color: Colors.primaryAlt, // Cyan
    fontSize: 14,
    fontWeight: "600",
  },
  noBookingsText: {
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 14,
  },
});