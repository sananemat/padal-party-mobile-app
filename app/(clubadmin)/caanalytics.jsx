// app/clubadmin/caanalytics.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import { router } from "expo-router";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dropdown } from 'react-native-element-dropdown';
import CABreadcrumbs from "../../components/CABreadcrumbs";
import { CAProfileCard } from "../../components/CAProfileCard"; // ✅ Added import
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../constants/Colors";

// 🔹 Sample data for All Courts (Overall)
const OVERALL_DATA = {
  totalBookings: 247,
  uniquePlayers: 89,
  cancelled: 12,
  revenue: 47000,
  // Daily Data (Today only)
  dailyBookings: 35,
  dailyRevenue: 6500,
  // Weekly Data (Last 7 days)
  weeklyBookings: [35, 40, 38, 42, 39, 33, 33],
  weeklyRevenue: [6500, 7200, 6800, 7500, 7000, 6000, 6000],
  // Monthly Data (Current Month)
  monthlyBookings: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 50) + 10),
  monthlyRevenue: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 1000) + 5000),
  // Yearly Data (Current Year)
  yearlyBookings: [1000, 1050, 1100, 1080, 1050, 1030, 1000, 980, 950, 920, 900, 880],
  yearlyRevenue: [180000, 190000, 200000, 195000, 190000, 185000, 180000, 175000, 170000, 165000, 160000, 155000],
  // Peak vs Low Hours (Hourly - 0 to 23)
  peakHours: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 20) + 5),
  lowHours: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 10) + 2),
  // Most Booked Courts (Overall)
  mostBookedCourts: [
    { name: "Court A", bookings: 89 },
    { name: "Court B", bookings: 76 },
    { name: "Court C", bookings: 62 },
    { name: "Court D", bookings: 45 },
  ],
  // Player Activity Trends (Overall)
  playerActivityTrends: [
    { name: "Rahul Sharma", matches: 24 },
    { name: "Priya Patel", matches: 19 },
    { name: "Arjun Singh", matches: 17 },
    { name: "Sneha Kumar", matches: 14 },
  ],
};

// 🔹 Sample data for Court A
const COURT_A_DATA = {
  totalBookings: 89,
  uniquePlayers: 50,
  cancelled: 5,
  revenue: 20000,
  dailyBookings: 15,
  dailyRevenue: 3000,
  weeklyBookings: [15, 18, 16, 20, 17, 13, 11],
  weeklyRevenue: [3000, 3500, 3200, 3800, 3400, 3000, 2800],
  monthlyBookings: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 20) + 5),
  monthlyRevenue: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 500) + 2000),
  yearlyBookings: [500, 520, 550, 540, 530, 510, 500, 490, 480, 470, 460, 450],
  yearlyRevenue: [90000, 95000, 100000, 98000, 96000, 94000, 92000, 90000, 88000, 86000, 84000, 82000],
  peakHours: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 10) + 2),
  lowHours: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 5) + 1),
  mostBookedCourts: [
    { name: "Court A", bookings: 89 },
    { name: "Court B", bookings: 76 },
    { name: "Court C", bookings: 62 },
    { name: "Court D", bookings: 45 },
  ],
  playerActivityTrends: [
    { name: "Rahul Sharma", matches: 24 },
    { name: "Priya Patel", matches: 19 },
    { name: "Arjun Singh", matches: 17 },
    { name: "Sneha Kumar", matches: 14 },
  ],
};

// 🔹 Sample data for Court B
const COURT_B_DATA = {
  totalBookings: 76,
  uniquePlayers: 40,
  cancelled: 4,
  revenue: 15000,
  dailyBookings: 12,
  dailyRevenue: 2500,
  weeklyBookings: [12, 15, 14, 18, 16, 12, 10],
  weeklyRevenue: [2500, 3000, 2800, 3500, 3200, 2700, 2500],
  monthlyBookings: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 15) + 5),
  monthlyRevenue: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 400) + 1500),
  yearlyBookings: [400, 420, 450, 440, 430, 410, 400, 390, 380, 370, 360, 350],
  yearlyRevenue: [70000, 75000, 80000, 78000, 76000, 74000, 72000, 70000, 68000, 66000, 64000, 62000],
  peakHours: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 8) + 1),
  lowHours: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 4) + 1),
  mostBookedCourts: [
    { name: "Court A", bookings: 89 },
    { name: "Court B", bookings: 76 },
    { name: "Court C", bookings: 62 },
    { name: "Court D", bookings: 45 },
  ],
  playerActivityTrends: [
    { name: "Rahul Sharma", matches: 24 },
    { name: "Priya Patel", matches: 19 },
    { name: "Arjun Singh", matches: 17 },
    { name: "Sneha Kumar", matches: 14 },
  ],
};

// 🔹 Sample Courts Data
const SAMPLE_COURTS = [
  { id: "all", name: "All Courts" },
  { id: "courtA", name: "Court A" },
  { id: "courtB", name: "Court B" },
  { id: "courtC", name: "Court C" },
  { id: "courtD", name: "Court D" },
];

export default function CAAnalytics() {
  const [activeTab, setActiveTab] = useState("Daily");
  const [selectedCourt, setSelectedCourt] = useState("all");

  // 🔹 Get data based on active tab and selected court
  const getData = () => {
    let data = OVERALL_DATA;
    if (selectedCourt === "courtA") data = COURT_A_DATA;
    else if (selectedCourt === "courtB") data = COURT_B_DATA;
    // Add more courts as needed

    return data;
  };

  const data = getData();

  // 🔹 Generate labels for charts based on active tab
  const getChartLabels = () => {
    const now = new Date();
    switch (activeTab) {
      case "Daily":
        return ["Today"];
      case "Weekly":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          return date.toLocaleDateString([], { weekday: 'short' });
        });
      case "Monthly":
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      case "Yearly":
        return [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
      default:
        return [];
    }
  };

  // 🔹 Generate date/month/year string for chart title
  const getChartDate = () => {
    const now = new Date();
    switch (activeTab) {
      case "Daily":
        return `${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
      case "Weekly":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
      case "Monthly":
        return `${now.toLocaleDateString([], { month: 'long' })}`;
      case "Yearly":
        return `${now.getFullYear()}`;
      default:
        return "";
    }
  };

  // 🔹 Format time for Peak vs Low Hours chart
  const getHourLabels = () => {
    return Array.from({ length: 24 }, (_, i) => `${i}:00`);
  };

  return (
    <ThemedView style={styles.container}>
      {/* 🔹 Breadcrumbs */}
      <CABreadcrumbs />

      {/* 🔹 Tabs */}
      <View style={styles.tabsContainer}>
        {["Daily", "Weekly", "Monthly", "Yearly"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer height={16} />

        {/* 🔹 Court Selector Dropdown */}
        <Text style={styles.label}>Court</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
          containerStyle={styles.dropdownList}
          itemContainerStyle={styles.dropdownItem}
          itemTextStyle={styles.itemTextStyle}
          selectedStyle={styles.dropdownItemSelected}
          activeColor={Colors.background} // Use activeColor instead of selectedTextStyle
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={SAMPLE_COURTS}
          search={false}
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder="Select Court"
          searchPlaceholder="Search..."
          value={selectedCourt}
          onChange={item => {
            setSelectedCourt(item.id);
          }}
        />

        <Spacer height={16} />

        {/* 🔹 Top Stats Row */}
        <View style={styles.statsRow}>
          <CAProfileCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Total Bookings</Text>
                <Ionicons name="calendar" size={24} color={Colors.primaryAlt} />
              </View>
              <Text style={styles.statValue}>{data.totalBookings}</Text>
              {/* Simple diagonal path line (no chart) */}
              <Svg width="100%" height={20}>
                <Path
                  d="M0 10 L40,5 L80,3 L120,6 L160,1"
                  stroke={Colors.primaryAlt}
                  strokeWidth="3"
                  fill="none"
                />
              </Svg>
            </View>
          </CAProfileCard>
          <CAProfileCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Unique Players</Text>
                <Ionicons name="people" size={24} color={Colors.primaryAlt} />
              </View>
              <Text style={styles.statValue}>{data.uniquePlayers}</Text>
              {/* Simple diagonal path line (no chart) */}
              <Svg width="100%" height={20}>
                <Path
                  d="M0 10 L40,5 L80,3 L120,6 L160,1"
                  stroke={Colors.primaryAlt}
                  strokeWidth="3"
                  fill="none"
                />
              </Svg>
            </View>
          </CAProfileCard>
        </View>
        <View style={styles.statsRow}>
          <CAProfileCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Cancelled</Text>
                <Ionicons name="close-circle" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{data.cancelled}</Text>
              {/* Simple diagonal path line (no chart) */}
              <Svg width="100%" height={20}>
                <Path
                  d="M0 10 L40,5 L80,3 L120,6 L160,1"
                  stroke={Colors.primary}
                  strokeWidth="3"
                  fill="none"
                />
              </Svg>
            </View>
          </CAProfileCard>
          <CAProfileCard style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Revenue</Text>
                <Text style={styles.statIcon}>Rs</Text>
              </View>
              <Text style={styles.statValue}>{data.revenue}</Text>
              {/* Simple diagonal path line (no chart) */}
              <Svg width="100%" height={20}>
                <Path
                  d="M0 10 L40,5 L80,3 L120,6 L160,1"
                  stroke={Colors.primaryAlt}
                  strokeWidth="3"
                  fill="none"
                />
              </Svg>
            </View>
          </CAProfileCard>
        </View>

        {/* 🔹 Revenue & Bookings Chart */}
        <CAProfileCard style={styles.chartCard}>
          <View style={styles.chartTitleRow}>
            <Text style={styles.chartTitle}>Revenue & Bookings</Text>
            <Text style={styles.chartDate}>{getChartDate()}</Text>
          </View>
          <BarChart
            data={{
              labels: getChartLabels(),
              datasets: [
                {
                  data: activeTab === "Daily" ? [data.dailyBookings] :
                        activeTab === "Weekly" ? data.weeklyBookings :
                        activeTab === "Monthly" ? data.monthlyBookings :
                        data.yearlyBookings,
                  color: (opacity = 1) => `rgba(56, 198, 244, ${opacity})`, // Cyan for Bookings
                  strokeWidth: 2,
                },
                {
                  data: activeTab === "Daily" ? [data.dailyRevenue / 1000] :
                        activeTab === "Weekly" ? data.weeklyRevenue.map(r => r / 1000) :
                        activeTab === "Monthly" ? data.monthlyRevenue.map(r => r / 1000) :
                        data.yearlyRevenue.map(r => r / 1000),
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for Revenue
                  strokeWidth: 2,
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: Colors.background,
              backgroundGradientFrom: Colors.background,
              backgroundGradientTo: Colors.background,
              barPercentage: 0.2,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#fff",
              },
            }}
            style={styles.chart}
            fromZero
            showBarTops={false}
            verticalLabelRotation={-45} // Rotate labels to prevent overlap
          />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.legendText}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primaryAlt }]} />
              <Text style={styles.legendText}>Bookings</Text>
            </View>
          </View>
          <View style={styles.statsInfo}>
            <View style={styles.statsInfoItem}>
              <Text style={styles.statsInfoLabel}>Total Revenue</Text>
              <Text style={styles.statsInfoValue}>₹{data.revenue}</Text>
            </View>
            <View style={styles.statsInfoItem}>
              <Text style={styles.statsInfoLabel}>Avg per Booking</Text>
              <Text style={styles.statsInfoValue}>{Math.round(data.totalBookings / 7)}</Text>
            </View>
            <View style={styles.statsInfoItem}>
              <Text style={styles.statsInfoLabel}>Highest Day</Text>
              <Text style={styles.statsInfoValue}>{Math.max(...data.weeklyBookings)}</Text>
            </View>
          </View>
        </CAProfileCard>

        {/* 🔹 Peak vs Low Hours */}
        <CAProfileCard style={styles.chartCard}>
          <View style={styles.chartTitleRow}>
            <Text style={styles.chartTitle}>Peak vs Low Hours</Text>
            <Text style={styles.chartDate}>{getChartDate()}</Text>
          </View>
          <BarChart
            data={{
              labels: getHourLabels(),
              datasets: [
                {
                  data: data.peakHours,
                  color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Orange for Peak
                  strokeWidth: 2,
                },
                {
                  data: data.lowHours,
                  color: (opacity = 1) => `rgba(56, 198, 244, ${opacity})`, // Cyan for Low
                  strokeWidth: 2,
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: Colors.background,
              backgroundGradientFrom: Colors.background,
              backgroundGradientTo: Colors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
            fromZero
            showBarTops={false}
            verticalLabelRotation={-45} // Rotate labels to prevent overlap
          />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#FFA500" }]} />
              <Text style={styles.legendText}>Peak Hours</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primaryAlt }]} />
              <Text style={styles.legendText}>Low Hours</Text>
            </View>
          </View>
          <View style={styles.statsInfo}>
            <View style={styles.statsInfoItem}>
              <Text style={styles.statsInfoLabel}>Peak Hours</Text>
              <Text style={styles.statsInfoValue}>6-9 PM</Text>
            </View>
            <View style={styles.statsInfoItem}>
              <Text style={styles.statsInfoLabel}>Low Hours</Text>
              <Text style={styles.statsInfoValue}>10AM-12PM</Text>
            </View>
          </View>
        </CAProfileCard>

        {/* 🔹 Most Booked Courts */}
        <CAProfileCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Most Booked Courts</Text>
          {data.mostBookedCourts.map((court, index) => (
            <View key={index} style={[
              styles.courtItem,
              court.bookings >= 50 ? styles.courtItemPink : styles.courtItemGray
            ]}>
              <Text style={styles.courtRank}>{index + 1}</Text>
              <Text style={styles.courtName}>{court.name}</Text>
              <Text style={styles.courtBookings}>{court.bookings} bookings</Text>
            </View>
          ))}
        </CAProfileCard>

        {/* 🔹 Player Activity Trends */}
        <CAProfileCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Player Activity Trends</Text>
          {data.playerActivityTrends.map((player, index) => (
            <View key={index} style={styles.playerItem}>
              <Text style={styles.playerRank}>{index + 1}</Text>
              <Text style={[
                styles.playerName,
                player.matches >= 15 ? styles.playerNamePink : styles.playerNameGray
              ]}>
                {player.name}
              </Text>
              <Text style={[
                styles.playerMatches,
                player.matches >= 15 ? styles.playerMatchesPink : styles.playerMatchesGray
              ]}>
                {player.matches} matches
              </Text>
            </View>
          ))}
        </CAProfileCard>
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
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
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
  dropdown: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    marginBottom: 12,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
  dropdownText: {
    fontSize: 16,
    color: '#fff',
  },
  dropdownList: {
    backgroundColor: Colors.background,
    borderColor: '#444',
  },
  dropdownItem: {
    backgroundColor: Colors.background,
    borderBottomColor: '#444',
  },
  itemTextStyle: {
    color: '#fff',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(56, 198, 244, 0.2)',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: Colors.background,
    color: '#fff',
    borderColor: '#444',
    borderRadius: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
  },
  statContent: {
    alignItems: "center",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: "#fff",
  },
  statIcon: {
    fontSize: 16,
    color: "#38C6F4",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  chartTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  chartDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingLeft: 0
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#fff",
  },
  statsInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  statsInfoItem: {
    alignItems: "center",
  },
  statsInfoLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  statsInfoValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  courtItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  courtItemPink: {
    backgroundColor: "rgba(238, 60, 121, 0.2)",
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  courtItemGray: {
    backgroundColor: "rgba(107, 114, 128, 0.2)",
    borderColor: "#6B7280",
    borderWidth: 1,
  },
  courtRank: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    width: 24,
    textAlign: "center",
  },
  courtName: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
    marginLeft: 12,
  },
  courtBookings: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "right",
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  playerRank: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    width: 24,
    textAlign: "center",
  },
  playerName: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
    marginLeft: 12,
  },
  playerNamePink: {
    color: Colors.primary,
  },
  playerNameGray: {
    color: "#6B7280",
  },
  playerMatches: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "right",
  },
  playerMatchesPink: {
    color: Colors.primary,
  },
  playerMatchesGray: {
    color: "#6B7280",
  },
});