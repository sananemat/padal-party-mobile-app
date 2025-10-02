// components/EditPhotoModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { BlurView } from "expo-blur";
import Spacer from "./Spacer";

export default function EditPhotoModal({
  visible,
  initialImage, // can be a remote uri or data:image/... base64
  onCancel,
  onUpdate, // (newImageDataUri) => void
}) {
  const [preview, setPreview] = useState(initialImage || null);
  const [processing, setProcessing] = useState(false);

  // reset preview when modal opens or initialImage changes
  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage, visible]);

  // Ask permissions (optional pre-check)
  const requestPermissions = async () => {
    // ImagePicker's requestMediaLibraryPermissionsAsync covers both iOS/Android
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  };

  const pickImageFromGallery = async () => {
    try {
      const granted = await requestPermissions();
      if (!granted) {
        alert("Permission required to access photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const selectedUri = result.assets[0].uri;

      // result.uri -> resize & convert to base64
      setProcessing(true);

      const manipResult = await ImageManipulator.manipulateAsync(
        selectedUri,
        [{ resize: { width: 800, height: 600 } }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      // manipResult.base64 contains base64 string
      const dataUri = `data:image/jpeg;base64,${manipResult.base64}`;
      setPreview(dataUri);
    } catch (err) {
      console.error("Image pick error:", err);
      alert("Could not pick image. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = () => {
    if (!preview) {
      alert("Please select an image first.");
      return;
    }
    onUpdate(preview);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* BlurView to blur the background */}
      <TouchableWithoutFeedback onPress={onCancel} >
      <BlurView intensity={70} style={styles.blurContainer} tint="default">
        <View style={styles.centered}>
          <View style={styles.card}>
            <TouchableWithoutFeedback>
            <View>
            <Text style={styles.title}>Edit Club Photo</Text>

            <Spacer height={"7%"}/>



            <Text style={styles.sectionLabel}>Current Photo</Text>
            <Spacer height={"2%"}/>
            <View style={styles.previewBox}>
              {processing ? (
                <ActivityIndicator size="large" />
              ) : preview ? (
                <Image source={{ uri: preview }} style={styles.image} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>No image</Text>
                </View>
              )}
            </View>

              <Spacer height={"5%"}/>
            <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
              Upload New Photo
            </Text>
            <Spacer height={"3%"}/>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.cancelText}>Upload Photo</Text>
            </TouchableOpacity>

            <Text style={styles.recommend}>Recommended Size 800px By 600px</Text>
            <Spacer height={"5%"}/>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
            </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "90%",
    height: "70%", // per your request
    backgroundColor: "#3C54A5",
    borderRadius: 16,
    padding: 16,
    marginTop: "40%",
    // drop shadow
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center"
  },
  sectionLabel: {
    color: "#cbd5e6",
    fontSize: 14,
    marginTop: 6,
  },
  previewBox: {
    width: "100%",
    height: 180,
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#12203a",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { color: "#666" },
  uploadBtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#0E1340",
    borderRadius: 8,
  },
  uploadBtnText: { color: "#061224", fontWeight: "700" },
  recommend: {
    color: "#9aa7bf",
    textAlign: "center",
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#4B5563",
    alignItems: "center",
  },
  cancelText: { color: "#fff", fontWeight: "600" },
  updateBtn: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#EE3C79",
    alignItems: "center",
  },
  updateText: { color: "#fff", fontWeight: "700" },
});