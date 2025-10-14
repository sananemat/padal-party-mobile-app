// app/clubadmin/mybookings.jsx
import React, { useEffect, useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

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

// 🔹 Sample Bookings Data
const SAMPLE_BOOKINGS = [
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
    totalRate: 15,
    hourlyRate: 15,
    players: {
      yourTeam: [
        {
          id: "logged-user",
          name: "You",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        null,
      ],
      opponents: [null, null],
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
    totalRate: 15,
    hourlyRate: 15,
    players: {
      yourTeam: [
        {
          id: "logged-user",
          name: "You",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        null,
      ],
      opponents: [null, null],
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
    totalRate: 15,
    hourlyRate: 15,
    players: {
      yourTeam: [
        {
          id: "logged-user",
          name: "You",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        null,
      ],
      opponents: [null, null],
    },
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

export default function MyBookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState(SAMPLE_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [isSelectingPlayer, setIsSelectingPlayer] = useState(false);
  const [playerModalType, setPlayerModalType] = useState(null); // { team: 'yourTeam'/'opponents', index: 0/1 }
  const [searchPlayerQuery, setSearchPlayerQuery] = useState("");
  
  const glowColors = ["#38C6F4", "#EE3C79"];

  // 🔹 Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) =>
    booking.club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Filter players based on search query
  const filteredPlayers = AVAILABLE_PLAYERS.filter((player) =>
    player.name.toLowerCase().includes(searchPlayerQuery.toLowerCase())
  );

  useEffect(() => {
    setBookings(SAMPLE_BOOKINGS);
  }, []);

  // 🔹 Handle view booking
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  // 🔹 Handle add player
  const handleAddPlayer = (team, index) => {
    console.log("Inside handleAddPlayer. Team = ",team," Index = ", index)
    
    setPlayerModalType({ team, index });
    setIsSelectingPlayer(true);
    setSearchPlayerQuery("");
  };

  // 🔹 Handle select player
  const handleSelectPlayer = (player) => {
    if (!playerModalType || !selectedBooking) return;
  
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === selectedBooking.id) {
        const updatedPlayers = { 
          yourTeam: [...booking.players.yourTeam],
          opponents: [...booking.players.opponents]
        };
        updatedPlayers[playerModalType.team][playerModalType.index] = player;
        return { ...booking, players: updatedPlayers };
      }
      return booking;
    });
  
    setBookings(updatedBookings);
    
    // Update selected booking
    const updatedBooking = updatedBookings.find(b => b.id === selectedBooking.id);
    setSelectedBooking(updatedBooking);
    
    setIsSelectingPlayer(false);
    setPlayerModalType(null);
  };

  const handleUpdateBooking = () => {
    // TODO: API call to update booking
    Alert.alert("Success", "Booking updated successfully!");
    setShowBookingModal(false);
  };

  // 🔹 Handle delete booking
  const handleDeleteBooking = () => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const updatedBookings = bookings.filter(
              (booking) => booking.id !== selectedBooking.id
            );
            setBookings(updatedBookings);
            setShowBookingModal(false);
            Alert.alert("Success", "Booking deleted successfully!");
          },
        },
      ]
    );
  };

  // 🔹 Render a single booking card
  const renderBookingCard = (booking) => (
    <View key={booking.id} style={styles.neonCardWrapper}>
      <View style={styles.neonCard}>
        <LinearGradient
          colors={[glowColors[0], "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.1, y: 0.6 }}
          style={[styles.glow, { top: -0.85, left: -1 }]}
        />
        <LinearGradient
          colors={[glowColors[1], "transparent"]}
          start={{ x: 1, y: 1 }}
          end={{ x: -0.45, y: 0 }}
          style={[styles.glow, { bottom: -0.8, right: -1 }]}
        />
        <View style={styles.bookingContent}>
          <View style={styles.content}>
            {/* 🔹 Booking Status */}
            <View style={styles.statusContainer}>
              <Image 
                source={require("../../assets/ppicon.png")} 
                style={styles.statusIcon} 
              />
              <Text style={styles.statusTitle}>Booking Confirmed!</Text>
              <Text style={styles.statusSubtitle}>
                You have successfully joined the court.
              </Text>
            </View>

            {/* 🔹 Club Info */}
            <View style={styles.clubInfoRow}>
              <Text style={styles.clubName} numberOfLines={2} ellipsizeMode="tail">
                {booking.club.name}
              </Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{booking.club.rating}</Text>
              </View>
            </View>

            {/* 🔹 Booking Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons 
                  name="location-outline" 
                  size={14} 
                  color="#38C6F4" 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailText}>{booking.club.address}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons 
                  name="calendar-outline" 
                  size={14} 
                  color="#38C6F4" 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailText}>
                  {booking.date.toLocaleDateString([], { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons 
                  name="time-outline" 
                  size={14} 
                  color="#38C6F4" 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailText}>
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons 
                  name="tennisball" 
                  size={14} 
                  color="#38C6F4" 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailText}>{booking.court}</Text>
              </View>
            </View>

            {/* 🔹 Price Info */}
            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Total Price</Text>
                <Text style={styles.priceValue}>PKR {booking.totalRate}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Hourly Rate</Text>
                <Text style={styles.priceValue}>PKR {booking.hourlyRate}/hour</Text>
              </View>
            </View>

            {/* 🔹 Action Button */}
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => handleViewBooking(booking)}
            >
              <Text style={styles.viewButtonText}>View My Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // 🔹 Render View Booking Modal
  const renderBookingModal = () => {
    if (!selectedBooking) return null;

    return (
      <Modal
        visible={showBookingModal && !isSelectingPlayer}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={70}
            tint="dark"
            style={styles.modalOverlay}
        >
            <TouchableWithoutFeedback onPress={() => setShowBookingModal(false)}>
            <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Booking Details</Text>
                </View>

                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  {/* 🔹 Booking Info */}
                  <View style={styles.modalInfoSection}>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Club Name</Text>
                      <Text style={styles.modalValue}>{selectedBooking.club.name}</Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Court Name</Text>
                      <Text style={styles.modalValue}>{selectedBooking.court}</Text>
                    </View>
{/* 
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Location</Text>
                      <Text style={styles.modalValue}>
                        {selectedBooking.club.address}, {selectedBooking.club.city}
                      </Text>
                    </View> */}

                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Date</Text>
                      <Text style={styles.modalValue}>
                        {selectedBooking.date.toLocaleDateString([], { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalLabel}>Time Slot</Text>
                      <Text style={styles.modalValue}>
                        {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                      </Text>
                    </View>
                  </View>

                  {/* 🔹 Players Section */}
                  <Text style={styles.playersTitle}>Players</Text>
                  <View style={styles.playersContainer}>
                    {/* Your Team */}
                    <View style={styles.teamColumn}>
                      <Text style={styles.teamLabel}>Your Team</Text>
                      {selectedBooking.players.yourTeam.map((player, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.playerSlot}
                          onPress={() => !player && handleAddPlayer('yourTeam', index)}
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
                              <Text style={styles.addPlayerText}>Add Player</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* VS */}
                    <View style={styles.vsContainer}>
                      <Text style={styles.vsText}>VS</Text>
                    </View>

                    {/* Opponents */}
                    <View style={styles.teamColumn}>
                      <Text style={styles.teamLabel}>Opponents</Text>
                      {selectedBooking.players.opponents.map((player, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.playerSlot}
                          onPress={() => !player && handleAddPlayer('opponents', index)}
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
                              <Text style={styles.addPlayerText}>Add Player</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* 🔹 Action Buttons */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={styles.updateButton}
                      onPress={handleUpdateBooking}
                    >
                      <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setShowBookingModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={handleDeleteBooking}
                    >
                      <Text style={styles.deleteButtonText}>Delete Booking</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            {/* </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback> */}
        </BlurView>
      </Modal>
    );
  };

  // 🔹 Render Select Player Modal
  const renderPlayerModal = () => (
    <Modal
      visible={showBookingModal && isSelectingPlayer}
      transparent
      animationType="fade"
      onRequestClose={() => setIsSelectingPlayer(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsSelectingPlayer(false)}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={70}
          tint="dark"
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback>
            <View style={styles.playerModalContainer}>
              <View style={styles.playerModalHeader}>
              <TouchableOpacity onPress={() => setIsSelectingPlayer(false)}>
                  <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.playerModalTitle}>Select Player</Text>
                <View style={styles.placeholder} />
              </View>

              {/* Search Bar */}
              <View style={styles.playerSearchContainer}>
                <Ionicons name="search" size={20} color="#6B7280" />
                <TextInput
                  style={styles.playerSearchInput}
                  placeholder="Select Player"
                  placeholderTextColor="#6B7280"
                  value={searchPlayerQuery}
                  onChangeText={setSearchPlayerQuery}
                />
              </View>

              <Text style={styles.availablePlayersTitle}>Available Player</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {filteredPlayers.map((player) => (
                  <TouchableOpacity
                    key={player.id}
                    style={styles.playerItem}
                    onPress={() => handleSelectPlayer(player)}
                  >
                    <Image 
                      source={{ uri: player.image }} 
                      style={styles.playerItemAvatar} 
                    />
                    <Text style={styles.playerItemName}>{player.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer height={16} />

        {/* 🔹 Booking Cards */}
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search to get better results
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => renderBookingCard(booking))
        )}

        <Spacer height={100} />
      </ScrollView>

      {renderBookingModal()}
      {renderPlayerModal()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "3%",
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
  statusContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  priceItem: {
    flexDirection: "column",
    gap: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  priceValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#EE3C79",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
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
  clubInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
    width: 14,
  },
  detailText: {
    fontSize: 14,
    color: "#9CA3AF",
    flex: 1,
  },
  neonCardWrapper: {
    marginBottom: 16,
    width: "100%",
    padding: 6,
  },
  neonCard: {
    position: 'relative',
    borderRadius: 35,
    overflow: 'visible',
  },
  bookingContent: {
    padding: 20,
    borderRadius: 35,
    backgroundColor: '#0E1340',
    shadowColor: '#070b2aff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  content: {
    flex: 1,
    zIndex: 1,
    width: '100%',
    height: '100%'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#0E1340",
    borderRadius: 16,
    padding: 10,
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
    paddingBottom: 20,
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
    // backgroundColor: "#10174A",
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
  updateButton: {
    backgroundColor: "#38C6F4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  cancelButton: {
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
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  // Player Selection Modal
  playerModalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#000320",
    borderRadius: 16,
    padding: 20,
    minHeight: "80%"
  },
  playerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  playerModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  placeholder: {
    width: 24,
  },
  playerSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E1340",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 20,
  },
  playerSearchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  availablePlayersTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 16,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10174A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  playerItemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  playerItemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});