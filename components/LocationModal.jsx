import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { CAProfileCard } from './CAProfileCard';
import { BlurView } from 'expo-blur';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function LocationModal({
  visible,
  onClose,
  onUpdate,
  initialRegion
}) {
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('');
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current location on mount
  useEffect(() => {
    (async () => {
      if (!visible) return; // run only when modal opens
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission denied');
        return;
      }
      let loc =  await Location.getCurrentPositionAsync({});
      const { latitude, longitude } =initialRegion? initialRegion: loc.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      reverseGeocode(latitude, longitude);
    })();
  }, [visible]);

  // Reverse geocode for dragging map
  const reverseGeocode = async (lat, lng) => {
    try {
      let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=en&extra_computations=ADDRESS_DESCRIPTORS`
      const res = await fetch(
        url
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // console.log("Address Object => ", data.results)
        setAddress(data.results[0].formatted_address);
      }
    } catch (e) {
      console.error('Reverse geocode error', e);
    }
  };

  const useCurrentLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission denied');
        return;
      }
      let loc =  await Location.getCurrentPositionAsync({});
      // console.log("Current Location => ", loc)
      const { latitude, longitude } = loc.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      reverseGeocode(latitude, longitude);
      setInputText("");

  };

  // Fetch autocomplete predictions
  const fetchPredictions = async (text) => {
    if (!text || text.length < 2) {
      setPredictions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${GOOGLE_PLACES_API}/autocomplete/json?input=${encodeURIComponent(text)}&key=${GOOGLE_API_KEY}&language=en&components=country:pk`
      );
      const data = await res.json();
      if (data.predictions) {
        setPredictions(data.predictions);
      } else {
        setPredictions([]);
      }
    } catch (e) {
      console.error('Autocomplete error', e);
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a suggestion
  const handleSelectPlace = async (place) => {
    Keyboard.dismiss()
    setInputText(place.description);
    setPredictions([]);
    try {
      const res = await fetch(
        `${GOOGLE_PLACES_API}/details/json?place_id=${place.place_id}&key=${GOOGLE_API_KEY}&fields=geometry,formatted_address`
      );
      const data = await res.json();
      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        
        setAddress(place.description);
      }
    } catch (e) {
      console.error('Place details error', e);
    }
  };

  const handleRegionChangeComplete = (reg) => {
    setRegion(reg);
    reverseGeocode(reg.latitude, reg.longitude);
  };

  const clearEverything = async() => {
    setInputText(""); onClose(); setPredictions([]);
  }
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={clearEverything}>
        <BlurView intensity={70} tint="dark" style={styles.overlay}>
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        > */}
        
        <CAProfileCard style={styles.card}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.mainContent}>
                <Text style={styles.title}>Location</Text>

                {/* Map Section */}
                <View style={styles.mapSection}>
                  <View style={styles.mapWrap}>
                    {region && (
                      <MapView
                        style={styles.map}
                        provider="google"
                        initialRegion={region}
                        region={region}
                        onRegionChangeComplete={handleRegionChangeComplete}
                      >
                        <Marker coordinate={region} />
                      </MapView>
                    )}
                  </View>

                  
                </View>

                {/* Selected Address */}
                <Text style={styles.selectedAddress}>
                  {address || 'Move the map to pick a location'}
                </Text>
                {/* Use Current Location Button */}
                  <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={useCurrentLocation}
                  >
                    <Text style={styles.currentLocationButtonText}>
                      📍 Use Current Location
                    </Text>
                  </TouchableOpacity>

                {/* Address Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your address"
                  placeholderTextColor="white"
                  value={inputText}
                  onFocus={() => fetchPredictions(inputText)}
                  onChangeText={(txt) => {
                    setInputText(txt);
                    fetchPredictions(txt);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Predictions List */}
                {predictions.length > 0 && (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={predictions}
                    style={styles.list}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => handleSelectPlace(item)}
                      >
                        <Text numberOfLines={2} style={styles.predictionText}>
                          {item.description}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>

            {/* Action Buttons (Fixed at Bottom) */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={clearEverything}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => {
                  if (address) {
                    onUpdate(address, region);
                    onClose();
                  }
                }}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </CAProfileCard>
        {/* </KeyboardAvoidingView> */}
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: "92%",
    height: "85%", // adjust if you want bigger/smaller
    padding: 8,
    marginTop: "15%",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 8,
  },
  mapWrap: {
    flex: 1,
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,

  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  mapSection: {
    flex: 0.8, // Map takes ~55% of main content
    justifyContent: 'space-between',
  },
  currentLocationButton: {
    marginTop: 8,
    marginBottom: 8,
    alignSelf: "center",
    backgroundColor: '#EE3C79', // subtle pink tint
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    width: "100%"
  },
  currentLocationButtonText: {
    color: '#fff',
    alignSelf:"center"
  },
  map: {
    width: '100%',
    height: "100%",
  },
  selectedAddress: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    paddingVertical: 14,
    borderRadius: 6,
    backgroundColor: '#000320',
    color: "white"
  },
  list: {
    maxHeight: 200,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "rgba(6,18,36,0.9)",
    marginBottom: 10,
  },
  listItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  predictionText: { color: "#fff", fontSize: 14 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
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
    color: '#fff',
  },
  centeredWrapper: {
    flex: 1,
    justifyContent: "space-between",
    flexGrow: 1
  },
});
