// app/components/ContactInfoModal.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import { CAProfileCard } from "./CAProfileCard";

export default function ContactInfoModal({
  visible,
  onClose,
  initialPhone = "",
  initialEmail = "",
  initialWebsite = "",
  onUpdate,
}) {
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [website, setWebsite] = useState(initialWebsite);

  const handleCancel = () => {
    setPhone(initialPhone);
    setEmail(initialEmail);
    setWebsite(initialWebsite);
    onClose();
  };

  const handleUpdate = () => {
    onUpdate({ phone, email, website });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView experimentalBlurMethod="dimezisBlurView" intensity={70} tint="dark" style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <CAProfileCard style={styles.modalCard}>
                <Text style={styles.title}>Contact Info</Text>

                {/* Phone */}
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#ccc"
                  keyboardType="phone-pad"
                />

                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#ccc"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {/* Website */}
                <Text style={styles.label}>Website</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Website"
                  value={website}
                  onChangeText={setWebsite}
                  placeholderTextColor="#ccc"
                  keyboardType="url"
                  autoCapitalize="none"
                />

                {/* Buttons */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </CAProfileCard>
            </View>
          </TouchableWithoutFeedback>
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    marginBottom: 6,
    marginTop: 12,
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#EE3C79",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});