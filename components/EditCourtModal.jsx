// app/components/EditCourtModal.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { CAProfileCard } from "./CAProfileCard";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import ColorPicker from 'react-native-wheel-color-picker';
import DateTimePicker from "@react-native-community/datetimepicker";

// Use the same default image as in AddCourtModal
const SAMPLE_COURT_IMAGE = "image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAIAAADVSURYAAAACXBIWXMAAC4jAAAuIwF4pT92AAAG0mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDMtMjlUMTM6MjQ6NTktMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDMtMjlUMTM6MzQ6MTQtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAzLTI5VDEzOjM0OjE0LTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI3Yzk0Yjc4LTgwNDktNDdmNS1iNjRhLTQxMmVjMTRjZGIzZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmEyMGI5ZjVjLTE4ZjItNTQ0YS04ZTM5LWFlN2JlY2MzYmYyMCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmU4YWJhMDExLTEwMjUtNGI3OC04NDNhLTU3ODEzOTkyYTVlZSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZThhYmEwMTEtMTAyNS00Yjc4LTg0M2EtNTc4MTM5OTJhNWVlIiBzdEV2dDp3aGVuPSIyMDIxLTAzLTI5VDEzOjI0OjU5LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDAyMmI1ZjAtM2U0NS00MjBkLThhM2ItNDA3MzBhZDZmZDM2IiBzdEV2dDp3aGVuPSIyMDIxLTAzLTI5VDEzOjI0OjU5LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjdjOTRiNzgtODA0OS00N2Y1LWI2NGEtNDEyZWMxNGNkYjNmIiBzdEV2dDp3aGVuPSIyMDIxLTAzLTI5VDEzOjM0OjE0LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5rTLjCAAAcaElEQVR4nO3daVwT574H8GcmCwkJKAKyIzsoIouAoqqqIsusyqqyE5YQss3cF/HGGJJ5Jgk4Av/vry9k8swzA00vmZlnI2iaRgAA7pBcnwAAwx2EEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4BiEEACOQQgB4Bif6xMAQxbVWadtyKU6aqnOOqTpQQgRYidS4k46j+O5RRMCe65P8F4BIQT9TNtSQXUXa1tyEU3dLkTw+V4IgbBVw7EPF2IX7k70nEDRNc30OAOijVZ2aqtOq4u/VZUcRrdVvJwQSYeTjooQXCfvRHJ4TRYxCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp6/nhNVbTfcSMhGiWesVMYsQEhgqsT4xCEEHBAU31Gfnwt3W0w1CiWSGfuvXXB0G9yCE4K6iOmp......";

export default function EditCourtModal({
  visible,
  onClose,
  onUpdateCourt,
  courtData, // The court object to edit
}) {
  // 🔹 Form state
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [color, setColor] = useState("#38C6F4");
  const [dayRate, setDayRate] = useState("");
  const [nightRate, setNightRate] = useState("");

  // 🔹 Time pickers
  const [dayTime, setDayTime] = useState(new Date());
  const [nightTime, setNightTime] = useState(new Date());
  const [tempDayTime, setTempDayTime] = useState(new Date());
  const [tempNightTime, setTempNightTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 🔹 Pre-populate form when courtData changes
  useEffect(() => {
    if (courtData && visible) {
        console.log('Court data daytime:', courtData.daytime, typeof courtData.daytime);
        console.log('Is Date?', courtData.daytime instanceof Date);
        setName(courtData.name || "");
        setImageUri(courtData.image || null);
        setColor(courtData.color || "#38C6F4");
        setDayRate(courtData.dayrate?.toString() || "");
        setNightRate(courtData.nightrate?.toString() || "");
        
        // ✅ Directly use Date objects (no parsing needed!)
        setDayTime(courtData.daytime || new Date());
        setNightTime(courtData.nighttime || new Date());
        setTempDayTime(courtData.daytime || new Date());
        setTempNightTime(courtData.nighttime || new Date());
    }
  }, [courtData, visible]);

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Allow access to photos to select court image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const compressed = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      setImageUri(compressed.uri);
    }
  };

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter a court name.");
      return;
    }
    if (!dayRate || !nightRate) {
      Alert.alert("Validation", "Please enter hourly rates.");
      return;
    }

    const updatedCourt = {
      ...courtData,
      name: name.trim(),
      image: imageUri || courtData.image || SAMPLE_COURT_IMAGE,
      color: color,
      daytime: dayTime,
      dayrate: parseFloat(dayRate),
      nighttime: nightTime,
      nightrate: parseFloat(nightRate),
    };

    onUpdateCourt(updatedCourt);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <BlurView intensity={70} tint="dark" style={styles.overlay}>
          <CAProfileCard style={styles.modalCard}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.content}>
                <Text style={styles.title}>Edit Court</Text>

                {/* 🔹 Name */}
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter court name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#aaa"
                />

                {/* 🔹 Photo Upload - LEFT ALIGNED */}
                <Text style={styles.label}>Photo</Text>
                <TouchableOpacity style={styles.imageContainer} onPress={handleSelectImage}>
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.selectedImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="camera" size={24} color="#aaa" />
                      <Text style={styles.uploadText}>Upload Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* 🔹 Court Color Picker */}
                <Text style={styles.label}>Court Color</Text>
                <View style={styles.colorRow}>
                  <TouchableOpacity
                    style={[styles.colorBox, { backgroundColor: color }]}
                    onPress={() => setShowColorPicker(true)}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    value={color}
                    onChangeText={(text) => {
                      if (/^#[0-9A-Fa-f]{6}$/.test(text) || text === "#") {
                        setColor(text);
                      }
                    }}
                    placeholder="#38C6F4"
                    placeholderTextColor="#aaa"
                  />
                </View>

                {/* 🔹 Day Pricing */}
                <Text style={styles.label}>Day Pricing</Text>
                <View style={styles.pricingRow}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setTempDayTime(dayTime);
                      setShowTimePicker('day');
                    }}
                  >
                    <Ionicons name="time" size={16} color="#aaa" style={styles.timeIcon} />
                    <Text style={styles.timeText}>
                      {dayTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    placeholder="Hourly rate (PKR)"
                    value={dayRate}
                    onChangeText={setDayRate}
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                  />
                </View>

                {/* 🔹 Night Pricing */}
                <Text style={styles.label}>Night Pricing</Text>
                <View style={styles.pricingRow}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setTempNightTime(nightTime);
                      setShowTimePicker('night');
                    }}
                  >
                    <Ionicons name="time" size={16} color="#aaa" style={styles.timeIcon} />
                    <Text style={styles.timeText}>
                      {nightTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    placeholder="Hourly rate (PKR)"
                    value={nightRate}
                    onChangeText={setNightRate}
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                  />
                </View>

                {/* 🔹 Buttons */}
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>

            {/* 🔹 Color Picker Modal */}
            {showColorPicker && (
              <Modal transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowColorPicker(false)}>
                  <View style={styles.colorPickerOverlay}>
                    <View style={styles.colorPickerContainer}>
                      <ColorPicker
                        color={color}
                        onColorChange={setColor}
                        thumbSize={40}
                        sliderSize={20}
                        noSnap={true}
                        row={false}
                      />
                      <TouchableOpacity 
                        style={styles.doneButton} 
                        onPress={() => setShowColorPicker(false)}
                      >
                        <Text style={styles.doneButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}

            {/* 🔹 Time Picker Modal */}
            {showTimePicker && (
              <Modal transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowTimePicker(null)}>
                  <View style={styles.timePickerOverlay}>
                    <View style={styles.timePickerContainer}>
                      <Text style={styles.timePickerTitle}>
                        {showTimePicker === 'day' ? 'Day Start Time' : 'Night Start Time'}
                      </Text>
                      
                      <DateTimePicker
                        value={showTimePicker === 'day' ? tempDayTime : tempNightTime}
                        mode="time"
                        is24Hour={false}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedTime) => {
                          if (selectedTime) {
                            if (showTimePicker === 'day') {
                              setTempDayTime(selectedTime);
                            } else {
                              setTempNightTime(selectedTime);
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
                            if (showTimePicker === 'day') {
                              setDayTime(tempDayTime);
                            } else {
                              setNightTime(tempNightTime);
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
  modalCard: {
    width: "92%",
    height: "75%", // adjust if you want bigger/smaller
    padding: 8,
    marginTop: "25%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
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
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#061224",
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#061224",
  },
  uploadText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 6,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
  },
  pricingRow: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  timeIcon: {
    marginRight: 8,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4B5563",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButton: {
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
  colorPickerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  colorPickerContainer: {
    width: "80%",
    height: "50%",
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 12,
    overflow: "hidden",
  },
  doneButton: {
    backgroundColor: '#EE3C79',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
});