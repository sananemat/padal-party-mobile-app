// components/AmenitiesModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { CAProfileCard } from "./CAProfileCard"; // adjust path if needed
import Spacer from "./Spacer";

// 14 realistic amenities (label + ionicon name)
const DEFAULT_AMENITIES = [
  { label: "Parking", icon: "car" },
  { label: "Lighting", icon: "bulb" },
  { label: "Pro Shop", icon: "storefront" },
  { label: "Coaching", icon: "person" },
  { label: "Drinking Water", icon: "water" },
  { label: "Cafeteria", icon: "fast-food" },
  { label: "Free Wi-Fi", icon: "wifi" },
  { label: "First Aid", icon: "medkit" },
  { label: "Bike Rack", icon: "bicycle" },
  { label: "Shaded Seating", icon: "umbrella" },
  { label: "Indoor Court", icon: "library" }, // fallback icon
  { label: "Garden Area", icon: "leaf" },
  { label: "Refreshments", icon: "beer" },
  { label: "Locker Rooms", icon: "bed" },
];

export default function AmenitiesModal({
  visible,
  onClose,
  onUpdate,
  selectedAmenities = [], // can be array of objects OR array of labels
}) {
  // internal state as array of labels
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // normalize selectedAmenities to array of labels
    if (!selectedAmenities) {
      setSelected([]);
      return;
    }

    const labels =
      selectedAmenities.length && typeof selectedAmenities[0] === "string"
        ? selectedAmenities
        : selectedAmenities.map((a) => a.label || a);
    setSelected(labels);
  }, [selectedAmenities, visible]);

  const toggle = (label) => {
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  const handleUpdate = () => {
    // return full amenity objects that are selected (from DEFAULT_AMENITIES)
    const updated = DEFAULT_AMENITIES.filter((a) => selected.includes(a.label));
    onUpdate && onUpdate(updated);
    onClose && onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      {/* tap outside to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView experimentalBlurMethod="dimezisBlurView" intensity={70} tint="dark" style={styles.overlay}>
          {/* prevent taps inside from closing modal */}
          
            <CAProfileCard style={styles.card}>
            <TouchableWithoutFeedback >
              <View style={styles.inner}>
                <Text style={styles.title}>Amenities</Text>
                <Spacer height={"7%"}/>
                <FlatList
                  data={DEFAULT_AMENITIES}
                  keyExtractor={(item) => item.label}
                  numColumns={2}
                  contentContainerStyle={styles.list}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const checked = selected.includes(item.label);
                    return (
                      <Pressable
                        onPress={() => toggle(item.label)}
                        style={({ pressed }) => [
                          styles.item,
                          pressed && { opacity: 0.8 },
                        ]}
                      >
                        {/* checkbox first */}
                        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                          {checked && <Ionicons name="checkmark" size={14} color="#061224" />}
                        </View>

                        {/* icon */}
                        <Ionicons
                          name={item.icon}
                          size={18}
                          color={checked ? "#38C6F4" : "#9aa7bf"}
                          style={{ marginHorizontal: 8 }}
                        />

                        {/* label */}
                        <Text style={[styles.itemLabel, checked && { color: "#fff" }]} numberOfLines={1}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  }}
                />

                <View style={styles.actions}>
                  <Pressable style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable style={styles.updateBtn} onPress={handleUpdate}>
                    <Text style={styles.updateText}>Update</Text>
                  </Pressable>
                </View>
              </View>
              </TouchableWithoutFeedback>
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
  card: {
    width: "92%",
    height: "66%", // adjust if you want bigger/smaller
    padding: 8,
    marginTop: "25%",
  },
  inner: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
    marginBottom: 8,
  },
  list: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  item: {
    width: "50%", // two columns
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#38C6F4",
    borderColor: "#38C6F4",
  },
  itemLabel: {
    fontSize: 14,
    color: "#b6c2d8",
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
  },
  updateBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#EE3C79",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateText: {
    color: "#fff",
    fontWeight: "700",
  },
});
