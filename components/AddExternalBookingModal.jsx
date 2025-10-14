// app/components/AddExternalBookingModal.jsx
import React, { useState, useEffect } from "react";
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

export default function AddExternalBookingModal({
  visible,
  onClose,
  onAddBooking,
  courts,
  matches,
  bookingDate, // Date object from active tab
}) {
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [tempStartTime, setTempStartTime] = useState(new Date());
  const [tempEndTime, setTempEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(null); // 'start' or 'end'
  const [error, setError] = useState("");
  const [clashError, setClashError] = useState("");
  const [courtDropdownOpen, setCourtDropdownOpen] = useState(false);

  // 🔹 Convert courts to dropdown format
  const courtOptions = courts.map(court => ({
    label: court.name,
    value: court.id,
  }));

  // 🔹 Get matches for the selected date (using local timezone)
  const getMatchesForDate = () => {
    if (!selectedCourt) return [];
    
    // Get date components in local timezone
    const targetDate = new Date(bookingDate);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    return matches.filter(match => {
      const matchDate = new Date(match.startDateTime);
      const matchYear = matchDate.getFullYear();
      const matchMonth = matchDate.getMonth();
      const matchDay = matchDate.getDate();
      
      return (
        match.courtId === selectedCourt &&
        matchYear === targetYear &&
        matchMonth === targetMonth &&
        matchDay === targetDay
      );
    });
  };

  // 🔹 Format time for display (in local timezone)
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // 🔹 Check for time clashes (all scenarios covered)
  const checkForClash = (newStart, newEnd) => {
    const existingMatches = getMatchesForDate();
    
    console.log("Checking clash:");
    console.log("New booking:", newStart.toLocaleTimeString(), "-", newEnd.toLocaleTimeString());
    
    for (const match of existingMatches) {
      const existingStart = new Date(match.startDateTime);
      const existingEnd = new Date(match.endDateTime);
      
      console.log("Against existing:", existingStart.toLocaleTimeString(), "-", existingEnd.toLocaleTimeString());
  
      // Convert to timestamps for easier comparison
      const newStartTS = newStart.getTime();
      const newEndTS = newEnd.getTime();
      const existingStartTS = existingStart.getTime();
      const existingEndTS = existingEnd.getTime();
  
      // ALL overlap scenarios:
      // 1. New start is within existing slot (inclusive start, exclusive end)
      if (newStartTS >= existingStartTS && newStartTS < existingEndTS) {
        console.log("Clash: New start within existing");
        return true;
      }
      // 2. New end is within existing slot (exclusive start, inclusive end)
      if (newEndTS > existingStartTS && newEndTS <= existingEndTS) {
        console.log("Clash: New end within existing");
        return true;
      }
      // 3. New slot completely encompasses existing slot
      if (newStartTS <= existingStartTS && newEndTS >= existingEndTS) {
        console.log("Clash: New encompasses existing");
        return true;
      }
      // 4. Existing slot completely encompasses new slot
      if (existingStartTS <= newStartTS && existingEndTS >= newEndTS) {
        console.log("Clash: Existing encompasses new");
        return true;
      }
    }
    return false;
  };

  // 🔹 Handle time validation
//   useEffect(() => {
//     if (selectedCourt) {
//       console.log("Checking clash for:", {
//         start: startTime.toLocaleTimeString(),
//         end: endTime.toLocaleTimeString()
//       });
      
//       if (checkForClash(startTime, endTime)) {
//         setClashError("Time slot unavailable - clashes with existing booking");
//         console.log("Clash detected!");
//       } else {
//         setClashError("");
//         console.log("No clash");
//       }
//     }
//   }, [startTime, endTime, selectedCourt]);

  // 🔹 Handle court selection
  const handleCourtSelect = (courtId) => {
    setSelectedCourt(courtId);
    setClashError(""); // Clear clash error when court changes
  };

  // 🔹 Handle save booking
  const handleSave = () => {
    if (!selectedCourt) {
      setError("Please select a court");
      return;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }
    
    // CRITICAL: Re-run clash check right before saving
    const hasClash = checkForClash(startTime, endTime);
    if (hasClash) {
      setError("Time slot unavailable - clashes with existing booking");
      return;
    }
  
    const newBooking = {
      id: Date.now().toString(),
      courtId: selectedCourt,
      name: "External Booking",
      startDateTime: startTime,
      endDateTime: endTime,
      isExternal: true,
    };
  
    onAddBooking(newBooking);
    resetForm();
    onClose();
  };

  // 🔹 Reset form
  const resetForm = () => {
    setSelectedCourt("");
    setStartTime(new Date());
    setEndTime(new Date());
    setError("");
    setClashError("");
  };

  // 🔹 Handle cancel
  const handleCancel = () => {
    resetForm();
    onClose();
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

  // 🔹 Get unavailable slots for selected court
  const unavailableSlots = selectedCourt 
    ? getMatchesForDate().map(match => ({
        start: new Date(match.startDateTime),
        end: new Date(match.endDateTime),
        isExternal: match.isExternal
      }))
    : [];

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
                <Text style={styles.title}>Add External Booking</Text>

                {/* 🔹 Court Selection (Dropdown) */}
                <Text style={styles.label}>Court</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownText}
                  containerStyle={styles.dropdownList}
                  itemContainerStyle={styles.dropdownItem}
                  itemTextStyle={styles.itemTextStyle}
                  selectedStyle={styles.dropdownItemSelected} // Style for the container of the selected item in the list
                  activeColor="#061224"
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={courtOptions} // Use the transformed courtOptions array
                  search={false} // Enable if you want search functionality
                  maxHeight={300}
                  labelField="label" // Specify the field for the display label
                  valueField="value" // Specify the field for the value
                  placeholder="Select Court"
                  searchPlaceholder="Search..." // Placeholder for search input (if enabled)
                  value={selectedCourt} // Bind to selectedCourt state
                  onChange={item => {
                    // Update state when an item is selected
                    setSelectedCourt(item.value);
                    setClashError(""); // Clear clash error when court changes
                  }}
                />
                

                {/* 🔹 Booking Date */}
                <Text style={styles.label}>Booking Date</Text>
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>{formatDate(bookingDate)}</Text>
                </View>

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
                          {formatTime(slot.start)} - {formatTime(slot.end)}
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
                    <Text style={styles.buttonText}>Save Booking</Text>
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
                              setTempStartTime(selectedTime);
                            } else {
                              setTempEndTime(selectedTime);
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
                              setStartTime(tempStartTime);
                            } else {
                              setEndTime(tempEndTime);
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
  content: {
    // removed - no longer needed
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
    backgroundColor: "#061224",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
  },
  dropdownContainerStyle: {
    backgroundColor: "#061224",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    marginTop: 2,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#061224",
    marginBottom: 12,
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
    backgroundColor: "#061224",
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
    backgroundColor: "#061224",
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
    backgroundColor: "#EE3C79",
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
    color: "#EF4444",
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
  timePickerContainer: {
    width: "80%",
    backgroundColor: "#061224",
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
  dateTimePicker: {
    width: "100%",
    backgroundColor: "#000320",
    borderRadius: 12,
    overflow: "hidden",
  },
  timePickerActions: {
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
  confirmButton: {
    backgroundColor: "#EE3C79",
    marginLeft: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#061224', // Dark background like other inputs
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
    backgroundColor: '#061224', // Dark background
    borderColor: '#444',
  },
  // Style for individual items
  dropdownItem: {
    backgroundColor: '#061224', // Dark background
    borderBottomColor: '#444',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(56, 198, 244, 0.2)', // Slight highlight for selected
  },
  itemTextStyle: {
    color: '#fff', // White text for items
  },
  selectedItemTextStyle: {
    color: '#38C6F4', // Highlight color for selected item text
    fontWeight: '600',
  },
  // Style for the search input (if enabled)
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#061224', // Dark background
    color: '#fff', // White text
    borderColor: '#444',
    borderRadius: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});