import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import ThemedView from "../../components/ThemedView";
import { CAProfileCard } from "../../components/CAProfileCard";
import Spacer from "../../components/Spacer";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

// Sample Clubs Data
const SAMPLE_CLUBS = [
  {
    id: 1,
    name: "Valley Forge Academy",
    address: "123 Sports Complex Ave, Philadelphia",
    city: "Islamabad",
    coordinates: { latitude: 33.6844, longitude: 73.0479 },
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    courts: 8,
    rating: 4.8,
    dayRate: 15,
    nightRate: 20,
  },
  {
    id: 2,
    name: "Sports Arena Padel",
    address: "123 Sports Complex Ave, Philadelphia",
    city: "Islamabad",
    coordinates: { latitude: 33.7077, longitude: 73.0469 },
    image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
    courts: 8,
    rating: 4.6,
    dayRate: 12,
    nightRate: 18,
  },
  {
    id: 3,
    name: "Ocean View Padel",
    address: "456 Beachside Rd, Riyadh",
    city: "Lahore",
    coordinates: { latitude: 31.5497, longitude: 74.3436 },
    image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800",
    courts: 6,
    rating: 4.9,
    dayRate: 18,
    nightRate: 25,
  },
  {
    id: 4,
    name: "Elite Padel Club",
    address: "789 Marina View, Dubai",
    city: "Karachi",
    coordinates: { latitude: 24.8607, longitude: 67.0011 },
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800",
    courts: 10,
    rating: 4.7,
    dayRate: 20,
    nightRate: 28,
  },
  {
    id: 5,
    name: "Champions Padel Arena",
    address: "321 Sports City, Abu Dhabi",
    city: "Lahore",
    coordinates: { latitude: 31.5204, longitude: 74.3587 },
    image: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800",
    courts: 12,
    rating: 4.5,
    dayRate: 10,
    nightRate: 15,
  },
];

const FILTER_TABS = [
  { id: "nearby", label: "Nearby", icon: "location" },
  { id: "topRated", label: "Top Rated", icon: "star" },
  { id: "available", label: "Available Now", icon: "time" },
];

const CITIES = [
  { label: "Islamabad", value: "Islamabad" },
  { label: "Lahore", value: "Lahore" },
  { label: "Karachi", value: "Karachi" },
  { label: "a", value: "a" },
  { label: "b", value: "b" },
  { label: "c", value: "c" },
  { label: "d", value: "d" },
  { label: "e", value: "e" },
  { label: "f", value: "f" },
];

// Sample courts and unavailable slots for modal reference
const SAMPLE_COURTS = [
  { id: "1", name: "Court 1", status: "Active" },
  { id: "2", name: "Court 2", status: "Active" },
  { id: "3", name: "Court 3", status: "Inactive" },
];

const SAMPLE_UNAVAILABLE = [
  // Example unavailable slots for reference
  {
    courtId: "1",
    startDateTime: new Date(2025, 9, 13, 9, 0), // Oct 13, 2025 9:00 AM
    endDateTime: new Date(2025, 9, 13, 10, 30),
  },
  {
    courtId: "2",
    startDateTime: new Date(2025, 9, 13, 12, 0),
    endDateTime: new Date(2025, 9, 13, 13, 0),
  },
  // ...more slots...
];

function getNext30MinInterval(date = new Date()) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  let min = d.getMinutes();
  let add = 30 - (min % 30);
  if (add === 30) add = 0;
  d.setMinutes(min + add);
  if (d < new Date()) d.setMinutes(d.getMinutes() + 30);
  return d;
}

function getTimeOptions(date, startTime = null) {
  let options = [];
  let baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  let start = startTime
    ? new Date(startTime)
    : baseDate;
  let end = new Date(baseDate);
  end.setHours(23, 30, 0, 0);

  let current = new Date(start);
  while (current <= end) {
    options.push(new Date(current));
    current.setMinutes(current.getMinutes() + 30);
  }
  return options;
}

function getEndTimeOptions(startTime) {
  let options = [];
  if (!startTime) return options;
  let start = new Date(startTime);
  let current = new Date(start);
  current.setMinutes(current.getMinutes() + 60); // End time starts 1 hour after start
  let maxEnd = new Date(start);
  maxEnd.setDate(maxEnd.getDate() + 1);
  maxEnd.setMinutes(maxEnd.getMinutes() - 30);

  while (current <= maxEnd) {
    options.push(new Date(current));
    current.setMinutes(current.getMinutes() + 30);
  }
  return options;
}

function formatTime(date) {
  return date
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    : "";
}

function formatDate(date) {
  return date
    ? date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
    : "";
}

function getTimeDiff(start, end) {
  let diff = (end - start) / 60000;
  let h = Math.floor(diff / 60);
  let m = diff % 60;
  let str = "";
  if (h) str += `${h}h`;
  if (m) str += (str ? " " : "") + `${m}m`;
  return str;
}

export default function BookACourt() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("nearby");
  const [userLocation, setUserLocation] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [favoriteClubs, setFavoriteClubs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // --- Filters Modal States ---
  const [sortBy, setSortBy] = useState("distance");
  const [rating, setRating] = useState(4);
  const [distance, setDistance] = useState(25);
  const [price, setPrice] = useState(15);
  const [city, setCity] = useState("");
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // For time pickers: temp values to avoid updating until 'Select' is pressed
  const [tempStartTime, setTempStartTime] = useState(startTime || new Date());
  const [tempEndTime, setTempEndTime] = useState(endTime || new Date());

  // For date picker: temp value to avoid updating until 'Select' is pressed
  const [tempDate, setTempDate] = useState(date || new Date());

  // --- Book Modal States ---
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(SAMPLE_COURTS[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [courtDropdownOpen, setCourtDropdownOpen] = useState(false);
  const [startTimeDropdownOpen, setStartTimeDropdownOpen] = useState(false);
  const [endTimeDropdownOpen, setEndTimeDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isOpenMatch, setIsOpenMatch] = useState(false);
  const [showAvailableCourtsOnly, setShowAvailableCourtsOnly] = useState(false);

  // Get user's current location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoading(false);
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        await calculateDistancesAndSort(SAMPLE_CLUBS, { latitude, longitude });
      } catch (error) {
        setClubs(SAMPLE_CLUBS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Unavailable slots for selected court and date
  const unavailableSlots = SAMPLE_UNAVAILABLE.filter(
    (slot) =>
      slot.courtId === selectedCourt &&
      slot.startDateTime.toDateString() === selectedDate.toDateString()
  );
  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
    sortClubs(filterId);
  };
  const sortClubs = (criteria) => {
    let sortedClubs = [...clubs];
    switch (criteria) {
      case "nearby":
      case "distance":
        sortedClubs.sort((a, b) => a.distance - b.distance);
        break;
      case "topRated":
      case "rating":
        sortedClubs.sort((a, b) => b.rating - a.rating);
        break;
      case "priceLowToHigh":
      case "price":
        sortedClubs.sort((a, b) => {
          const avgA = (a.dayRate + a.nightRate) / 2;
          const avgB = (b.dayRate + b.nightRate) / 2;
          return avgA - avgB;
        });
        break;
      case "priceHighToLow":
        sortedClubs.sort((a, b) => {
          const avgA = (a.dayRate + a.nightRate) / 2;
          const avgB = (b.dayRate + b.nightRate) / 2;
          return avgB - avgA;
        });
        break;
      default:
        break;
    }
    setClubs(sortedClubs);
  };
  const calculateDistancesAndSort = async (clubsList, userLoc) => {
    const clubsWithDistance = await Promise.all(
      clubsList.map(async (club) => {
        const distanceData = await calculateDistance(userLoc, club.coordinates);
        return {
          ...club,
          distance: distanceData?.distance || 999999,
          distanceText: distanceData?.distanceText || "N/A",
        };
      })
    );
    clubsWithDistance.sort((a, b) => a.distance - b.distance);
    setClubs(clubsWithDistance);
  };
  const calculateDistance = async (origin, destination) => {
    try {
      if (GOOGLE_API_KEY) {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0]) {
          const element = data.rows[0].elements[0];
          if (element.status === 'OK' && element.distance) {
            return {
              distance: element.distance.value,
              distanceText: element.distance.text,
            };
          }
        }
      }
      return calculateDistanceHaversine(origin, destination);
    } catch (error) {
      return calculateDistanceHaversine(origin, destination);
    }
  };
  const calculateDistanceHaversine = (origin, destination) => {
    const R = 6371;
    const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
    const dLon = ((destination.longitude - origin.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return {
      distance: distance * 1000,
      distanceText: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`,
    };
  };

  // Generate date options for modal (today + next 4 days)
  const dateOptions = [];
  for (let i = 0; i < 5; i++) {
    let d = new Date();
    d.setDate(d.getDate() + i);
    dateOptions.push(d);
  }

  // Generate start time options
  let startTimeOptions = [];
  if (selectedDate.toDateString() === new Date().toDateString()) {
    let nextInterval = getNext30MinInterval();
    startTimeOptions = getTimeOptions(selectedDate, nextInterval);
  } else {
    startTimeOptions = getTimeOptions(selectedDate, new Date(selectedDate.setHours(0, 0, 0, 0)));
  }

  // Generate end time options
  let endTimeOptions = [];
  if (selectedStartTime) {
    endTimeOptions = getEndTimeOptions(selectedStartTime);
  }

  // Auto select start/end time when modal opens or date changes
  useEffect(() => {
    if (showBookModal) {
      let now = new Date();
      let nextInterval = getNext30MinInterval(now);
      setSelectedStartTime(nextInterval);
      setSelectedEndTime(new Date(nextInterval.getTime() + 60 * 60000));
      setErrorMsg("");
    }
  }, [showBookModal]);

  useEffect(() => {
    if (selectedStartTime) {
      let newEnd = new Date(selectedStartTime.getTime() + 60 * 60000);
      setSelectedEndTime(newEnd);
    }
  }, [selectedStartTime]);

  useEffect(() => {
    // Check for slot clash
    if (selectedStartTime && selectedEndTime) {
      let clash = unavailableSlots.some(
        (slot) =>
          (selectedStartTime < slot.endDateTime && selectedEndTime > slot.startDateTime)
      );
      setErrorMsg(
        clash
          ? "Selected time slot clashes with an unavailable slot."
          : ""
      );
    } else {
      setErrorMsg("");
    }
  }, [selectedStartTime, selectedEndTime, selectedCourt, selectedDate]);

  // Favorite toggle for modal
  const handleFavoriteToggle = (clubId) => {
    setFavoriteClubs((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(clubId)) {
        newFavorites.delete(clubId);
      } else {
        newFavorites.add(clubId);
      }
      return newFavorites;
    });
  };

  // --- Book Modal UI ---
  const renderBookModal = () => (
    <Modal
      visible={showBookModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowBookModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowBookModal(false)}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={70}
          tint="dark"
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback>
            <View style={styles.bookModalContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {/* Club Info */}
                <View style={styles.bookModalClubHeader}>
                  <Image
                    source={{ uri: selectedClub?.image }}
                    style={styles.bookModalClubImage}
                  />
                  <View style={styles.bookModalClubInfo}>
                    <Text style={styles.bookModalClubName}>
                      {selectedClub?.name}
                    </Text>
                    <Text style={styles.bookModalClubAddress}>
                      {selectedClub?.address}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookModalFavoriteButton}
                    onPress={() => handleFavoriteToggle(selectedClub?.id)}
                  >
                    <Ionicons
                      name={
                        favoriteClubs.has(selectedClub?.id)
                          ? "heart"
                          : "heart-outline"
                      }
                      size={24}
                      color={
                        favoriteClubs.has(selectedClub?.id)
                          ? "#EE3C79"
                          : "#fff"
                      }
                    />
                  </TouchableOpacity>
                </View>
                {/* Open Match Toggle */}
                <View style={styles.bookModalToggleRow}>
                  <Text style={styles.bookModalToggleLabel}>
                    Is this an Open Match
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.bookModalSwitch,
                      isOpenMatch && styles.bookModalSwitchActive,
                    ]}
                    onPress={() => setIsOpenMatch((prev) => !prev)}
                  >
                    <View
                      style={[
                        styles.bookModalSwitchKnob,
                        isOpenMatch && styles.bookModalSwitchKnobActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                {/* Date Selector */}
                <View style={styles.bookModalDateRow}>
                  {dateOptions.map((d, idx) => (
                    <TouchableOpacity
                      key={d.toDateString()}
                      style={[
                        styles.bookModalDateItem,
                        selectedDate.toDateString() === d.toDateString() &&
                          styles.bookModalDateItemActive,
                      ]}
                      onPress={() => setSelectedDate(new Date(d))}
                    >
                      <Text style={styles.bookModalDateWeekdayShort}>
                        {d.toLocaleDateString([], { weekday: "short" })}
                      </Text>
                      <Text
                        style={[
                          styles.bookModalDateDay,
                          selectedDate.toDateString() === d.toDateString() &&
                            styles.bookModalDateDayActive,
                        ]}
                      >
                        {d.getDate()}
                      </Text>
                      <Text style={styles.bookModalDateMonth}>
                        {d.toLocaleString("default", { month: "short" })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Court Selection */}
                <Text style={styles.bookModalSectionLabel}>Select a Court</Text>
                <View style={styles.bookModalToggleRow}>
                  <Text style={styles.bookModalToggleLabel}>
                    Show available courts only
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.bookModalSwitch,
                      showAvailableCourtsOnly && styles.bookModalSwitchActive,
                    ]}
                    onPress={() =>
                      setShowAvailableCourtsOnly((prev) => !prev)
                    }
                  >
                    <View
                      style={[
                        styles.bookModalSwitchKnob,
                        showAvailableCourtsOnly &&
                          styles.bookModalSwitchKnobActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <Dropdown
                  style={styles.citiesDropdown}
                  data={SAMPLE_COURTS.map((court) => ({
                    label: court.name,
                    value: court.id,
                  }))}
                  placeholderStyle={styles.citiesDropdownPlaceholder} 
                selectedTextStyle={styles.citiesDropdownText}
                containerStyle={styles.citiesDropdownList} 
                itemContainerStyle={styles.citiesDropdownItem}
                itemTextStyle={styles.itemTextStyle}
                selectedStyle={styles.citiesDropdownItemSelected}
                activeColor="#10174A"
                  labelField="label"
                  valueField="value"
                  placeholder="court selection"
                  value={selectedCourt}
                  onChange={(item) => setSelectedCourt(item.value)}
                  open={courtDropdownOpen}
                  onFocus={() => setCourtDropdownOpen(true)}
                  onBlur={() => setCourtDropdownOpen(false)}
                  renderRightIcon={() => (
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color="#6B7280"
                      style={{ marginLeft: 8 }}
                    />
                  )}
                />
                {/* Time Selection */}
                <Text style={styles.bookModalSectionLabel}>Time Selection</Text>
                <View style={styles.bookModalTimeRow}>
                  <Dropdown
                    style={styles.timeButton}
                    data={startTimeOptions.map((t) => ({
                      label: formatTime(t),
                      value: t.getTime(),
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Start Time"
                    placeholderStyle={styles.citiesDropdownPlaceholder} 
                    selectedTextStyle={styles.citiesDropdownText}
                    containerStyle={styles.citiesDropdownList} 
                    itemContainerStyle={styles.citiesDropdownItem}
                    itemTextStyle={styles.itemTextStyle}
                    selectedStyle={styles.citiesDropdownItemSelected}
                    activeColor="#10174A"
                    value={selectedStartTime ? selectedStartTime.getTime() : null}
                    onChange={(item) => setSelectedStartTime(new Date(item.value))}
                    open={startTimeDropdownOpen}
                    onFocus={() => setStartTimeDropdownOpen(true)}
                    onBlur={() => setStartTimeDropdownOpen(false)}
                    renderRightIcon={() => (
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color="#6B7280"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  />
                  <Dropdown
                    style={styles.timeButton}
                    data={endTimeOptions.map((t) => ({
                      label: `${formatTime(t)} (${getTimeDiff(selectedStartTime, t)})`,
                      value: t.getTime(),
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="End Time"
                    placeholderStyle={styles.citiesDropdownPlaceholder} 
                    selectedTextStyle={styles.citiesDropdownText}
                    containerStyle={styles.citiesDropdownList} 
                    itemContainerStyle={styles.citiesDropdownItem}
                    itemTextStyle={styles.itemTextStyle}
                    selectedStyle={styles.citiesDropdownItemSelected}
                    activeColor="#10174A"
                    value={selectedEndTime ? selectedEndTime.getTime() : null}
                    onChange={(item) => setSelectedEndTime(new Date(item.value))}
                    open={endTimeDropdownOpen}
                    onFocus={() => setEndTimeDropdownOpen(true)}
                    onBlur={() => setEndTimeDropdownOpen(false)}
                    renderRightIcon={() => (
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color="#6B7280"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  />
                </View>
                {/* Unavailable Slots */}
                <Text style={styles.bookModalSectionLabel}>Unavailable Slots</Text>
                <View style={styles.bookModalUnavailablePillsRow}>
                  {unavailableSlots.length === 0 ? (
                    <Text style={styles.bookModalNoUnavailable}>
                      No unavailable slots for this court on selected date
                    </Text>
                  ) : (
                    unavailableSlots.map((slot, idx) => (
                      <View key={idx} style={styles.bookModalUnavailablePill}>
                        <Text style={styles.bookModalUnavailablePillText}>
                          {formatTime(slot.startDateTime)} - {formatTime(slot.endDateTime)}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
                {/* Error Message */}
                {errorMsg ? (
                  <Text style={styles.bookModalError}>{errorMsg}</Text>
                ) : null}
                {/* Confirm/Cancel Buttons */}
                <View style={styles.bookModalActionsRow}>
                  <TouchableOpacity
                    style={styles.bookModalCancelButton}
                    onPress={() => setShowBookModal(false)}
                  >
                    <Text style={styles.bookModalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.bookModalConfirmButton,
                      errorMsg && { opacity: 0.5 },
                    ]}
                    disabled={!!errorMsg}
                    onPress={() => {
                      // Confirm booking logic here
                      setShowBookModal(false);
                    }}
                  >
                    <Text style={styles.bookModalConfirmButtonText}>
                      Confirm Booking
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // --- Main Page ---
  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (clubId) => {
    setFavoriteClubs((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(clubId)) {
        newFavorites.delete(clubId);
      } else {
        newFavorites.add(clubId);
      }
      return newFavorites;
    });
  };

  const renderClubCard = (club) => {
    const isFavorite = favoriteClubs.has(club.id);
    return (
      <CAProfileCard key={club.id} style={styles.clubCard}>
        <View style={styles.clubImageContainer}>
          <Image source={{ uri: club.image }} style={styles.clubImage} />
          <View style={styles.courtsTag}>
            <Ionicons name="tennisball" size={14} color="#fff" />
            <Text style={styles.courtsText}>{club.courts} Courts</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(club.id)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#EE3C79" : "#fff"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.clubAddress}>{club.address}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#38C6F4" />
            <Text style={styles.distanceText}>
              {club.distanceText || "N/A"} away • {club.city}
            </Text>
          </View>
          <View style={styles.clubFooter}>
            <View style={styles.ratesContainer}>
              <View style={styles.rateItem}>
                <Ionicons name="sunny-outline" size={16} color="#FFD700" />
                <Text style={styles.rateLabel}>PKR</Text>
                <Text style={styles.rateValue}>{club.dayRate} / hour</Text>
              </View>
              <View style={styles.rateItem}>
                <Ionicons name="moon-outline" size={16} color="#9CA3AF" />
                <Text style={styles.rateLabel}>PKR</Text>
                <Text style={styles.rateValue}>{club.nightRate} / hour</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => {
                setSelectedClub(club);
                setShowBookModal(true);
              }}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{club.rating}</Text>
        </View>
      </CAProfileCard>
    );
  };

  // --- Filters Modal UI ---
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
                <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>Filters</Text>
                </View>
              <Text style={styles.filterSectionTitle}>Sort by</Text>
              <View style={styles.sortTabsRow}>
                {["distance", "price", "rating"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.sortTab,
                      sortBy === type && styles.sortTabActive,
                    ]}
                    onPress={() => setSortBy(type)}
                  >
                    <Text
                      style={[
                        styles.sortTabText,
                        sortBy === type && styles.sortTabTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.filterLabel}>Ratings</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={24}
                      color="#38C6F4"
                      style={{ marginRight: 2 }}
                    />
                  </TouchableOpacity>
                ))}
                <Text style={styles.ratingText}>{rating}.0 & up</Text>
              </View>
              <Text style={styles.filterLabel}>Distance</Text>
              <View style={styles.sliderLabelsRow}>
                <Text style={styles.sliderLabel}>10 km</Text>
                <Text style={styles.sliderLabel}>{distance} km</Text>
                <Text style={styles.sliderLabel}>100 km</Text>
              </View>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={10}
                maximumValue={100}
                step={1}
                value={distance}
                minimumTrackTintColor="#38C6F4"
                maximumTrackTintColor="#232A4D"
                thumbTintColor="#EE3C79"
                onValueChange={setDistance}
              />
              <Text style={styles.sliderDesc}>Select the maximum search distance</Text>
              <Text style={styles.filterLabel}>Price Range (per hour)</Text>
              <View style={styles.sliderLabelsRow}>
                <Text style={styles.sliderLabel}>PKR15</Text>
                <Text style={styles.sliderLabel}>PKR{price}</Text>
                <Text style={styles.sliderLabel}>PKR45</Text>
              </View>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={15}
                maximumValue={45}
                step={1}
                value={price}
                minimumTrackTintColor="#38C6F4"
                maximumTrackTintColor="#232A4D"
                thumbTintColor="#EE3C79"
                onValueChange={setPrice}
              />
              <Text style={styles.filterLabel}>City</Text>
              <Dropdown
                style={styles.citiesDropdown}
                placeholderStyle={styles.citiesDropdownPlaceholder} 
                selectedTextStyle={styles.citiesDropdownText}
                containerStyle={styles.citiesDropdownList} 
                itemContainerStyle={styles.citiesDropdownItem}
                itemTextStyle={styles.itemTextStyle}
                selectedStyle={styles.citiesDropdownItemSelected}
                activeColor="#10174A"
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={CITIES}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select City"
                searchPlaceholder="Search..."
                value={city}
                onChange={item => setCity(item.value)}
                />
              <Text style={styles.filterLabel}>Date</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setTempDate(date || new Date());
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.dropdownText}>
                  {date ? date.toLocaleDateString() : "Select a day"}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
              {showDatePicker && (
                <Modal
                  transparent
                  animationType="fade"
                  visible={showDatePicker}
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                    <View style={styles.pickerOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={styles.pickerModal}>
                          <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display={Platform.OS === "ios" ? "inline" : "default"}
                            onChange={(event, selectedDate) => {
                              if (Platform.OS === "android") {
                                if (event.type === "set" && selectedDate) {
                                  setTempDate(selectedDate);
                                }
                              } else {
                                if (selectedDate) setTempDate(selectedDate);
                              }
                            }}
                          />
                          <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => {
                              setDate(tempDate);
                              setShowDatePicker(false);
                            }}
                          >
                            <Text style={styles.selectButtonText}>Select</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              )}
              <Text style={styles.filterLabel}>Time</Text>
              <View style={styles.timeRow}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                    setTempStartTime(startTime || new Date());
                    setShowStartTimePicker(true);
                }}
                >
                <Text style={styles.timeButtonText}>
                    {startTime
                    ? startTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true // Ensure 12-hour format
                        })
                    : "Start Time"}
                </Text>
                <Ionicons name="time-outline" size={18} color="#6B7280" style={styles.timeIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                    setTempEndTime(endTime || new Date());
                    setShowEndTimePicker(true);
                    }}
                    >
                    <Text style={styles.timeButtonText}>
                    {endTime
                        ? endTime.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true // Ensure 12-hour format
                        })
                        : "End Time"}
                    </Text>
                    <Ionicons name="time-outline" size={18} color="#6B7280" style={styles.timeIcon} />
                </TouchableOpacity>
              </View>
              {showStartTimePicker && (
                <Modal
                  transparent
                  animationType="fade"
                  visible={showStartTimePicker}
                  onRequestClose={() => setShowStartTimePicker(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setShowStartTimePicker(false)}>
                    <View style={styles.pickerOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={styles.pickerModal}>
                          <DateTimePicker
                            value={tempStartTime}
                            mode="time"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event, selectedTime) => {
                              if (Platform.OS === "android") {
                                if (event.type === "set" && selectedTime) {
                                  setTempStartTime(selectedTime);
                                }
                              } else {
                                if (selectedTime) setTempStartTime(selectedTime);
                              }
                            }}
                          />
                          <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => {
                              setStartTime(tempStartTime);
                              setShowStartTimePicker(false);
                            }}
                          >
                            <Text style={styles.selectButtonText}>Select</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              )}
              {showEndTimePicker && (
                <Modal
                  transparent
                  animationType="fade"
                  visible={showEndTimePicker}
                  onRequestClose={() => setShowEndTimePicker(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setShowEndTimePicker(false)}>
                    <View style={styles.pickerOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={styles.pickerModal}>
                          <DateTimePicker
                            value={tempEndTime}
                            mode="time"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event, selectedTime) => {
                              if (Platform.OS === "android") {
                                if (event.type === "set" && selectedTime) {
                                  setTempEndTime(selectedTime);
                                }
                              } else {
                                if (selectedTime) setTempEndTime(selectedTime);
                              }
                            }}
                          />
                          <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => {
                              setEndTime(tempEndTime);
                              setShowEndTimePicker(false);
                            }}
                          >
                            <Text style={styles.selectButtonText}>Select</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              )}
              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    setSortBy("distance");
                    setRating(4);
                    setDistance(25);
                    setPrice(15);
                    setCity("");
                    setDate(null);
                    setStartTime(null);
                    setEndTime(null);
                    setShowFiltersModal(false);
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => {
                    sortClubs(sortBy);
                    setShowFiltersModal(false);
                  }}
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
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFiltersModal(true)}
        >
          <Ionicons name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.filterTabs}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.filterTab,
              selectedFilter === tab.id && styles.filterTabActive,
            ]}
            onPress={() => handleFilterChange(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={selectedFilter === tab.id ? "#fff" : "#6B7280"}
            />
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === tab.id && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.clubsList}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EE3C79" />
            <Text style={styles.loadingText}>Finding clubs near you...</Text>
          </View>
        ) : filteredClubs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyTitle}>No clubs found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters to get better results
            </Text>
          </View>
        ) : (
          filteredClubs.map((club) => renderClubCard(club))
        )}
        <Spacer height={100} />
      </ScrollView>
      {renderFiltersModal()}
      {renderBookModal()}
    </ThemedView>
  );
}

// styles object not included as requested

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
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
  filterTabs: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: "#EE3C79",
  },
  filterTabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  clubsList: {
    paddingBottom: 20,
  },
  clubCard: {
    marginBottom: 16,
    padding: 0,
    overflow: "hidden",
  },
  clubImageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  clubImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  courtsTag: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EE3C79",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  courtsText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  clubInfo: {
    padding: 16,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  clubAddress: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  distanceText: {
    fontSize: 13,
    color: "#38C6F4",
  },
  clubFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  ratesContainer: {
    flex: 1,
  },
  rateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  rateLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  rateValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  bookButton: {
    backgroundColor: "#EE3C79",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 16,
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
    justifyContent: "flex-end",
  },
  filtersModalContainer: {
    backgroundColor: "#000320",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  sortTabsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  sortTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
  },
  sortTabActive: {
    backgroundColor: "#EE3C79",
  },
  sortTabText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  sortTabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  filterLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  sliderLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: 2,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  sliderDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 2,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10174A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#EE3C79",
    fontWeight: "700",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EE3C79",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModal: {
    backgroundColor: "#10174A",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    minWidth: 280,
  },
  selectButton: {
    marginTop: 16,
    backgroundColor: "#EE3C79",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  timeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10174A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  timeButtonText: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
  },
  timeIcon: {
    marginLeft: 8,
  },
  citiesDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10174A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    justifyContent: "space-between"
  },
  citiesDropdownPlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
  citiesDropdownText: {
    fontSize: 16,
    color: '#fff',
  },
  citiesDropdownList: {
    backgroundColor: '#10174A',
    borderColor: '#444',
    borderRadius: 12,
    overflow: 'hidden',
  },
  citiesDropdownItem: {
    backgroundColor: '#10174A',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  citiesDropdownItemSelected: {
    backgroundColor: '#10174A',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  itemTextStyle: {
    color: '#fff',
  },
  selectedItemTextStyle: {
    color: '#fff',
    fontWeight: '600',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#10174A',
    color: '#fff',
    borderColor: '#444',
    borderRadius: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  // Book Modal Styles
  bookModalContainer: {
    backgroundColor: "#000320",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  bookModalClubHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bookModalClubImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#232A4D",
  },
  bookModalClubInfo: {
    flex: 1,
    justifyContent: "center",
  },
  bookModalClubName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  bookModalClubAddress: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  bookModalFavoriteButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  bookModalToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  bookModalToggleLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  bookModalSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#232A4D",
    justifyContent: "center",
    padding: 2,
  },
  bookModalSwitchActive: {
    backgroundColor: "#38C6F4",
  },
  bookModalSwitchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    position: "absolute",
    left: 2,
    top: 2,
  },
  bookModalSwitchKnobActive: {
    left: 22,
    backgroundColor: "#fff",
  },
  bookModalDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  bookModalDateItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#10174A",
    width: 50,
  },
  bookModalDateItemActive: {
    backgroundColor: "#EE3C79",
  },
  bookModalDateDay: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  bookModalDateDayActive: {
    color: "#fff",
  },
  bookModalDateMonth: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  bookModalDateWeekday: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  bookModalSectionLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 8,
  },
  bookModalDropdown: {
    backgroundColor: "#10174A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    color: "#fff",
  },
  bookModalTimeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  bookModalNoUnavailable: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  bookModalUnavailableSlot: {
    backgroundColor: "#232A4D",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  bookModalUnavailableTime: {
    fontSize: 13,
    color: "#fff",
  },
  bookModalError: {
    color: "#EE3C79",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  bookModalActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  bookModalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  bookModalCancelButtonText: {
    fontSize: 16,
    color: "#EE3C79",
    fontWeight: "700",
  },
  bookModalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EE3C79",
    alignItems: "center",
  },
  bookModalConfirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  bookModalUnavailablePillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  bookModalUnavailablePill: {
    backgroundColor: "#10174A",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    marginRight: 6,
  },
  bookModalUnavailablePillText: {
    fontSize: 12,
    color: "#fff",
  },
  bookModalDateWeekdayShort: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
    textAlign: "center",
  },
});