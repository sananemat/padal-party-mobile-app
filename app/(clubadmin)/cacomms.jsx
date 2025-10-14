import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ThemedView from "../../components/ThemedView";
import CABreadcrumbs from "../../components/CABreadcrumbs";
import Spacer from "../../components/Spacer";

const RECENT_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Tournament Registration Open",
    description: "Registration for the Spring Championship is now open...",
    time: "2h ago",
    views: 124,
    clicks: 23,
    reactions: 15,
  },
  {
    id: "2",
    title: "Court Maintenance Notice",
    description: "Court 3 will be under maintenance this weekend...",
    time: "1d ago",
    views: 89,
    clicks: 12,
    reactions: 8,
  },
];

export default function CAComms() {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDesc, setAnnouncementDesc] = useState("");
  const [announcementAudience, setAnnouncementAudience] = useState("All Members");
  const [announcementImage, setAnnouncementImage] = useState(null);
  const [notificationType, setNotificationType] = useState("Tournament Update");
  const [notificationTournament, setNotificationTournament] = useState("");
  const [notificationSubject, setNotificationSubject] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [activeTab, setActiveTab] = useState("announcement");

  // Image picker handler
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAnnouncementImage(result.assets[0].uri);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <CABreadcrumbs />
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "announcement" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("announcement")}
        >
          <Text style={styles.tabButtonText}>Announcement</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "notification" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("notification")}
        >
          <Text style={styles.tabButtonText}>Notification</Text>
        </TouchableOpacity>
      </View>
      {activeTab === "announcement" ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <Spacer height={8} />
            <View style={styles.card}>
              <Text style={styles.cardTitle}>+ Create New Announcement</Text>
              <TextInput
                style={styles.input}
                placeholder="Announcement Title"
                placeholderTextColor="#999"
                value={announcementTitle}
                onChangeText={setAnnouncementTitle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description..."
                placeholderTextColor="#999"
                value={announcementDesc}
                onChangeText={setAnnouncementDesc}
                multiline
              />
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Ionicons name="image-outline" size={22} color="#fff" />
                <Text style={styles.imagePickerText}>Add Image/Media</Text>
              </TouchableOpacity>
              {announcementImage && (
                <Image
                  source={{ uri: announcementImage }}
                  style={styles.previewImage}
                />
              )}
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>{announcementAudience}</Text>
                <Ionicons name="chevron-down" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton}>
                <Ionicons name="megaphone" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Recent Announcements</Text>
            <FlatList
              data={RECENT_ANNOUNCEMENTS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.announcementCard}>
                  <Text style={styles.announcementTitle}>{item.title}</Text>
                  <Text style={styles.announcementDesc}>{item.description}</Text>
                  <View style={styles.announcementMetaRow}>
                    <Text style={styles.announcementMeta}>{item.time}</Text>
                    <View style={styles.announcementStats}>
                      <Ionicons name="eye" size={14} color="#fff" />
                      <Text style={styles.announcementStatText}>{item.views}</Text>
                      <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 8 }} />
                      <Text style={styles.announcementStatText}>{item.clicks}</Text>
                      <Ionicons name="heart" size={14} color="#fff" style={{ marginLeft: 8 }} />
                      <Text style={styles.announcementStatText}>{item.reactions}</Text>
                    </View>
                  </View>
                </View>
              )}
              ListFooterComponent={<Spacer height={32} />}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Spacer height={8} />
          <View style={styles.card}>
            <Text style={styles.cardTitle}>+ Create New Announcement</Text>
            <Text style={styles.label}>Notification Type</Text>
            <View style={styles.notificationTypeRow}>
              <TouchableOpacity
                style={[
                  styles.notificationTypeButton,
                  notificationType === "Tournament Update" &&
                    styles.notificationTypeButtonActive,
                ]}
                onPress={() => setNotificationType("Tournament Update")}
              >
                <Text
                  style={[
                    styles.notificationTypeText,
                    notificationType === "Tournament Update" &&
                      styles.notificationTypeTextActive,
                  ]}
                >
                  Tournament Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.notificationTypeButton,
                  notificationType === "General Tournament" &&
                    styles.notificationTypeButtonActive,
                ]}
                onPress={() => setNotificationType("General Tournament")}
              >
                <Text
                  style={[
                    styles.notificationTypeText,
                    notificationType === "General Tournament" &&
                      styles.notificationTypeTextActive,
                  ]}
                >
                  General Tournament
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Recipient</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={styles.dropdownText}>
                {notificationTournament || "Select Tournament"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#fff" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              placeholderTextColor="#999"
              value={notificationSubject}
              onChangeText={setNotificationSubject}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Message"
              placeholderTextColor="#999"
              value={notificationMessage}
              onChangeText={setNotificationMessage}
              multiline
            />
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Send Notification</Text>
            </TouchableOpacity>
          </View>
          <Spacer height={32} />
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  breadcrumbs: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#0E1340",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#3C54A5",
  },
  tabButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#0E1340",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    color: "#38C6F4",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#3C54A5",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#6B7280",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 8,
  },
  previewImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  dropdown: {
    backgroundColor: "#3C54A5",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#EE3C79",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  notificationTypeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  notificationTypeButton: {
    borderWidth: 1,
    borderColor: "#38C6F4",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
  },
  notificationTypeButtonActive: {
    backgroundColor: "#232A4D",
    borderColor: "#38C6F4",
  },
  notificationTypeText: {
    color: "#38C6F4",
    fontWeight: "600",
    fontSize: 14,
  },
  notificationTypeTextActive: {
    color: "#fff",
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 8,
  },
  announcementCard: {
    backgroundColor: "#0E1340",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  announcementTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  announcementDesc: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
  },
  announcementMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  announcementMeta: {
    color: "#aaa",
    fontSize: 13,
  },
  announcementStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  announcementStatText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 2,
  },
});