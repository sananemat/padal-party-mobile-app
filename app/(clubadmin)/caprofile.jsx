// app/clubadmin/caprofile.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CAProfileCard } from "../../components/CAProfileCard";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import EditPhotoModal from "../../components/EditPhotoModal";
import { BlurView } from "expo-blur";
import AmenitiesModal from "../../components/AmenitiesModal";
import LocationModal from "../../components/LocationModal";
import ContactInfoModal from "../../components/ContactInfoModal";
import CABreadcrumbs from "../../components/CABreadcrumbs";

export default function CAProfile() {
  const [amenities, setAmenities] = useState([]);
  const [amenitiesModalVisible, setAmenitiesModalVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: "+92 300 1234567",
    email: "info@elitepadel.com",
    website: "www.elitepadel.com",
  });
  
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const [clubPhoto, setClubPhoto] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAIAAADVSURYAAAACXBIWXMAAC4jAAAuIwF4pT92AAAG0mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDMtMjlUMTM6MjQ6NTktMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDMtMjlUMTM6MzQ6MTQtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAzLTI5VDEzOjM0OjE0LTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI3Yzk0Yjc4LTgwNDktNDdmNS1iNjRhLTQxMmVjMTRjZGIzZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmEyMGI5ZjVjLTE4ZjItNTQ0YS04ZTM5LWFlN2JlY2MzYmYyMCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmU4YWJhMDExLTEwMjUtNGI3OC04NDNhLTU3ODEzOTkyYTVlZSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZThhYmEwMTEtMTAyNS00Yjc4LTg0M2EtNTc4MTM5OTJhNWVlIiBzdEV2dDp3aGVuPSIyMDIxLTAzLTI5VDEzOjI0OjU5LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDAyMmI1ZjAtM2U0NS00MjBkLThhM2ItNDA3MzBhZDZmZDM2IiBzdEV2dDp3aGVuPSIyMDIxLTAzLTI5VDEzOjI0OjU5LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjdjOTRiNzgtODA0OS00N2Y1LWI2NGEtNDEyZWMxNGNkYjNmIiBzdEV2dDp3aGVuPSIyMDIxLTAzLTI5VDEzOjM0OjE0LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBl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"
    // Or: "data:image/jpeg;base64,...." when you get from API
  );
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [clubName, setClubName] = useState("Elite Padel Club Islamabad"); // main display
  const [tempClubName, setTempClubName] = useState(""); // input inside modal
  const [modalVisible, setModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [location, setLocation] = useState({
    coords: { latitude: 24.8607, longitude: 67.0011 }, // default
    address: 'Karachi, Pakistan'
  });

  const handleOpenEdit = () => setModalVisible(true);
  const handleCancel = () => setModalVisible(false);

  const handleUpdatePhoto = (newImageDataUri) => {
    // set the clubPhoto to the new base64 data URI
    setClubPhoto(newImageDataUri);
    setModalVisible(false);
    // TODO: call your API to persist updated image (send newImageDataUri)
  };

  return (
    <ThemedView style={styles.container}>
      {/* Breadcrumbs */}
      {/* <Text style={styles.breadcrumbs}>Dashboard &gt; Club Profile</Text> */}
      <CABreadcrumbs/>
      {/* Scrollable container */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Club Photo */}
        <CAProfileCard  >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Club Photo</Text>
            <TouchableOpacity onPress={handleOpenEdit}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri:clubPhoto
            }}
            style={styles.clubImage}
            resizeMode= "cover"
          />
        </CAProfileCard>

        {/* 2. Club Name */}
        <CAProfileCard>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Club Name</Text>
              <Text style={styles.subtitle}>
              {clubName}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsNameModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </CAProfileCard>

        {/* 3. Amenities */}
        <CAProfileCard  >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Amenities</Text>
            <TouchableOpacity onPress={() => setAmenitiesModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.amenitiesContainer}>
            {amenities.map((item, idx) => (
              <View key={idx} style={styles.amenityPill}>
                <Ionicons
                  name={item.icon}
                  size={16}
                  color="#00BCD4"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.amenityText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </CAProfileCard>

        {/* 4. Location */}
        <CAProfileCard >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Location</Text>
            <TouchableOpacity onPress={()=>setLocationModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Spacer height={20}/>
          <View style={styles.inlineRow}>
            <Ionicons
              name="location-sharp"
              size={16}
              color="#EE3C79"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.subtitle}>
              {location.address}
            </Text>
          </View>
        </CAProfileCard>

        {/* 5. Contact Info */}
        <CAProfileCard style={{marginBottom: 26}}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Contact Info</Text>
            <TouchableOpacity onPress={() => setContactModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={16} color="#00BCD4" marginRight={5} />
            <Text style={styles.subtitle}>{contactInfo.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="mail" size={16} color="#00BCD4"  marginRight={5} />
            <Text style={styles.subtitle}>{contactInfo.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="globe" size={16} color="#00BCD4"  marginRight={5} />
            <Text style={styles.subtitle}>{contactInfo.website}</Text>
          </View>
        </CAProfileCard>
      </ScrollView>
      <EditPhotoModal
        visible={modalVisible}
        initialImage={clubPhoto}
        onCancel={handleCancel}
        onUpdate={handleUpdatePhoto}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isNameModalVisible}
        onRequestClose={() => setIsNameModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsNameModalVisible(false)} >
        <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
          
          <CAProfileCard style={{ height: "30%", width: "90%" }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
            <Text style={styles.modalTitle}>Edit Club Name</Text>
            <Spacer height={'10%'}/>
            <TextInput
              style={styles.input}
              placeholder="Enter Club Name"
              value={tempClubName}
              onChangeText={setTempClubName}
              placeholderTextColor="#ccc"
            />

            <Spacer height={'20%'}/>


            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsNameModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.updateButton}
                onPress={() => {
                  setClubName(tempClubName); // update main state
                  setIsNameModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
            </View>
            </View>
            </TouchableWithoutFeedback>
          </CAProfileCard>
          
        </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
      <AmenitiesModal
        visible={amenitiesModalVisible}
        onClose={() => setAmenitiesModalVisible(false)}
        onUpdate={(updated) => setAmenities(updated)}
        selectedAmenities={amenities}
      />
      <LocationModal
        //apiKey={"AIzaSyAn65ZEtIa9Rz_Tvfan4gl_nV7eSlNmm2A"}
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        initialRegion={location.coords}
        initialAddress={location.address}
        onUpdate={(address, region) => setLocation({ coords:region, address })}
      />
      <ContactInfoModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        initialPhone={contactInfo.phone}
        initialEmail={contactInfo.email}
        initialWebsite={contactInfo.website}
        onUpdate={(updated) => setContactInfo(updated)}
      />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
    paddingTop: 16,
  },
  breadcrumbs: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 2,
    marginRight:1,

  },
  editText: {
    fontSize: 14,
    color: "#EE3C79",
    fontWeight: "600",
  },
  clubImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 8,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    paddingBottom: 8
  },
  amenityPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "rgba(56, 198, 244,0.2)",
  },
  amenityText: {
    color: "#38C6F4",
    fontSize: 14,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#fff"
  },
  input: {
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#061224',
    color: "#fff"
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4B5563",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#EE3C79",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },  
});
