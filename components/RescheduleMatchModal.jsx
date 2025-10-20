// app/components/RescheduleMatchModal.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { CAProfileCard } from "./CAProfileCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from "../constants/Colors";

export default function RescheduleMatchModal({
  visible,
  onClose,
  onSave,
  match,
  courts,
  allMatches,
}) {
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [tempStartTime, setTempStartTime] = useState(new Date());
  const [tempEndTime, setTempEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(null); // 'start' or 'end'
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");
  const [clashError, setClashError] = useState("");
  const [courtDropdownOpen, setCourtDropdownOpen] = useState(false);

  const hasClashRef = useRef(false);

  // 🔹 Convert courts to dropdown format
  const courtOptions = courts.map(court => ({
    label: court.name,
    value: court.id,
  }));

  // 🔹 Initialize form with match data
  useEffect(() => {
    if (match && visible) {
      setSelectedCourt(match.courtId);
      setSelectedDate(new Date(match.startDateTime));
      setStartTime(new Date(match.startDateTime));
      setEndTime(new Date(match.endDateTime));
    }
  }, [match, visible]);

  // 🔹 Get matches for selected date and court (excluding current match)
  const getAvailableSlots = () => {
    if (!selectedCourt) return [];

    // Get components of the SELECTED date in LOCAL timezone
    const targetYear = selectedDate.getFullYear();
    const targetMonth = selectedDate.getMonth();
    const targetDay = selectedDate.getDate();

    return allMatches.filter(m => {
      // Exclude the match being rescheduled
      if (m.id === match?.id) return false;

      const matchDate = new Date(m.startDateTime);
      const matchYear = matchDate.getFullYear();
      const matchMonth = matchDate.getMonth();
      const matchDay = matchDate.getDate();

      // Check if the existing match is on the selected date AND selected court
      return (
        m.courtId === selectedCourt &&
        matchYear === targetYear &&
        matchMonth === targetMonth &&
        matchDay === targetDay
      );
    });
  };

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
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // 🔹 Check for time clashes
  const checkForClash = (newStart, newEnd) => {
    const existingMatches = getAvailableSlots();
    
    for (const m of existingMatches) {
      const existingStart = new Date(m.startDateTime);
      const existingEnd = new Date(m.endDateTime);

      // All overlap scenarios:
      if (
        // New start falls within existing slot
        (newStart >= existingStart && newStart < existingEnd) ||
        // New end falls within existing slot
        (newEnd > existingStart && newEnd <= existingEnd) ||
        // New slot completely encompasses existing slot
        (newStart <= existingStart && newEnd >= existingEnd) ||
        // Existing slot completely encompasses new slot
        (existingStart <= newStart && existingEnd >= newEnd)
      ) {
        return true;
      }
    }
    return false;
  };

  // 🔹 Handle time validation
  useEffect(() => {
    // Only check if a court is selected
    if (selectedCourt) {
      const hasClash = checkForClash(startTime, endTime);
      hasClashRef.current = hasClash; // <-- UPDATE THE REF
      if (hasClash) {
        setClashError("Time slot unavailable - clashes with existing booking");
      } else {
        setClashError("");
      }
    } else {
      // Clear error and ref if no court selected
      hasClashRef.current = false; // <-- UPDATE THE REF
      setClashError("");
    }
    // Clear general error if inputs change
    setError("");
  }, [startTime, endTime, selectedCourt, selectedDate]);

  // 🔹 Handle court selection
  const handleCourtSelect = (courtId) => {
    setSelectedCourt(courtId);
    setClashError("");
  };

  // 🔹 Handle save
  const handleSave = () => {
    if (!selectedCourt) {
      setError("Please select a court");
      return;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }
  
    // CRITICAL: Check the current clash status from the ref
    if (hasClashRef.current) { 
      setError("Time slot unavailable - clashes with existing booking");
      return;
    }
  
    const updatedMatch = {
      ...match,
      courtId: selectedCourt,
      startDateTime: startTime,
      endDateTime: endTime,
    };
  
    onSave(updatedMatch); // This should close the modal
  };

  // 🔹 Handle cancel
  const handleCancel = () => {
    onClose();
  };

  // 🔹 Get unavailable slots for display
  const unavailableSlots = getAvailableSlots();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <BlurView experimentalBlurMethod="dimezisBlurView" intensity={70} tint="dark" style={styles.overlay}>
          <View style={styles.modalContainer}>
          <CAProfileCard style={styles.modalCard}>
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                <Text style={styles.title}>Reschedule Match</Text>

                {/* 🔹 Court Selection */}
                <Text style={styles.label}>Court</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownText} // Keep this for the main input
                  containerStyle={styles.dropdownList}
                  itemContainerStyle={styles.dropdownItem}
                  itemTextStyle={styles.itemTextStyle}
                  activeColor={Colors.cardBackground}
                  selectedStyle={styles.dropdownItemSelected} // Use selectedStyle for the container of the selected item in the list
                  //selectedTextStyle={styles.selectedItemTextStyle} // <-- ADD THIS LINE to control the TEXT color of the selected item in the list
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={courtOptions}
                  search={false}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Court"
                  searchPlaceholder="Search..."
                  value={selectedCourt}
                  onChange={item => {
                    setSelectedCourt(item.value);
                  }}
                />

                {/* 🔹 Date Selection */}
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={16} color="#aaa" style={styles.dateIcon} />
                  <Text style={styles.dateText}>
                    {formatDate(selectedDate)}
                  </Text>
                </TouchableOpacity>

                {/* 🔹 Time Selection */}
                <Text style={styles.label}>Time</Text>
                <View style={styles.timeRow}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setTempStartTime(startTime);
                      setShowTimePicker('start');
                    }}
                  >
                    <Ionicons name="time" size={16} color="#aaa" style={styles.timeIcon} />
                    <Text style={styles.timeText}>
                      {formatTime(startTime)}
                    </Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.toText}>to</Text>
                  
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setTempEndTime(endTime);
                      setShowTimePicker('end');
                    }}
                  >
                    <Ionicons name="time" size={16} color="#aaa" style={styles.timeIcon} />
                    <Text style={styles.timeText}>
                      {formatTime(endTime)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {clashError ? (
                  <Text style={styles.errorText}>{clashError}</Text>
                ) : null}

                {/* 🔹 Unavailable Slots */}
                <Text style={styles.label}>Unavailable Slots</Text>
                {unavailableSlots.length > 0 ? (
                  <View style={styles.slotsContainer}>
                    {unavailableSlots.map((slot, index) => (
                      <View key={index} style={styles.slotItem}>
                        <Text style={styles.slotText}>
                          {formatTime(new Date(slot.startDateTime))} - {formatTime(new Date(slot.endDateTime))}
                          {slot.isExternal ? " (External)" : " (Internal)"}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noSlotsText}>No existing bookings</Text>
                )}

                <Text style={styles.disclaimerText}>
                  You won't be able to book if your selected timings clash with existing bookings.
                </Text>

                {/* 🔹 Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>

                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}
              </View>
            </TouchableWithoutFeedback>

            {/* 🔹 Time Picker Modal */}
            {showTimePicker && (
              <Modal transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowTimePicker(null)}>
                  <View style={styles.timePickerOverlay}>
                    <View style={styles.timePickerContainer}>
                      <Text style={styles.timePickerTitle}>
                        {showTimePicker === 'start' ? 'Start Time' : 'End Time'}
                      </Text>
                      
                      <DateTimePicker
                        value={showTimePicker === 'start' ? tempStartTime : tempEndTime}
                        mode="time"
                        is24Hour={false}
                        display={Platform.OS === "ios" ? "spinner" : "spinner"}
                        onChange={(event, selectedTime) => {
                          if (selectedTime) {
                            if (showTimePicker === 'start') {
                              const newDate = new Date(startTime);
                              newDate.setHours(selectedTime.getHours());
                              newDate.setMinutes(selectedTime.getMinutes());
                              newDate.setSeconds(0);
                              setTempStartTime(newDate);
                            } else {
                              const newDate = new Date(endTime);
                              newDate.setHours(selectedTime.getHours());
                              newDate.setMinutes(selectedTime.getMinutes());
                              newDate.setSeconds(0);
                              setTempEndTime(newDate);
                            }
                          }
                        }}
                        style={styles.dateTimePicker}
                      />
                      
                      <View style={styles.timePickerActions}>
                        <TouchableOpacity
                          style={[styles.timePickerButton, styles.cancelButton]}
                          onPress={() => setShowTimePicker(null)}
                        >
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.timePickerButton, styles.confirmButton]}
                          onPress={() => {
                            if (showTimePicker === 'start') {
                              const newDate = new Date(startTime);
                              newDate.setHours(tempStartTime.getHours());
                              newDate.setMinutes(tempStartTime.getMinutes());
                              newDate.setSeconds(0);
                              setStartTime(newDate);
                            } else {
                              const newDate = new Date(endTime);
                              newDate.setHours(tempEndTime.getHours());
                              newDate.setMinutes(tempEndTime.getMinutes());
                              newDate.setSeconds(0);
                              setEndTime(newDate);
                            }
                            setShowTimePicker(null);
                          }}
                        >
                          <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}

            {/* 🔹 Date Picker Modal */}
            {showDatePicker && (
            <Modal transparent animationType="fade">
              <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                <View style={styles.datePickerOverlay}>
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerTitle}>Select Date</Text>

                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "calendar"}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          // --- Critical Fix: Preserve Time Components Relative to New Date ---
                          const newStartDate = new Date(selectedDate);
                          newStartDate.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds(), startTime.getMilliseconds());

                          const newEndDate = new Date(selectedDate);
                          newEndDate.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds(), endTime.getMilliseconds());

                          // Update all relevant states atomically
                          setSelectedDate(selectedDate);
                          setStartTime(newStartDate);
                          setEndTime(newEndDate);

                          // --- Optional: Reset Temporary Times to Match New Selections ---
                          setTempStartTime(newStartDate);
                          setTempEndTime(newEndDate);

                          // --- Optional: Clear Clash Error as Date Changed ---
                          // setClashError(""); // Handled by useEffect now
                        }
                      }}
                      style={styles.dateTimePicker}
                    />

                    <View style={styles.datePickerActions}>
                      <TouchableOpacity
                        style={[styles.datePickerButton, styles.cancelButton]}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.datePickerButton, styles.confirmButton]}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.buttonText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
          </CAProfileCard>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
  },
  modalCard: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginTop: 16,
    marginBottom: 6,
  },
  dropdownContainer: {
    height: 50,
    marginBottom: 12,
  },
  dropdownStyle: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
  },
  dropdownContainerStyle: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    marginTop: 2,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.cardBackground,
    marginBottom: 12,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.cardBackground,
    flex: 1,
    marginHorizontal: 4,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
  },
  toText: {
    color: "#fff",
    marginHorizontal: 8,
    fontSize: 16,
  },
  slotsContainer: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.cardBackground,
    marginBottom: 8,
  },
  slotItem: {
    paddingVertical: 4,
  },
  slotText: {
    color: "#aaa",
    fontSize: 14,
  },
  noSlotsText: {
    color: "#6B7280",
    fontSize: 14,
    padding: 12,
  },
  disclaimerText: {
    color: "#6B7280",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4B5563",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: Colors.warning,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  timePickerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  datePickerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  timePickerContainer: {
    width: "80%",
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  datePickerContainer: {
    width: "80%",
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  timePickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  datePickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: "hidden",
  },
  timePickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  datePickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  timePickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground, // Dark background like other inputs
    marginBottom: 12,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#aaa', // Light gray placeholder
  },
  dropdownText: {
    fontSize: 16,
    color: '#fff', // White text
  },
  // Style for the dropdown list background
  dropdownList: {
    backgroundColor: Colors.cardBackground, // Dark background
    borderColor: '#444',
  },
  // Style for individual items
  dropdownItem: {
    backgroundColor: Colors.cardBackground, // Dark background
    borderBottomColor: '#444',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(56, 198, 244, 0.2)', // Slight highlight for selected
  },
  itemTextStyle: {
    color: '#fff', // White text for items
  },
  selectedItemTextStyle: {
    color: Colors.primaryAlt, // Highlight color for selected item text
    fontWeight: '600',
  },
  // Style for the search input (if enabled)
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: Colors.cardBackground, // Dark background
    color: '#fff', // White text
    borderColor: '#444',
    borderRadius: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});