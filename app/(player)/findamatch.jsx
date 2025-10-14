// app/clubadmin/findamatch.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import { CAProfileCard } from "../../components/CAProfileCard";
import { BlurView } from "expo-blur";
import { Dropdown } from "react-native-element-dropdown";

// 🔹 Sample Data
const SAMPLE_MATCHES = [
  {
    id: "1",
    club: {
      name: "Valley Forge Academy",
      address: "123 Sports Complex Ave, Philadelphia",
      city: "Islamabad",
      image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
      rating: 4.8,
    },
    date: new Date("2025-01-28"),
    startTime: new Date("2025-01-28T16:00:00"),
    endTime: new Date("2025-01-28T17:00:00"),
    court: "Court 1",
    format: "Single",
    skillLevel: "Intermediate",
    players: {
      team1: [
        {
            id: "xyz",
            name: "Mike Chen",
            image: "https://randomuser.me/api/portraits/men/34.jpg",
        },
        {
            id: "abcd",
            name: "Alex Raul",
            image: "https://randomuser.me/api/portraits/men/35.jpg",
        },
      ],
      team2: [null, null],
    },
  },
  {
    id: "2",
    club: {
      name: "Sports Arena Padel",
      address: "123 Sports Complex Ave, Philadelphia",
      city: "Islamabad",
      image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
      rating: 4.6,
    },
    date: new Date("2025-01-28"),
    startTime: new Date("2025-01-28T16:00:00"),
    endTime: new Date("2025-01-28T17:00:00"),
    court: "Court 5",
    format: "Double",
    skillLevel: "Advanced",
    players: {
      team1: [
        {
          id: "bbbbb",
          name: "John Lennon",
          image: "https://randomuser.me/api/portraits/men/35.jpg",
        },
        null,
      ],
      team2: [null, null],
    },
  },
  {
    id: "3",
    club: {
      name: "Ocean View Padel",
      address: "456 Beachside Rd, Riyadh",
      city: "Lahore",
      image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800",
      rating: 4.9,
    },
    date: new Date("2025-01-28"),
    startTime: new Date("2025-01-28T16:00:00"),
    endTime: new Date("2025-01-28T17:00:00"),
    court: "Court 3",
    format: "Single",
    skillLevel: "Beginner",
    players: {
      team1: [
        {
          id: "aaa",
          name: "Amir Khan",
          image: "https://randomuser.me/api/portraits/men/36.jpg",
        },
        null,
      ],
      team2: [null, null],
    },
  },
];

// 🔹 Sample Players Data
const AVAILABLE_PLAYERS = [
  {
    id: "1",
    name: "Carlos R.",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: "2",
    name: "Emma L.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    name: "Alia B.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    name: "Mike J.",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
  },
];

// 🔹 Format time for display
const formatTime = (date) => {
  return date.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

// 🔹 Format date for display
const formatDate = (date) => {
  return date.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function FindAMatch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState(SAMPLE_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    date: null,
    time: "Any time",
    format: "Single",
    skillLevel: "Any Level",
    sortBy: "time",
  });

  // 🔹 Filter matches based on search query
  const filteredMatches = matches.filter((match) =>
    match.club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Filter matches based on filters
  const applyFilters = () => {
    let filtered = [...matches];
    
    if (filters.city) {
      filtered = filtered.filter(match => match.club.city === filters.city);
    }
    
    if (filters.date) {
      filtered = filtered.filter(match => 
        match.date.toDateString() === filters.date.toDateString()
      );
    }
    
    if (filters.time !== "Any time") {
      // Simple time filter for demo
      filtered = filtered.filter(match => {
        const hour = match.startTime.getHours();
        if (filters.time === "Morning" && hour >= 6 && hour < 12) return true;
        if (filters.time === "Afternoon" && hour >= 12 && hour < 18) return true;
        if (filters.time === "Evening" && hour >= 18) return true;
        return false;
      });
    }
    
    if (filters.format !== "All") {
      filtered = filtered.filter(match => match.format === filters.format);
    }
    
    if (filters.skillLevel !== "Any Level") {
      filtered = filtered.filter(match => match.skillLevel === filters.skillLevel);
    }
    
    // Sort by
    switch (filters.sortBy) {
      case "time":
        filtered.sort((a, b) => a.startTime - b.startTime);
        break;
      case "distance":
        // For demo, sort by club name
        filtered.sort((a, b) => a.club.name.localeCompare(b.club.name));
        break;
      case "rating":
        filtered.sort((a, b) => b.club.rating - a.club.rating);
        break;
      case "availability":
        // For demo, sort by club name
        filtered.sort((a, b) => a.club.name.localeCompare(b.club.name));
        break;
    }
    
    setMatches(filtered);
    setShowFiltersModal(false);
  };

  // 🔹 Handle view match
  const handleViewMatch = (match) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  // 🔹 Handle join match
  const handleJoinMatch = (team, index) => {
    if (!selectedMatch) return;
  
    // Remove user from any slot first
    const updatedPlayers = { ...selectedMatch.players };
    ["team1", "team2"].forEach(t => {
      updatedPlayers[t] = updatedPlayers[t].map(p =>
        p && p.id === "logged-user" ? null : p
      );
    });
  
    // Add user to the selected slot
    updatedPlayers[team][index] = {
      id: "logged-user",
      name: "You",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    };
  
    // Update matches state
    const updatedMatches = matches.map((match) => {
      if (match.id === selectedMatch.id) {
        return { ...match, players: updatedPlayers };
      }
      return match;
    });
  
    setMatches(updatedMatches);
    setSelectedMatch(updatedMatches.find(m => m.id === selectedMatch.id));
  };

  // 🔹 Handle cancel match
  const handleCancelMatch = () => {
    if (!selectedMatch) return;
    // Remove user from any slot before closing
    const updatedPlayers = { ...selectedMatch.players };
    ["team1", "team2"].forEach(t => {
      updatedPlayers[t] = updatedPlayers[t].map(p =>
        p && p.id === "logged-user" ? null : p
      );
    });
  
    // Update matches state
    const updatedMatches = matches.map((match) => {
      if (match.id === selectedMatch.id) {
        return { ...match, players: updatedPlayers };
      }
      return match;
    });
  
    setMatches(updatedMatches);
    setSelectedMatch(updatedMatches.find(m => m.id === selectedMatch.id));
    setShowMatchModal(false);
  };

  // 🔹 Handle save match
  const handleSaveMatch = () => {
    // TODO: API call to save match
    Alert.alert("Success", "Match saved successfully!");
    setShowMatchModal(false);
  };

  // 🔹 Render a single match card
  const renderMatchCard = (match) => (
    <CAProfileCard key={match.id} style={styles.matchCard}>
      <View style={styles.matchContent}>
        <Image source={{ uri: match.club.image }} style={styles.clubImage} />
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{match.club.name}</Text>
          <Text style={styles.matchDate}>{formatDate(match.date)}, {formatTime(match.startTime)} - {formatTime(match.endTime)}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewMatch(match)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </CAProfileCard>
  );

  // 🔹 Render View Match Modal
  const renderMatchModal = () => {
    if (!selectedMatch) return null;

    return (
      <Modal
        visible={showMatchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMatchModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMatchModal(false)}>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={70}
            tint="dark"
            style={styles.modalOverlay}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Match Details</Text>
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScrollContent}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps="always"
                >
                  {/* 🔹 Match Info */}
                  <View style={styles.modalInfoSection}>
                    <View style={styles.modalInfoRow}>
                        <Text style={styles.modalLabel}>Club Name</Text>
                        <Text style={styles.modalValue}>{selectedMatch.club.name}</Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                        <Text style={styles.modalLabel}>Court Name</Text>
                        <Text style={styles.modalValue}>{selectedMatch.court}</Text>
                    </View>

                    {/* 🔹 Date & Time & Skill Level in Single Rows */}
                    <View style={styles.modalInfoRowSingle}>
                        <Text style={styles.modalLabel}>Date:</Text>
                        <Text style={styles.modalValue}>
                        {selectedMatch.date.toLocaleDateString([], { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                        })}
                        </Text>
                    </View>

                    <View style={styles.modalInfoRowSingle}>
                        <Text style={styles.modalLabel}>Time Slot:</Text>
                        <Text style={styles.modalValue}>
                        {formatTime(selectedMatch.startTime)} - {formatTime(selectedMatch.endTime)}
                        </Text>
                    </View>

                    <View style={styles.modalInfoRowSingle}>
                        <Text style={styles.modalLabel}>Skill Level:</Text>
                        <Text style={styles.modalValue}>{selectedMatch.skillLevel}</Text>
                    </View>
                    </View>

                  {/* 🔹 Players Section */}
                  <Text style={styles.playersTitle}>Players</Text>
                  <View style={styles.playersContainer}>
                    {/* Team 1 */}
                    <View style={styles.teamColumn}>
                      <Text style={styles.teamLabel}>Team 1</Text>
                      {selectedMatch.players.team1.map((player, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.playerSlot}
                          onPress={() => !player && handleJoinMatch('team1', index)}
                          disabled={player && player.id === 'logged-user'}
                        >
                          {player ? (
                            <>
                              <Image 
                                source={{ uri: player.image }} 
                                style={styles.playerAvatar} 
                              />
                              <Text style={styles.playerName}>{player.name}</Text>
                            </>
                          ) : (
                            <>
                              <View style={styles.addPlayerCircle}>
                                <Ionicons name="add" size={24} color="#6B7280" />
                              </View>
                              <Text style={styles.addPlayerText}>Join</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* VS */}
                    <View style={styles.vsContainer}>
                      <Text style={styles.vsText}>VS</Text>
                    </View>

                    {/* Team 2 */}
                    <View style={styles.teamColumn}>
                      <Text style={styles.teamLabel}>Team 2</Text>
                      {selectedMatch.players.team2.map((player, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.playerSlot}
                          onPress={() => !player && handleJoinMatch('team2', index)}
                        >
                          {player ? (
                            <>
                              <Image 
                                source={{ uri: player.image }} 
                                style={styles.playerAvatar} 
                              />
                              <Text style={styles.playerName}>{player.name}</Text>
                            </>
                          ) : (
                            <>
                              <View style={styles.addPlayerCircle}>
                                <Ionicons name="add" size={24} color="#6B7280" />
                              </View>
                              <Text style={styles.addPlayerText}>Join</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* 🔹 Action Buttons */}
                    <View style={styles.modalActionsRow}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={handleCancelMatch}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={handleSaveMatch}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  // 🔹 Render Filters Modal
  const renderFiltersModal = () => (
    <Modal
      visible={showFiltersModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowFiltersModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowFiltersModal(false)}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={70}
          tint="dark"
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback>
            <View style={styles.filtersModalContainer}>
              <Text style={styles.modalTitle}>Filters</Text>

              <Text style={styles.filterLabel}>City</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: "Islamabad", value: "Islamabad" },
                  { label: "Lahore", value: "Lahore" },
                  { label: "Karachi", value: "Karachi" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select city"
                value={filters.city}
                onChange={(item) => setFilters(prev => ({ ...prev, city: item.value }))}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                containerStyle={styles.dropdownList}
                itemContainerStyle={styles.dropdownItem}
                itemTextStyle={styles.itemTextStyle}
                selectedStyle={styles.dropdownItemSelected}
                activeColor="#0E1340"
              />

              <Text style={styles.filterLabel}>Date & Time</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    // In real app, use DateTimePicker
                    Alert.alert("Date Picker", "Date picker will be implemented.");
                  }}
                >
                  <Ionicons name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.dateText}>
                    {filters.date ? formatDate(filters.date) : "mm/dd/yyyy"}
                  </Text>
                </TouchableOpacity>
                <Dropdown
                  style={styles.timeDropdown}
                  data={[
                    { label: "Any time", value: "Any time" },
                    { label: "Morning", value: "Morning" },
                    { label: "Afternoon", value: "Afternoon" },
                    { label: "Evening", value: "Evening" },
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="Any time"
                  value={filters.time}
                  onChange={(item) => setFilters(prev => ({ ...prev, time: item.value }))}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdownList}
                  itemContainerStyle={styles.dropdownItem}
                  itemTextStyle={styles.itemTextStyle}
                  selectedStyle={styles.dropdownItemSelected}
                  activeColor="#0E1340"
                />
              </View>

              <Text style={styles.filterLabel}>Format</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: "Single", value: "Single" },
                  { label: "Double", value: "Double" },
                  { label: "Mixed", value: "Mixed" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Single"
                value={filters.format}
                onChange={(item) => setFilters(prev => ({ ...prev, format: item.value }))}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                containerStyle={styles.dropdownList}
                itemContainerStyle={styles.dropdownItem}
                itemTextStyle={styles.itemTextStyle}
                selectedStyle={styles.dropdownItemSelected}
                activeColor="#0E1340"
              />

              <Text style={styles.filterLabel}>Skill Level</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: "Any Level", value: "Any Level" },
                  { label: "Beginner", value: "Beginner" },
                  { label: "Intermediate", value: "Intermediate" },
                  { label: "Advanced", value: "Advanced" },
                  { label: "Elite", value: "Elite" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Any Level"
                value={filters.skillLevel}
                onChange={(item) => setFilters(prev => ({ ...prev, skillLevel: item.value }))}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                containerStyle={styles.dropdownList}
                itemContainerStyle={styles.dropdownItem}
                itemTextStyle={styles.itemTextStyle}
                selectedStyle={styles.dropdownItemSelected}
                activeColor="#0E1340"
              />

              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: "time" }))}
                >
                  <Ionicons 
                    name={filters.sortBy === "time" ? "radio-button-on" : "radio-button-off"} 
                    size={16} 
                    color="#38C6F4" 
                  />
                  <Text style={styles.sortOptionText}>Time - Soonest match first</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: "distance" }))}
                >
                  <Ionicons 
                    name={filters.sortBy === "distance" ? "radio-button-on" : "radio-button-off"} 
                    size={16} 
                    color="#38C6F4" 
                  />
                  <Text style={styles.sortOptionText}>Distance - Closest club first</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: "rating" }))}
                >
                  <Ionicons 
                    name={filters.sortBy === "rating" ? "radio-button-on" : "radio-button-off"} 
                    size={16} 
                    color="#38C6F4" 
                  />
                  <Text style={styles.sortOptionText}>Rating - Average rating of players</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: "availability" }))}
                >
                  <Ionicons 
                    name={filters.sortBy === "availability" ? "radio-button-on" : "radio-button-off"} 
                    size={16} 
                    color="#38C6F4" 
                  />
                  <Text style={styles.sortOptionText}>Availability - Most open spots</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    setFilters({
                      city: "",
                      date: null,
                      time: "Any time",
                      format: "Single",
                      skillLevel: "Any Level",
                      sortBy: "time",
                    });
                    setMatches(SAMPLE_MATCHES);
                    setShowFiltersModal(false);
                  }}
                >
                  <Text style={styles.resetButtonText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 🔹 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFiltersModal(true)}
        >
          <Ionicons name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer height={16} />

        {/* 🔹 Match Cards */}
        {filteredMatches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters to get better results
            </Text>
          </View>
        ) : (
          filteredMatches.map((match) => renderMatchCard(match))
        )}

        <Spacer height={100} />
      </ScrollView>

      {renderMatchModal()}
      {renderFiltersModal()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E1340",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0E1340",
    alignItems: "center",
    justifyContent: "center",
  },
  matchCard: {
    marginBottom: 16,
    padding: 0,
    overflow: "hidden",
  },
  matchContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  clubImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  viewButton: {
    backgroundColor: "#EE3C79",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#0E1340",
    borderRadius: 16,
    padding: 20,
    alignSelf: 'center', // ✅ Center horizontally
    marginTop: "auto", // ✅ Center vertically
    marginBottom: "auto"
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  modalScrollContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  modalInfoSection: {
    marginBottom: 24,
  },
  modalInfoRow: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  playersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  teamColumn: {
    flex: 1,
  },
  teamLabel: {
    fontSize: 14,
    color: "#38C6F4",
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  playerSlot: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10174A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  playerName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  addPlayerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4B5563",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addPlayerText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  vsContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: {
    fontSize: 16,
    color: "#EE3C79",
    fontWeight: "700",
  },
  modalActions: {
    gap: 12,
  },
  cancelButton: {
    flex:1,
    backgroundColor: "#4B5563",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    flex:1,
    backgroundColor: "#EE3C79",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  // Filters Modal Styles
  filtersModalContainer: {
    backgroundColor: "#0E1340",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  filterLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0E1340',
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
    backgroundColor: '#0E1340',
    borderColor: '#444',
  },
  dropdownItem: {
    backgroundColor: '#0E1340',
    borderBottomColor: '#444',
  },
  itemTextStyle: {
    color: '#fff',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(56, 198, 244, 0.2)',
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10174A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  timeDropdown: {
    flex: 1,
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0E1340',
  },
  sortOptions: {
    marginBottom: 24,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sortOptionText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  modalActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#4B5563",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#EE3C79",
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalInfoRowSingle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});