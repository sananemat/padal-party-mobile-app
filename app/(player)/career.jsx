import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart } from "react-native-chart-kit";
import { BlurView } from "expo-blur";
import ThemedView from "../../components/ThemedView";
import { CAProfileCard } from "../../components/CAProfileCard";
import Spacer from "../../components/Spacer";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Sample Data
const PLAYER_DATA = {
  name: "Alex Rodriguez",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  age: 28,
  position: "Right Side",
  rating: 92,
  matches: 47,
  won: 34,
  winRate: 72,
  racket: "Babolat Viper",
};

const TABS = [
  { id: "statistics", label: "Career Statistics" },
  { id: "performance", label: "Performance" },
  { id: "history", label: "Match History" },
  { id: "teams", label: "My Teams" },
  { id: "tournaments", label: "Tournaments" },
  { id: "badges", label: "Badges" },
];

const SAMPLE_TEAMS = [
  {
    id: 1,
    name: "Alex & Mike",
    partner: "Mike Chen",
    rating: 85,
    matches: 24,
    wins: 18,
    losses: 6,
    winRate: 75,
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    partnerImage: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: 2,
    name: "Alex & James",
    partner: "James Wilson",
    rating: 79,
    matches: 18,
    wins: 12,
    losses: 6,
    winRate: 67,
    image: "https://randomuser.me/api/portraits/men/35.jpg",
    partnerImage: "https://randomuser.me/api/portraits/men/36.jpg",
  },
];

const SAMPLE_TOURNAMENTS = [
  {
    id: 1,
    name: "Summer Championship",
    club: "Elite Padel Club",
    location: "Islamabad",
    date: "2024-12-16",
    status: "WINNER",
    partner: "Mike Chen",
    partnerImage: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: 2,
    name: "Winter Championship",
    club: "Zalmi Padel Master",
    location: "Peshawar",
    date: "2023-02-28",
    status: "Loser",
    partner: "Ali Wali",
    partnerImage: "https://randomuser.me/api/portraits/men/37.jpg",
  },
];

const SAMPLE_MATCHES = [
  {
    id: 1,
    date: "2023-12-16",
    time: "2:30 PM",
    venue: "Tennis Club Central",
    team1: {
      players: [
        { name: "Alex", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "James", image: "https://randomuser.me/api/portraits/men/36.jpg" },
      ],
      rating: 79,
      matches: 18,
    },
    team2: {
      players: [
        { name: "Alex", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Mike", image: "https://randomuser.me/api/portraits/men/34.jpg" },
      ],
      rating: 85,
      matches: 34,
    },
    result: "WIN",
    score: "Set points: 4-6",
    ratingPoints: 7.5,
  },
  {
    id: 2,
    date: "2024-12-16",
    time: "2:30 PM",
    venue: "Tennis Club Central",
    team1: {
      players: [
        { name: "Alex", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "James", image: "https://randomuser.me/api/portraits/men/36.jpg" },
      ],
      rating: 79,
      matches: 18,
    },
    team2: {
      players: [
        { name: "Alex", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Mike", image: "https://randomuser.me/api/portraits/men/34.jpg" },
      ],
      rating: 85,
      matches: 34,
    },
    result: "WIN",
    score: "Set points: 4-6",
    ratingPoints: 7.5,
  },
  {
    id: 3,
    date: "2024-12-16",
    time: "2:30 PM",
    venue: "Tennis Club Central",
    team1: {
      players: [
        { name: "Alex", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "James", image: "https://randomuser.me/api/portraits/men/36.jpg" },
      ],
      rating: 79,
      matches: 18,
    },
    team2: {
      players: [
        { name: "Alex", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Mike", image: "https://randomuser.me/api/portraits/men/34.jpg" },
      ],
      rating: 85,
      matches: 34,
    },
    result: "LOSS",
    score: "Set points: 4-6",
    ratingPoints: 7.5,
  },
];

const BADGES = [
  { id: 1, name: "First Serve", icon: "🎯" },
  { id: 2, name: "Off The Muck", icon: "🏆" },
  { id: 3, name: "Daily Grinder", icon: "🎁" },
  { id: 4, name: "Bagel Time", icon: "⭕" },
  { id: 5, name: "Night Owl", icon: "🌙" },
  { id: 6, name: "Comeback King", icon: "👑" },
  { id: 7, name: "Social Butterfly", icon: "🦋" },
  { id: 8, name: "Straight Shooter", icon: "🎯" },
  { id: 9, name: "Clutch Finisher", icon: "💣" },
  { id: 10, name: "Rising Star", icon: "⭐" },
  { id: 11, name: "Padel Tourist", icon: "📍" },
  { id: 12, name: "Streak Master I", icon: "⭕" },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function formatYear(dateStr) {
  return new Date(dateStr).getFullYear();
}

// Static chart data object for both graphs
const CHART_DATA = {
  progress: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [65, 70, 75, 78, 82, 85] }],
  },
  monthly: {
    labels: ["J", "F", "M", "A", "M", "J"],
    datasets: [{ data: [15, 20, 28, 32, 38, 30] }],
  },
};

export default function Career() {
  const [activeTab, setActiveTab] = useState("statistics");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [expandedChart, setExpandedChart] = useState(null);
  const [searchMatch, setSearchMatch] = useState("");
  const [searchTournament, setSearchTournament] = useState("");
  const [tournamentFilter, setTournamentFilter] = useState("All");
  const scrollViewRef = useRef(null);

  const chartConfig = {
    backgroundGradientFrom: "#0E1340",
    backgroundGradientTo: "#0E1340",
    color: (opacity = 1) => `rgba(56, 198, 244, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.6,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#1F2937",
      strokeDasharray: "0",
    },
    propsForLabels: {
      fill: "#9CA3AF",
      fontSize: 12,
    },
  };

  const barChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(238, 60, 121, ${opacity})`,
  };

  // --- FILTERS ---
  const filteredMatches = SAMPLE_MATCHES.filter(
    (m) =>
      m.team1.players.some((p) => p.name.toLowerCase().includes(searchMatch.toLowerCase())) ||
      m.team2.players.some((p) => p.name.toLowerCase().includes(searchMatch.toLowerCase())) ||
      m.venue.toLowerCase().includes(searchMatch.toLowerCase()) ||
      formatDate(m.date).toLowerCase().includes(searchMatch.toLowerCase())
  );

  let filteredTournaments = SAMPLE_TOURNAMENTS;
  if (tournamentFilter !== "All") {
    if (tournamentFilter === "Winners") {
      filteredTournaments = filteredTournaments.filter((t) => t.status === "WINNER");
    } else if (["2024", "2023"].includes(tournamentFilter)) {
      filteredTournaments = filteredTournaments.filter((t) => formatYear(t.date) === Number(tournamentFilter));
    }
  }
  if (searchTournament.trim()) {
    filteredTournaments = filteredTournaments.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTournament.toLowerCase()) ||
        t.club.toLowerCase().includes(searchTournament.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTournament.toLowerCase())
    );
  }

  // --- UI ---
  const renderPlayerCard = () => (
    <LinearGradient
      colors={["#0E1340", "#3C54A5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.playerCard}
    >
      <View style={styles.playerHeader}>
        <Image source={{ uri: PLAYER_DATA.image }} style={styles.playerAvatar} />
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{PLAYER_DATA.name}</Text>
          <Text style={styles.playerMeta}>
            Age {PLAYER_DATA.age} • {PLAYER_DATA.position}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{PLAYER_DATA.rating}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{PLAYER_DATA.matches}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{PLAYER_DATA.won}</Text>
          <Text style={styles.statLabel}>Won</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{PLAYER_DATA.winRate}%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
      </View>
      <Text style={styles.racketText}>Racket: {PLAYER_DATA.racket}</Text>
    </LinearGradient>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContent}
    >
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );

  // --- STATISTICS ---
  const renderStatistics = () => (
    <View>
      <Text style={styles.sectionTitle}>Overall Statistics</Text>
      <View style={styles.statsGrid}>
        <CAProfileCard style={styles.statCard}>
          <View style={styles.statCardIconRow}>
            <MaterialCommunityIcons name="trophy" size={22} color="#EE3C79" />
            <Text style={styles.statCardLabel}>Rating</Text>
          </View>
          <Text style={styles.statCardValue}>92</Text>
        </CAProfileCard>
        <CAProfileCard style={styles.statCard}>
          <View style={styles.statCardIconRow}>
            <MaterialCommunityIcons name="gamepad-variant" size={22} color="#EE3C79" />
            <Text style={styles.statCardLabel}>Matches</Text>
          </View>
          <Text style={styles.statCardValue}>47</Text>
        </CAProfileCard>
        <CAProfileCard style={styles.statCard}>
          <View style={styles.statCardIconRow}>
            <MaterialCommunityIcons name="check-circle" size={22} color="#10B981" />
            <Text style={styles.statCardLabel}>Won</Text>
          </View>
          <Text style={styles.statCardValue}>34</Text>
        </CAProfileCard>
        <CAProfileCard style={styles.statCard}>
          <View style={styles.statCardIconRow}>
            <MaterialCommunityIcons name="close-circle" size={22} color="#EF4444" />
            <Text style={styles.statCardLabel}>Lost</Text>
          </View>
          <Text style={styles.statCardValue}>13</Text>
        </CAProfileCard>
        <CAProfileCard style={styles.statCard}>
          <View style={styles.statCardIconRow}>
            <MaterialCommunityIcons name="layers" size={22} color="#EE3C79" />
            <Text style={styles.statCardLabel}>Sets</Text>
          </View>
          <Text style={styles.statCardValue}>89 / 45</Text>
          <Text style={styles.statCardSubLabel}>Won / Lost</Text>
        </CAProfileCard>
        <CAProfileCard style={styles.statCard}>
          <View style={styles.statCardIconRow}>
            <MaterialCommunityIcons name="dice-multiple" size={22} color="#EE3C79" />
            <Text style={styles.statCardLabel}>Games</Text>
          </View>
          <Text style={styles.statCardValue}>567 / 398</Text>
          <Text style={styles.statCardSubLabel}>Won / Lost</Text>
        </CAProfileCard>
      </View>
      <Spacer height={20} />
      <Text style={styles.sectionTitle}>Highlights</Text>
      <CAProfileCard style={styles.highlightCard}>
        <Text style={styles.highlightTitle}>Matches Played</Text>
        <View style={styles.highlightRow}>
          <Text style={styles.highlightLabel}>Single Set</Text>
          <Text style={styles.highlightValue}>
            W12 / <Text style={styles.lossText}>L5</Text>
          </Text>
        </View>
        <View style={styles.highlightRow}>
          <Text style={styles.highlightLabel}>Best of 3</Text>
          <Text style={styles.highlightValue}>
            W7 / <Text style={styles.lossText}>L4</Text>
          </Text>
        </View>
        <View style={styles.highlightRow}>
          <Text style={styles.highlightLabel}>Race of 9</Text>
          <Text style={styles.highlightValue}>
            W5 / <Text style={styles.lossText}>L3</Text>
          </Text>
        </View>
      </CAProfileCard>
      <CAProfileCard style={styles.clubCard}>
        <View style={styles.clubRow}>
          <View>
            <Text style={styles.clubLabel}>Most Played Club</Text>
            <Text style={styles.clubSubLabel}>Padel House</Text>
          </View>
          <Text style={styles.clubTimes}>21 Times</Text>
        </View>
      </CAProfileCard>
      <CAProfileCard style={styles.partnerCard}>
        <Text style={styles.highlightTitle}>Biggest Win</Text>
        <View style={styles.biggestWinContainer}>
          <View style={styles.teamSection}>
            <Text style={styles.teamLabel}>Partner Name</Text>
            <View style={styles.playerRowCentered}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={styles.smallAvatar} />
              <Text style={styles.playerNameSmall}>Emma Wilson</Text>
            </View>
          </View>
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.teamSection}>
            <Text style={styles.teamLabel}>Opponent Name</Text>
            <View style={styles.playerRowCentered}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }} style={styles.smallAvatar} />
              <Text style={styles.playerNameSmall}>Carlos Mendez</Text>
            </View>
            <View style={styles.playerRowCentered}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/46.jpg" }} style={styles.smallAvatar} />
              <Text style={styles.playerNameSmall}>Mike Johnson</Text>
            </View>
          </View>
        </View>
      </CAProfileCard>
      <CAProfileCard style={styles.partnerCard}>
        <View style={styles.partnerRowCard}>
          <View style={styles.partnerIconText}>
            <MaterialCommunityIcons name="account-group" size={22} color="#38C6F4" style={{ marginRight: 2 }} />
            <View>
              <Text style={styles.partnerLabel}>Most Played Partner</Text>
              <Text style={styles.partnerSubLabel}>12 matches together</Text>
            </View>
          </View>
          <View style={styles.partnerRight}>
            <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={styles.smallAvatar} />
            <Text style={styles.playerNameSmall}>Emma Wilson</Text>
          </View>
        </View>
      </CAProfileCard>
      <CAProfileCard style={styles.partnerCard}>
        <View style={styles.partnerRowCard}>
          <View style={styles.partnerIconText}>
            <MaterialCommunityIcons name="account-question" size={22} color="#EE3C79" style={{ marginRight: 2 }} />
            <View>
              <Text style={styles.partnerLabel}>Most Played Opponent</Text>
              <Text style={styles.partnerSubLabel}>8 matches played</Text>
            </View>
          </View>
          <View style={styles.partnerRight}>
            <Image source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }} style={styles.smallAvatar} />
            <Text style={styles.playerNameSmall}>Carlos Mendez</Text>
          </View>
        </View>
      </CAProfileCard>
    </View>
  );

  // --- PERFORMANCE ---
  const renderPerformance = () => (
    <View>
      <CAProfileCard>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Career Progress Graph</Text>
          <TouchableOpacity style={styles.fullViewButton} onPress={() => setExpandedChart("progress")}>
            <Text style={styles.fullViewText}>Full View</Text>
            <Ionicons name="chevron-down" size={16} color="#38C6F4" />
          </TouchableOpacity>
        </View>
        <LineChart
          data={CHART_DATA.progress}
          width={SCREEN_WIDTH - 80}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero
        />
      </CAProfileCard>
      <CAProfileCard>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Monthly Performance Tracker</Text>
          <TouchableOpacity style={styles.fullViewButton} onPress={() => setExpandedChart("monthly")}>
            <Text style={styles.fullViewText}>Full View</Text>
            <Ionicons name="chevron-down" size={16} color="#38C6F4" />
          </TouchableOpacity>
        </View>
        <BarChart
          data={CHART_DATA.monthly}
          width={SCREEN_WIDTH - 80}
          height={220}
          chartConfig={barChartConfig}
          style={styles.chart}
          withInnerLines={false}
          showValuesOnTopOfBars
          fromZero
        />
      </CAProfileCard>
    </View>
  );

  // --- MATCH HISTORY ---
  const renderMatchHistory = () => (
    <View>
      <CAProfileCard style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by date & player name"
            placeholderTextColor="#6B7280"
            value={searchMatch}
            onChangeText={setSearchMatch}
          />
        </View>
      </CAProfileCard>
      {filteredMatches.map((match) => (
        <CAProfileCard key={match.id} style={styles.matchCard}>
          <Text style={styles.matchDate}>
            {formatDate(match.date)}, {match.time}
          </Text>
          <Text style={styles.matchVenue}>{match.venue}</Text>
          <View style={styles.matchContent}>
            <View style={styles.matchTeam}>
              <View style={styles.teamAvatars}>
                {match.team1.players.map((p, idx) => (
                  <Image
                    key={p.name}
                    source={{ uri: p.image }}
                    style={[
                      styles.matchAvatar,
                      idx > 0 && styles.matchAvatarOverlap,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.teamNames}>
                {match.team1.players.map((p) => p.name).join(" & ")}
              </Text>
              <Text style={styles.teamRating}>
                Rating: {match.team1.rating} • {match.team1.matches} matches
              </Text>
            </View>
            <Text style={styles.vsTextLarge}>VS</Text>
            <View style={styles.matchTeam}>
              <View style={styles.teamAvatars}>
                {match.team2.players.map((p, idx) => (
                  <Image
                    key={p.name}
                    source={{ uri: p.image }}
                    style={[
                      styles.matchAvatar,
                      idx > 0 && styles.matchAvatarOverlap,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.teamNames}>
                {match.team2.players.map((p) => p.name).join(" & ")}
              </Text>
              <Text style={styles.teamRating}>
                Rating: {match.team2.rating} • {match.team2.matches} matches
              </Text>
            </View>
          </View>
          <View style={styles.matchFooter}>
            <View
              style={[
                styles.resultBadge,
                match.result === "WIN" ? styles.winBadge : styles.lossBadge,
              ]}
            >
              <Text style={styles.resultText}>{match.result}</Text>
            </View>
            <Text style={styles.scoreText}>{match.score}</Text>
            <View
              style={[
                styles.ratingPointsBadge,
                match.result === "WIN" ? styles.ratingWin : styles.ratingLoss,
              ]}
            >
              <Text style={styles.ratingPointsText}>
                Rating Points: {match.ratingPoints}
              </Text>
            </View>
          </View>
        </CAProfileCard>
      ))}
    </View>
  );

  // --- MY TEAMS ---
  const renderMyTeams = () => (
    <View>
      {SAMPLE_TEAMS.map((team) => (
        <TouchableOpacity key={team.id} onPress={() => setSelectedTeam(team)}>
          <CAProfileCard style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={styles.teamAvatars}>
                <Image source={{ uri: team.image }} style={styles.matchAvatar} />
                <Image source={{ uri: team.partnerImage }} style={[styles.matchAvatar, styles.matchAvatarOverlap]} />
              </View>
              <View style={styles.teamHeaderInfo}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamMeta}>
                  Rating: {team.rating} • {team.matches} matches
                </Text>
              </View>
              <View style={styles.ratingCircle}>
                <Text style={styles.ratingCircleText}>{team.rating}</Text>
                <Text style={styles.ratingCircleLabel}>Rating</Text>
              </View>
            </View>
          </CAProfileCard>
        </TouchableOpacity>
      ))}
    </View>
  );

  // --- TOURNAMENTS ---
  const renderTournaments = () => (
    <View>
      <CAProfileCard style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tournaments..."
            placeholderTextColor="#6B7280"
            value={searchTournament}
            onChangeText={setSearchTournament}
          />
          <Ionicons name="filter" size={20} color="#38C6F4" />
        </View>
      </CAProfileCard>
      <View style={styles.filterChips}>
        {["All", "2024", "2023", "Winners"].map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[
              styles.chip,
              tournamentFilter === chip && styles.chipActive,
            ]}
            onPress={() => setTournamentFilter(chip)}
          >
            <Text
              style={[
                styles.chipText,
                tournamentFilter === chip && styles.chipTextActive,
              ]}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {filteredTournaments.map((tournament) => (
        <TouchableOpacity key={tournament.id} onPress={() => setSelectedTournament(tournament)}>
          <CAProfileCard style={styles.tournamentCard}>
            <View style={styles.tournamentHeader}>
              <View style={styles.tournamentIcon}>
                <Ionicons name="trophy" size={24} color="#EE3C79" />
              </View>
              <View style={styles.tournamentInfo}>
                <Text style={styles.tournamentName}>{tournament.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                  <Text style={styles.tournamentMeta}>{tournament.club}</Text>
                  <Ionicons name="location" size={14} color="#38C6F4" style={{ marginLeft: 8, marginRight: 2 }} />
                  <Text style={styles.tournamentLocation}>{tournament.location}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.winnerBadge,
                  tournament.status === "WINNER"
                    ? styles.winnerBadgeWin
                    : styles.winnerBadgeLoss,
                ]}
              >
                <Text style={styles.winnerText}>{tournament.status}</Text>
                <Text style={styles.tournamentDateBadge}>{formatDate(tournament.date)}</Text>
              </View>
            </View>
            <View style={styles.organizerRow}>
              <Image source={{ uri: tournament.partnerImage }} style={styles.organizerAvatar} />
              <Text style={styles.organizerName}>{tournament.partner}</Text>
            </View>
          </CAProfileCard>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.loadMoreButton}>
        <Text style={styles.loadMoreText}>Load More Tournaments</Text>
      </TouchableOpacity>
    </View>
  );

  // --- BADGES ---
  const renderBadges = () => (
    <View style={styles.badgesGrid}>
      {BADGES.map((badge) => (
        <CAProfileCard key={badge.id} style={styles.badgeCard}>
          <Text style={styles.badgeIcon}>{badge.icon}</Text>
          <Text style={styles.badgeName}>{badge.name}</Text>
        </CAProfileCard>
      ))}
    </View>
  );

  // --- MODALS ---
  const renderTeamStatsModal = () => (
    <Modal
      visible={!!selectedTeam}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedTeam(null)}
    >
      <View style={styles.modalRoot}>
        <TouchableWithoutFeedback onPress={() => setSelectedTeam(null)}>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={70}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Team Stats</Text>
            <TouchableOpacity onPress={() => setSelectedTeam(null)}>
              <Ionicons name="close" size={24} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.teamStatsHeader}>
            <View style={styles.teamAvatars}>
              <Image source={{ uri: selectedTeam.image }} style={styles.largeAvatar} />
              <Image source={{ uri: selectedTeam.partnerImage }} style={[styles.largeAvatar, { marginLeft: -15 }]} />
            </View>
            <View style={styles.teamStatsInfo}>
              <Text style={styles.teamStatsName}>{selectedTeam.name}</Text>
              <Text style={styles.teamStatsLabel}>Team Partners</Text>
            </View>
            <View style={styles.ratingCircleLarge}>
              <Text style={styles.ratingCircleTextLarge}>{selectedTeam.rating}</Text>
              <Text style={styles.ratingLabel}>Rating</Text>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View style={styles.statsQuickViewGrid}>
              <View style={styles.quickStatCard}>
                <Text style={styles.quickStatValue}>{selectedTeam.matches}</Text>
                <Text style={styles.quickStatLabel}>Total Matches</Text>
              </View>
              <View style={styles.quickStatCard}>
                <Text style={[styles.quickStatValue, {color:"#38C6F4"}]}>{selectedTeam.wins}</Text>
                <Text style={styles.quickStatLabel}>Wins</Text>
              </View>
              <View style={styles.quickStatCard}>
                <Text style={[styles.quickStatValue, {color:"#EE3C79"}]}>{selectedTeam.losses}</Text>
                <Text style={styles.quickStatLabel}>Losses</Text>
              </View>
              <View style={styles.quickStatCard}>
                <Text style={styles.quickStatValue}>{selectedTeam.winRate}%</Text>
                <Text style={styles.quickStatLabel}>Win Rate</Text>
              </View>
            </View>
            <Text style={styles.highlightTitle}>Highlights</Text>
            <CAProfileCard style={styles.modalHighlightCard}>
              <Text style={[styles.highlightTitle, { marginBottom: 8 }]}>Matches Played</Text>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Single Set</Text>
                <Text style={styles.highlightValue}>
                  W12 / <Text style={styles.lossText}>L5</Text>
                </Text>
              </View>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Best of 3</Text>
                <Text style={styles.highlightValue}>
                  W7 / <Text style={styles.lossText}>L4</Text>
                </Text>
              </View>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Race of 9</Text>
                <Text style={styles.highlightValue}>
                  W5 / <Text style={styles.lossText}>L3</Text>
                </Text>
              </View>
            </CAProfileCard>
            <CAProfileCard style={styles.modalClubCard}>
              <View style={styles.clubRow}>
                <View>
                  <Text style={styles.clubLabel}>Most Played Club</Text>
                  <Text style={styles.clubSubLabel}>Padel House</Text>
                </View>
                <Text style={styles.clubTimes}>21 Times</Text>
              </View>
            </CAProfileCard>
            <View style={{ flexDirection: "row", marginBottom: 12, marginHorizontal: 2 }}>
              <CAProfileCard style={[styles.modalPartnerCard, { flex: 1, marginRight: 4, padding: 0 }]}>
                <View style={{ padding: 12 }}>
                  <Text style={[styles.teamLabel, { color: "#fff", marginBottom: 4 }]}>Partner Name</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 0 }}>
                    <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={styles.smallAvatar} />
                    <Text style={styles.playerNameSmall}>Emma Wilson</Text>
                  </View>
                </View>
              </CAProfileCard>
              <View style={{ justifyContent: "center", alignItems: "center", width: 40 }}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              <CAProfileCard style={[styles.modalPartnerCard, { flex: 1, marginLeft: 4, padding: 0 }]}>
                <View style={{ padding: 12 }}>
                  <Text style={[styles.teamLabel, { color: "#fff", marginBottom: 4 }]}>Opponent Name</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 0 }}>
                    <Image source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }} style={styles.smallAvatar} />
                    <Text style={styles.playerNameSmall}>Carlos Mendez</Text>
                  </View>
                </View>
              </CAProfileCard>
            </View>
            <CAProfileCard style={styles.modalPartnerCard}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialCommunityIcons name="account-group" size={22} color="#38C6F4" style={{ marginRight: 8 }} />
                  <View>
                    <Text style={styles.partnerLabel}>Most Played Partner</Text>
                    <Text style={styles.partnerSubLabel}>12 matches together</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={styles.smallAvatar} />
                  <Text style={styles.playerNameSmall}>Emma Wilson</Text>
                </View>
              </View>
            </CAProfileCard>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderTournamentModal = () => (
    <Modal
      visible={!!selectedTournament}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedTournament(null)}
    >
      <View style={styles.modalRoot}>
      <TouchableWithoutFeedback onPress={() => setSelectedTournament(null)}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={70}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback> */}
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Match History</Text>
                <TouchableOpacity onPress={() => setSelectedTournament(null)}>
                  <Ionicons name="close" size={24} color="#fff" style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
              
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {filteredMatches.map((match) => (
                  <CAProfileCard key={match.id} style={styles.matchCard}>
                    <Text style={styles.matchDate}>
                      {formatDate(match.date)}, {match.time}
                    </Text>
                    <Text style={styles.matchVenue}>{match.venue}</Text>
                    <View style={styles.matchContent}>
                      <View style={styles.matchTeam}>
                        <View style={styles.teamAvatars}>
                          {match.team1.players.map((p, idx) => (
                            <Image
                              key={p.name}
                              source={{ uri: p.image }}
                              style={[
                                styles.matchAvatar,
                                idx > 0 && styles.matchAvatarOverlap,
                              ]}
                            />
                          ))}
                        </View>
                        <Text style={styles.teamNames}>
                          {match.team1.players.map((p) => p.name).join(" & ")}
                        </Text>
                        <Text style={styles.teamRating}>
                          Rating: {match.team1.rating} • {match.team1.matches} matches
                        </Text>
                      </View>
                      <Text style={styles.vsTextLarge}>VS</Text>
                      <View style={styles.matchTeam}>
                        <View style={styles.teamAvatars}>
                          {match.team2.players.map((p, idx) => (
                            <Image
                              key={p.name}
                              source={{ uri: p.image }}
                              style={[
                                styles.matchAvatar,
                                idx > 0 && styles.matchAvatarOverlap,
                              ]}
                            />
                          ))}
                        </View>
                        <Text style={styles.teamNames}>
                          {match.team2.players.map((p) => p.name).join(" & ")}
                        </Text>
                        <Text style={styles.teamRating}>
                          Rating: {match.team2.rating} • {match.team2.matches} matches
                        </Text>
                      </View>
                    </View>
                    <View style={styles.matchFooter}>
                      <View
                        style={[
                          styles.resultBadge,
                          match.result === "WIN" ? styles.winBadge : styles.lossBadge,
                        ]}
                      >
                        <Text style={styles.resultText}>{match.result}</Text>
                      </View>
                      <Text style={styles.scoreText}>{match.score}</Text>
                      <View
                        style={[
                          styles.ratingPointsBadge,
                          match.result === "WIN" ? styles.ratingWin : styles.ratingLoss,
                        ]}
                      >
                        <Text style={styles.ratingPointsText}>
                          Rating Points: {match.ratingPoints}
                        </Text>
                      </View>
                    </View>
                  </CAProfileCard>
                ))}
              </ScrollView>
            </View>
          {/* </TouchableWithoutFeedback> */}
        {/* </BlurView>
      </TouchableWithoutFeedback> */}
      </View>
    </Modal>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "statistics":
        return renderStatistics();
      case "performance":
        return renderPerformance();
      case "history":
        return renderMatchHistory();
      case "teams":
        return renderMyTeams();
      case "tournaments":
        return renderTournaments();
      case "badges":
        return renderBadges();
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      {renderPlayerCard()}
        <Spacer height={16} /> 
        {renderTabs()}
        <Spacer height={16} />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {renderContent()}
        <Spacer height={50} />
      </ScrollView>
      {selectedTeam && renderTeamStatsModal()}
      {selectedTournament && renderTournamentModal()}
      {expandedChart && (
        <Modal
          visible={!!expandedChart}
          transparent
          animationType="fade"
          onRequestClose={() => setExpandedChart(null)}
        >
          <TouchableWithoutFeedback onPress={() => setExpandedChart(null)}>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={70}
              tint="dark"
              style={styles.modalOverlay}
            >
              <TouchableWithoutFeedback>
                <View style={styles.chartModalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {expandedChart === "progress"
                        ? "Career Progress Graph"
                        : "Monthly Performance Tracker"}
                    </Text>
                    <TouchableOpacity onPress={() => setExpandedChart(null)}>
                      <Ionicons name="close" size={24} color="#fff" style={styles.closeIcon} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.expandedChartContainer}>
                    {expandedChart === "progress" ? (
                      <LineChart
                        data={CHART_DATA.progress}
                        width={SCREEN_WIDTH - 60}
                        height={400}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.expandedChart}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        fromZero
                        segments={5}
                      />
                    ) : (
                      <BarChart
                        data={CHART_DATA.monthly}
                        width={SCREEN_WIDTH - 60}
                        height={400}
                        chartConfig={barChartConfig}
                        style={styles.expandedChart}
                        withInnerLines={false}
                        showValuesOnTopOfBars
                        fromZero
                      />
                    )}
                  </View>
                  <View style={styles.chartLegend}>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          {
                            backgroundColor:
                              expandedChart === "progress"
                                ? "#38C6F4"
                                : "#EE3C79",
                          },
                        ]}
                      />
                      <Text style={styles.legendText}>
                        {expandedChart === "progress"
                          ? "Monthly"
                          : "Yearly"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </BlurView>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
  },
  playerCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  playerMeta: {
    fontSize: 14,
    color: "#cbd5e6",
  },
  ratingBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  ratingText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#cbd5e6",
  },
  racketText: {
    fontSize: 14,
    color: "#cbd5e6",
    textAlign: "center",
  },
  tabsContainer: {
    marginVertical: 8,
  },
  tabsContent: {
    paddingHorizontal: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  tabActive: {
    backgroundColor: "#EE3C79",
    borderColor: "#EE3C79",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    alignItems: "flex-start",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#10174A",
    borderRadius: 16,
  },
  statCardIconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  statCardLabel: {
    fontSize: 14,
    color: "#fff",
    textAlign: "left",
    fontWeight: "500",
  },
  statCardSubLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "left",
    marginTop: 2,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  highlightCard: {
    backgroundColor: "#10174A",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
  },
  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  highlightLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  highlightValue: {
    fontSize: 14,
    color: "#38C6F4",
    fontWeight: "600",
  },
  lossText: {
    color: "#EF4444",
  },
  clubCard: {
    marginTop: 8,
    backgroundColor: "#10174A",
    borderRadius: 16,
    padding: 16,
  },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clubLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 2,
  },
  clubSubLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  clubTimes: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  partnerCard: {
    marginTop: 8,
    backgroundColor: "#10174A",
    borderRadius: 16,
    padding: 14,
  },
  biggestWinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: 8,
    gap: 8,
  },
  teamSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  teamLabel: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 8,
    alignSelf: "center",
  },
  playerRowCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#232A4D",
  },
  playerNameSmall: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    alignSelf: "center",
  },
  vsContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: {
    fontSize: 16,
    color: "#EE3C79",
    fontWeight: "700",
    textAlign: "center",
  },
  partnerRowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#10174A",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
    gap: 8,
  },
  partnerRowCardModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#10174A",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  partnerIconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  partnerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  partnerLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  partnerSubLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  fullViewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#38C6F4",
  },
  fullViewText: {
    fontSize: 12,
    color: "#38C6F4",
    marginRight: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  searchCard: {
    marginBottom: 8,
    backgroundColor: "#10174A",
    borderRadius: 16,
    padding: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  matchCard: {
    marginBottom: 12,
    backgroundColor: "#10174A",
    borderRadius: 16,
    padding: 16,
  },
  matchDate: {
    fontSize: 12,
    color: "#38C6F4",
    marginBottom: 4,
  },
  matchVenue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 12,
  },
  matchContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  matchTeam: {
    flex: 1,
    alignItems: "center",
  },
  teamAvatars: {
    flexDirection: "row",
    marginBottom: 8,
  },
  matchAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#232A4D",
  },
  matchAvatarOverlap: {
    marginLeft: -10,
  },
  teamNames: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  teamRating: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  vsTextLarge: {
    fontSize: 18,
    color: "#EE3C79",
    fontWeight: "700",
    marginHorizontal: 12,
  },
  matchFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    gap: 8,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  winBadge: {
    backgroundColor: "#38C6F4",
  },
  lossBadge: {
    backgroundColor: "#4B5563",
  },
  resultText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
  },
  scoreText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginHorizontal: 4,
    minWidth: 90,
    textAlign: "center",
  },
  ratingPointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingWin: {
    backgroundColor: "#EE3C79",
  },
  ratingLoss: {
    backgroundColor: "#4B5563",
  },
  ratingPointsText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  teamCard: {
    marginBottom: 12,
    backgroundColor: "#10174A",
    borderRadius: 16,
    padding: 16,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teamName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  teamMeta: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  ratingCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#38C6F4",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingCircleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  ratingCircleLabel: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    marginTop: 2,
  },
  filterChips: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
  },
  chipActive: {
    backgroundColor: "#EE3C79",
  },
  chipText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  tournamentCard: {
    marginBottom: 12,
    backgroundColor: "#10174A",
    borderRadius: 16,
    padding: 16,
  },
  tournamentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tournamentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#3C54A5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  tournamentMeta: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  tournamentLocation: {
    fontSize: 12,
    color: "#38C6F4",
    marginLeft: 2,
  },
  winnerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  winnerBadgeWin: {
    backgroundColor: "#38C6F4",
  },
  winnerBadgeLoss: {
    backgroundColor: "#EE3C79",
  },
  winnerText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },
  tournamentDateBadge: {
    fontSize: 11,
    color: "#fff",
    marginTop: 2,
    fontWeight: "500",
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  organizerName: {
    fontSize: 14,
    color: "#fff",
  },
  loadMoreButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#3C54A5",
    alignItems: "center",
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "23%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#EE3C79",
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 10,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    maxHeight: "80%",
    backgroundColor: "#000320",
    borderRadius: 16,
    padding: 12,
    // overflow: "hidden"
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  closeIcon: {
    backgroundColor: "#EE3C79",
    borderRadius: 16,
    padding: 2,
  },
  teamStatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  teamStatsInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teamStatsName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  teamStatsLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  ratingCircleLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#38C6F4",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingCircleTextLarge: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  ratingLabel: {
    fontSize: 10,
    color: "#fff",
  },
  largeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#232A4D",
  },
  statsQuickViewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  quickStatCard: {
    width: "48%",
    backgroundColor: "#10174A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  modalHighlightCard: {
    backgroundColor: "#10174A",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
  },
  modalClubCard: {
    backgroundColor: "#10174A",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
  },
  modalPartnerCard: {
    backgroundColor: "#10174A",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
  },
  chartModalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#0E1340",
    borderRadius: 16,
    padding: 20,
  },
  expandedChartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  expandedChart: {
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});