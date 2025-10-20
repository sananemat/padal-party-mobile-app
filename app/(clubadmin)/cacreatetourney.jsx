import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import CABreadcrumbs from "../../components/CABreadcrumbs";
import { CAProfileCard } from "../../components/CAProfileCard";
import StepIndicator from "react-native-step-indicator";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../../constants/Colors";

// 🔹 Sample categories and skill levels
const CATEGORIES = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Mixed", value: "mixed" },
  { label: "U-18", value: "u18" },
];
const SKILL_LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Elite", value: "elite" },
];
const TEAM_COUNTS = [8, 16, 24, 32];
const MATCH_FORMATS = [
  { label: "1 Set", value: "1_set" },
  { label: "Best of 3", value: "best_of_3" },
  { label: "Race to 9 Games", value: "race_to_9" },
];
const TOURNAMENT_FORMATS = [
  { label: "Round Robin", value: "round_robin" },
  { label: "Knockout", value: "knockout" },
  { label: "Group Stage + Knockouts", value: "group_knockout" },
  { label: "Custom Brackets", value: "custom_brackets" },
];

export default function CreateTournament() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    photo: null,
    name: "",
    category: "",
    skillLevel: "",
    numberOfTeams: 8,
    entryFee: "",
    startDate: "",
    startTime: "",
    description: "",
    format: "knockout",
    matchFormat: "1_set",
    scheduling: "auto",
    courts: [],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 🔹 Handle form input changes
  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // 🔹 Handle image upload
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData("photo", result.assets[0].uri);
    }
  };

  // 🔹 Handle Next button
  const handleNext = () => {
    if (currentStep === 0 && !formData.name) {
      Alert.alert("Required", "Please enter a tournament name.");
      return;
    }
    if (currentStep === 0 && !formData.category) {
      Alert.alert("Required", "Please select a category.");
      return;
    }
    if (currentStep === 0 && !formData.skillLevel) {
      Alert.alert("Required", "Please select a skill level.");
      return;
    }
    if (currentStep === 1 && !formData.format) {
      Alert.alert("Required", "Please select a tournament format.");
      return;
    }
    if (currentStep === 2 && !formData.scheduling) {
      Alert.alert("Required", "Please select a scheduling option.");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert("Success", "Tournament created successfully!");
      setCurrentStep(0);
      setFormData({
        photo: null,
        name: "",
        category: "",
        skillLevel: "",
        numberOfTeams: 8,
        entryFee: "",
        startDate: "",
        startTime: "",
        description: "",
        format: "knockout",
        matchFormat: "1_set",
        scheduling: "auto",
        courts: [],
      });
    }
  };

  // 🔹 Handle Previous button
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 🔹 Render Step 1: Details
  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Tournament Photo</Text>
      <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
        {formData.photo ? (
          <Image source={{ uri: formData.photo }} style={styles.photo} />
        ) : (
        <View style={{alignItems:"center"}}>
            <View style={styles.cameraIconCircle}>
                <Ionicons name="camera" size={32} color="#6B7280" />
            </View>
            <Text style={styles.photoText}>Tap to add tournament photo</Text>
        </View>
        )}
      </TouchableOpacity>

      <Spacer height={20} />

      <Text style={styles.label}>Tournament Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tournament name"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
        placeholderTextColor="#6B7280"
      />

      <Spacer height={16} />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={styles.dropdown}
            data={CATEGORIES}
            labelField="label"
            valueField="value"
            placeholder="Select category"
            activeColor={Colors.cardBackground}
            placeholderStyle={styles.dropdownText}
            value={formData.category}
            onChange={item => updateFormData("category", item.value)}
            selectedTextStyle={styles.dropdownText}
            iconColor="#6B7280"
            itemTextStyle={styles.dropdownText}
            containerStyle={styles.dropdownList}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Skill Level</Text>
          <Dropdown
            style={styles.dropdown}
            data={SKILL_LEVELS}
            labelField="label"
            valueField="value"
            placeholder="Select level"
            activeColor={Colors.cardBackground}
            placeholderStyle={styles.dropdownText}
            value={formData.skillLevel}
            onChange={item => updateFormData("skillLevel", item.value)}
            selectedTextStyle={styles.dropdownText}
            iconColor="#6B7280"
            itemTextStyle={styles.dropdownText}
            containerStyle={styles.dropdownList}
          />
        </View>
      </View>

      <Spacer height={16} />

      <Text style={styles.label}>Number of Teams</Text>
      <View style={styles.teamButtons}>
        {TEAM_COUNTS.map(count => (
          <TouchableOpacity
            key={count}
            style={[
              styles.teamButton,
              formData.numberOfTeams === count && styles.teamButtonActive,
            ]}
            onPress={() => updateFormData("numberOfTeams", count)}
          >
            <Text style={[
              styles.teamButtonText,
              formData.numberOfTeams === count && styles.teamButtonTextActive,
            ]}>
              {count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Spacer height={16} />

      <Text style={styles.label}>Entry Fee</Text>
      <TextInput
        style={styles.input}
        placeholder="Entry Fee"
        value={formData.entryFee}
        onChangeText={(text) => updateFormData("entryFee", text)}
        keyboardType="numeric"
        placeholderTextColor="#6B7280"
      />

      <Spacer height={16} />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: formData.startDate ? "#fff" : "#6B7280" }}>
              {formData.startDate || "mm/dd/yyyy"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={date => {
              setShowDatePicker(false);
              updateFormData("startDate", date.toLocaleDateString());
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={{ color: formData.startTime ? "#fff" : "#6B7280" }}>
              {formData.startTime || "--:-- --"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            onConfirm={date => {
              setShowTimePicker(false);
              updateFormData("startTime", date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }}
            onCancel={() => setShowTimePicker(false)}
          />
        </View>
      </View>

      <Spacer height={16} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Add tournament description..."
        value={formData.description}
        onChangeText={(text) => updateFormData("description", text)}
        multiline
        numberOfLines={4}
        placeholderTextColor="#6B7280"
      />
    </>
  );

  // Step 2: Format
  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Tournament Format</Text>
      <View style={styles.radioGroup}>
        {TOURNAMENT_FORMATS.map(item => (
          <TouchableOpacity
            key={item.value}
            style={styles.radioRow}
            onPress={() => updateFormData("format", item.value)}
          >
            <RadioButton.Android
              value={item.value}
              status={formData.format === item.value ? 'checked' : 'unchecked'}
              onPress={() => updateFormData("format", item.value)}
              color={Colors.uiBackground}
              uncheckedColor="#6B7280"
            />
            <Text style={styles.radioLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
  
      <Spacer height={16} />
  
      <Text style={styles.label}>Match Format</Text>
      <View style={styles.radioGroup}>
        {MATCH_FORMATS.map(item => (
          <TouchableOpacity
            key={item.value}
            style={styles.radioRow}
            onPress={() => updateFormData("matchFormat", item.value)}
          >
            <RadioButton.Android
              value={item.value}
              status={formData.matchFormat === item.value ? 'checked' : 'unchecked'}
              onPress={() => updateFormData("matchFormat", item.value)}
              color={Colors.uiBackground}
              uncheckedColor="#6B7280"
            />
            <Text style={styles.radioLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

// Step 3: Schedule
const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>Scheduling Options</Text>
      <View style={styles.teamButtons}>
        <TouchableOpacity
          style={[
            styles.teamButton,
            formData.scheduling === "auto" && styles.teamButtonActive,
          ]}
          onPress={() => updateFormData("scheduling", "auto")}
        >
          <Text style={[
            styles.teamButtonText,
            formData.scheduling === "auto" && styles.teamButtonTextActive,
          ]}>
            Auto
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.teamButton,
            formData.scheduling === "manual" && styles.teamButtonActive,
          ]}
          onPress={() => updateFormData("scheduling", "manual")}
        >
          <Text style={[
            styles.teamButtonText,
            formData.scheduling === "manual" && styles.teamButtonTextActive,
          ]}>
            Manual
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

// Step 4: Publish
const renderStep4 = () => (
    <>
      <Text style={styles.stepTitle}>Review & Publish</Text>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>{formData.name || "Tournament Name"}</Text>
        <Text style={styles.reviewSubtitle}>
          {CATEGORIES.find(c => c.value === formData.category)?.label || "Category"} · {SKILL_LEVELS.find(s => s.value === formData.skillLevel)?.label || "Skill Level"}
        </Text>
        <View style={styles.reviewRow}>
          <View style={styles.reviewCol}>
            <Text style={styles.reviewLabel}>Teams</Text>
            <Text style={styles.reviewValue}>{formData.numberOfTeams} Teams</Text>
          </View>
          <View style={styles.reviewCol}>
            <Text style={styles.reviewLabel}>Entry Fee</Text>
            <Text style={styles.reviewValue}>{formData.entryFee ? `Rs. ${formData.entryFee}` : "--"}</Text>
          </View>
        </View>
        <View style={styles.reviewRow}>
          <View style={styles.reviewCol}>
            <Text style={styles.reviewLabel}>Format</Text>
            <Text style={styles.reviewValue}>{TOURNAMENT_FORMATS.find(f => f.value === formData.format)?.label}</Text>
          </View>
          <View style={styles.reviewCol}>
            <Text style={styles.reviewLabel}>Start Date</Text>
            <Text style={styles.reviewValue}>{formData.startDate || "--"}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.reviewCard, {backgroundColor:Colors.cardBackground}]}>
        <Text style={styles.reviewSectionTitle}>Tournament Details</Text>
        <Text style={styles.reviewDetail}>Structure: <Text style={styles.reviewDetailValue}>{TOURNAMENT_FORMATS.find(f => f.value === formData.format)?.label}</Text></Text>
        <Text style={styles.reviewDetail}>Match Format: <Text style={styles.reviewDetailValue}>{MATCH_FORMATS.find(m => m.value === formData.matchFormat)?.label}</Text></Text>
        <Text style={styles.reviewDetail}>Schedule: <Text style={styles.reviewDetailValue}>{formData.scheduling === "auto" ? "Auto Generated" : "Manual"}</Text></Text>
      </View>
      <View style={[styles.reviewCard, {backgroundColor:Colors.cardBackground}]}>
        <Text style={styles.reviewSectionTitle}>Registration</Text>
        <Text style={styles.reviewDetail}>Registration Opens: <Text style={styles.reviewDetailValue}>Immediately</Text></Text>
        <Text style={styles.reviewDetail}>Registration Closes: <Text style={styles.reviewDetailValue}>{formData.startDate || "--"}</Text></Text>
        <Text style={styles.reviewDetail}>Max Teams: <Text style={styles.reviewDetailValue}>{formData.numberOfTeams}</Text></Text>
      </View>
      <Spacer height={16} />
      <Text style={{ color: "#6B7280", textAlign: "center" }}>
        Press "Publish Tournament" to finish.
      </Text>
    </>
  );

  // 🔹 Render current step content
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      default:
        return null;
    }
  };

  // 🔹 Stepper configuration
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.uiBackground,
    stepStrokeFinishedColor: Colors.uiBackground,
    stepStrokeUnFinishedColor: "#6B7280",
    separatorFinishedColor: Colors.uiBackground,
    separatorUnFinishedColor: Colors.cardBackground,
    stepIndicatorFinishedColor: Colors.uiBackground,
    stepIndicatorUnFinishedColor: Colors.cardBackground,
    stepIndicatorCurrentColor: Colors.uiBackground,
    stepIndicatorLabelFontSize: 12,
    currentStepIndicatorLabelFontSize: 12,
    stepIndicatorLabelCurrentColor: "#fff",
    stepIndicatorLabelFinishedColor: "#fff",
    stepIndicatorLabelUnFinishedColor: "#fff",
    labelColor: "#6B7280",
    labelSize: 12,
    currentStepLabelColor: Colors.uiBackground,
  };

  return (
    <ThemedView style={styles.container}>
      <CABreadcrumbs />
      <View style={styles.stepperContainer}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={["Details", "Format", "Schedule", "Publish"]}
          stepCount={4}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        keyboardOpeningTime={25000} extraScrollHeight={130} automaticallyAdjustKeyboardInsets={true}  scrollEventThrottle={10} extraHeight={50} 
                    resetScrollToCoords={{x: 0, y: 0}} enableAutomaticScroll={(Platform.OS === 'android')}
      >
          <Spacer height={16} />
          {renderCurrentStep()}
          <Spacer height={20} />
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Text style={styles.previousButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep === 3 ? "Publish Tournament" : "Next"}
              </Text>
              {currentStep === 3 && <Ionicons name="send" size={16} color="#fff" style={styles.icon} />}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: "2.5%",
      paddingTop: 16,
    },
    stepperContainer: {
      marginBottom: 16,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
      marginBottom: 12,
    },
    photoContainer: {
      width: "100%",
      height: 180,
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    photo: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
      resizeMode: "cover",
    },
    cameraIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.uiBackground,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    photoText: {
      color: "#6B7280",
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },
    label: {
      fontSize: 14,
      color: "#cbd5e6",
      marginBottom: 6,
    },
    input: {
        width: "100%",
        height: 48,
        backgroundColor: Colors.cardBackground,
        borderRadius: 8,
        paddingHorizontal: 12,
        color: "#fff",
        fontSize: 16,
        justifyContent: "center",
        marginBottom: 8,
      },
      textArea: {
        height: 100,
        textAlignVertical: "top",
        marginBottom: 8,
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
      },
      halfWidth: {
        width: "48%",
      },
      dropdown: {
        width: "100%",
        height: 48,
        backgroundColor: Colors.cardBackground,
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#444",
        marginBottom: 8,
      },
      dropdownText: {
        color: "#fff",
        fontSize: 16,
      },
      dropdownList: {
        backgroundColor: Colors.cardBackground,
        borderColor: "#444",
        activeColor: Colors.cardBackground,
      },
      teamButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      },
      teamButton: {
        flex: 1,
        height: 48,
        backgroundColor: Colors.cardBackground,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: Colors.uiBackground,
      },
      teamButtonActive: {
        backgroundColor: Colors.uiBackground,
        borderColor: Colors.uiBackground,
      },
      teamButtonText: {
        color: "#fff",
        fontSize: 16,
      },
      teamButtonTextActive: {
        color: "#fff",
        fontWeight: "bold",
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 24,
        gap: 8,
      },
      nextButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
      },
      nextButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
      },
      previousButton: {
        backgroundColor: "#4B5563",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 8,
      },
      previousButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
      },
      icon: {
        marginLeft: 8,
      },
      // Radio buttons
      radioGroup: {
        marginBottom: 8,
      },
      radioRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
      },
      radioLabel: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 8,
      },
      // Review cards
      reviewCard: {
        backgroundColor: Colors.uiBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      },
      reviewTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
      },
      reviewSubtitle: {
        color: "#fff",
        fontSize: 15,
        marginBottom: 12,
      },
      reviewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      },
      reviewCol: {
        flex: 1,
        alignItems: "flex-start",
      },
      reviewLabel: {
        color: "#fff",
        fontSize: 13,
        marginBottom: 2,
      },
      reviewValue: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
      },
      reviewSectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
      },
      reviewDetail: {
        color: "#fff",
        fontSize: 13,
        marginBottom: 4,
      },
      reviewDetailValue: {
        color: "#fff",
        fontWeight: "bold",
      },
    });