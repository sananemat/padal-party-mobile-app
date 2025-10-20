// app/components/OpenMatchTimerModal.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { CAProfileCard } from "./CAProfileCard";
import { Colors } from "../constants/Colors";

export default function OpenMatchTimerModal({
  visible,
  onClose,
}) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // 🔹 Timer logic
  useEffect(() => {
    let id = null;
    if (isRunning) {
      id = setInterval(() => {
        setTime(prev => {
          let { hours, minutes, seconds } = prev;
          seconds++;
          if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
              minutes = 0;
              hours++;
            }
          }
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
    setIntervalId(id);
    return () => clearInterval(id);
  }, [isRunning]);

  // 🔹 Format numbers to 2 digits
  const formatTime = (num) => num.toString().padStart(2, '0');

  // 🔹 Start/Pause button handler
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  // 🔹 Reset timer
  const resetTimer = () => {
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setIsRunning(false);
  };

  // 🔹 End match (close modal)
  const endMatch = () => {
    resetTimer();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback>
        <BlurView experimentalBlurMethod="dimezisBlurView" intensity={70} tint="dark" style={styles.overlay}>
          <CAProfileCard style={styles.modalCard}>
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                <Text style={styles.title}>Open Match</Text>

                {/* 🔹 Timer Display */}
                <View style={styles.timerContainer}>
                  <View style={styles.timerBox}>
                    <Text style={styles.timerText}>
                      {formatTime(time.hours)}
                    </Text>
                    <Text style={styles.timerLabel}>Hours</Text>
                  </View>
                  
                  <Text style={styles.colonText}>:</Text>
                  
                  <View style={styles.timerBox}>
                    <Text style={styles.timerText}>
                      {formatTime(time.minutes)}
                    </Text>
                    <Text style={styles.timerLabel}>Minutes</Text>
                  </View>
                  
                  <Text style={styles.colonText}>:</Text>
                  
                  <View style={styles.timerBox}>
                    <Text style={styles.timerText}>
                      {formatTime(time.seconds)}
                    </Text>
                    <Text style={styles.timerLabel}>Seconds</Text>
                  </View>
                </View>

                {/* 🔹 Action Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={toggleTimer}
                  >
                    <Text style={styles.buttonText}>
                      {isRunning ? "Pause" : "Start"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.endButton}
                    onPress={endMatch}
                  >
                    <Text style={styles.buttonText}>End Match</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetTimer}
                  >
                    <Text style={styles.resetButtonText}>Reset Timer</Text>
                  </TouchableOpacity>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    width: "90%",
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  timerBox: {
    backgroundColor: Colors.cardBackground,
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  timerLabel: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  colonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginHorizontal: 8,
  },
  buttonRow: {
    width: "100%",
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  endButton: {
    backgroundColor: Colors.cardBackground, // Same as timer boxes
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButton: {
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  resetButtonText: {
    color: Colors.primaryAlt, // Cyan
    fontWeight: "600",
    fontSize: 16,
  },
});