import { useState } from 'react';
import Spacer from '../../components/Spacer';
import ThemedText from '../../components/ThemedText';
import { useUser } from '../../hooks/useUser';
import { Colors } from '../../constants/Colors'
import { Keyboard, StyleSheet, View, TouchableWithoutFeedback, Text, Platform, Pressable } from "react-native";
import ThemedView from "../../components/ThemedView";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { Button, MD3DarkTheme,  Provider,  TextInput,  } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-paper-dropdown";


const myTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      onSurface: MD3DarkTheme.colors.onSurface,
      // Transparent ripple layer
      surfaceVariant: "transparent",
      outlineVariant: "transparent",
      outline: 'transparent', // Dark border
      outlineVariant: 'transparent', // Dark border
      onSurfaceVariant: Colors.placeholder,
      background: Colors.cardBackground,
      
    },
  };
const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];


const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    // phone number broken into 2 parts
    const [areaCode, setAreaCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // date of birth broken into day / month / year
    const [dobDay, setDobDay] = useState("");
    const [dobMonth, setDobMonth] = useState("");
    const [dobYear, setDobYear] = useState("");

    // dropdowns
    const [gender, setGender] = useState("");  
    const [country, setCountry] = useState("");  
    const [city, setCity] = useState("");

    const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));

    // Months (1–12)
    const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
    ];

    // Years (e.g., from 1900 to current year)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 120 }, (_, i) => {
    const year = currentYear - i;
    return { label: `${year}`, value: `${year}` };
    });

    const [password, setPassword] = useState("")

    const passwordRequirements = [
        { label: "At least 1 capital letter", test: (pw) => /[A-Z]/.test(pw) },
        { label: "At least 1 number", test: (pw) => /\d/.test(pw) },
        { label: "Minimum 8 characters", test: (pw) => pw.length >= 8 },
      ];
    
    const [error,setError] = useState(null)

    const {user, register} = useUser()

    const handleSubmit = async () => {
        setError(null)
        try{
            console.log("Register Pressed", email, password, firstName,lastName, areaCode, phoneNumber,dobYear+dobMonth+dobDay,gender,country,city, "player")
            await register("data:image/jpeg;base64,/9j/4AAQSkZJRg...",email,password, firstName,lastName, areaCode, phoneNumber,dobYear+"-"+dobMonth+"-"+dobDay,gender,country,city, "player")
        }
        catch(error){
            setError(error.message)
        }
    }

    const countryList = [
        { label: 'Pakistan', value: 'pk' },
        { label: 'India', value: 'in' },
        { label: 'United States', value: 'us' },
        { label: 'Australia', value: 'au' },
        { label: 'United Kingdom', value: 'uk' },
      ];
    
      const cityList = [
        { label: 'Karachi', value: 'karachi' },
        { label: 'Lahore', value: 'lahore' },
        { label: 'Islamabad', value: 'islamabad' },
        { label: 'Mumbai', value: 'mumbai' },
        { label: 'Delhi', value: 'delhi' },
        { label: 'New York', value: 'ny' },
        { label: 'Los Angeles', value: 'la' },
        { label: 'London', value: 'london' },
        { label: 'Sydney', value: 'sydney' },
      ];

  return (
    <ThemedView style={[styles.container]}>
      {/* <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}> */}
        {/* <Defs> */}
          {/* Blue radial glow (top-left) */}
          {/* <RadialGradient
            id="blueGlow"
            cx="20%" cy="90%" r="88%"
            fx="20%" fy="90%"
          >
            <Stop offset="0%" stopColor="#2DA8FF" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#0E1340" stopOpacity="0" />
          </RadialGradient> */}

          {/* Pink radial glow (bottom-right) */}
          {/* <RadialGradient
            id="pinkGlow"
            cx="100%" cy="40%" r="34%"
            fx="110%" fy="30%"
          >
            <Stop offset="0%" stopColor="#FF2D78" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#0E1340" stopOpacity="0" />
          </RadialGradient> */}
        {/* </Defs> */}

        {/* Draw rectangles filled with those radial gradients */}
        {/* <Rect x="0" y="0" width="100%" height="100%" fill="url(#blueGlow)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#pinkGlow)" /> */}
      {/* </Svg> */}
      
        <Provider theme={myTheme} >
        {/* <ThemedView safe={true} style={{marginBottom:'0%'}}>
        </ThemedView> */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            
                <KeyboardAwareScrollView width="100%" style={{flex:1}}  contentContainerStyle={{ padding: 20}} enableOnAndroid={true} keyboardShouldPersistTaps="handled"
                    keyboardOpeningTime={25000} extraScrollHeight={130} automaticallyAdjustKeyboardInsets={true}  scrollEventThrottle={10} extraHeight={50} 
                    resetScrollToCoords={{x: 0, y: 0}} enableAutomaticScroll={(Platform.OS === 'android')}>
                    <ThemedText style={[styles.title, {marginBottom:'-16%', marginTop:'-8%'}]} title={true}>
                        {/* Sign Up */}
                    </ThemedText>
                    <Spacer/>
                    {/* First Name */}
                    <TextInput autoCapitalize="words" label="First Name" mode="outlined" value={firstName} onChangeText={setFirstName} style={[{ marginBottom: 10 },]} />

                    {/* Last Name */}
                    <TextInput autoCapitalize="words" label="Last Name" mode="outlined" value={lastName} onChangeText={setLastName} style={[{ marginBottom: 10 },]} />

                    {/* Email */}
                    <TextInput autoCapitalize="none" label="Email" mode="outlined" value={email} onChangeText={setEmail} keyboardType="email-address" style={[{ marginBottom: 10 }, ]} />
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        <TextInput label="Area Code" mode="outlined" keyboardType="phone-pad" value={areaCode} onChangeText={setAreaCode} style={[{ flex: 1, marginRight: 5 }, ]} />
                        <TextInput label="Phone Number" mode="outlined" keyboardType="number-pad" value={phoneNumber} onChangeText={setPhoneNumber} style={[{ flex: 2 }, ]} />
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 0 }}>
                    <View style={{ flex: 1.5, marginRight: 5,marginBottom: 10 }}>
                        <Dropdown
                        label={"Day"}
                        mode={"outlined"}
                        value={dobDay}
                        onSelect={setDobDay}
                        Touchable={Pressable}
                        options={days}
                        hideMenuHeader= {true}
                        menuContentStyle={[styles.textInput, {marginTop: '-60%'}]}
                        />
                    </View>

                    {/* Month */}
                    <View style={{ flex: 2.7, marginRight: 5 ,marginBottom: 10}}>
                        <Dropdown
                        label={"Month"}
                        mode={"outlined"}
                        value={dobMonth}
                        onSelect={setDobMonth}
                        Touchable={Pressable}
                        options={months}
                        hideMenuHeader= {true}
                        menuContentStyle={[styles.textInput, {marginTop: '-33%'}]}
                        />
                    </View>

                    {/* Year */}
                    <View style={{ flex: 2,marginBottom: 10 }}>
                        <Dropdown
                        label={"Year"}
                        mode={"outlined"}
                        value={dobYear}
                        onSelect={setDobYear}
                        Touchable={Pressable}
                        options={years}
                        hideMenuHeader= {true}
                        menuContentStyle={[styles.textInput, {marginTop: '-45%'}]}
                        />
                    </View>



                    </View>
                    
                    <View style={[{ marginBottom: 10 },]}>
                        <Dropdown
                        label="Gender"
                        placeholder="Select Gender"
                        options={genderList}
                        value={gender}
                        Touchable={Pressable}
                        onSelect={setGender}
                        menuContentStyle={[styles.textInput, {marginTop: '20%'}]}
                        mode="outlined"
                        hideMenuHeader= {true}
                        />
                    </View>

                    <View style={[{ marginBottom: 10 },]}>
                        <Dropdown
                        label="Select your country"
                        placeholder="Select Country"
                        options={countryList}
                        value={country}
                        onSelect={setCountry}
                        Touchable={Pressable}
                        menuContentStyle={[styles.textInput, {marginTop: '20%'}]}
                        maxMenuHeight={160}
                        mode="outlined"
                        hideMenuHeader= {true}
                        />
                    </View>
                    <View style={[{ marginBottom: 10 },]}>
                        <Dropdown
                        label="Select your city"
                        placeholder="Select City"
                        options={cityList}
                        value={city}
                        onSelect={setCity}
                        Touchable={Pressable}
                        menuContentStyle={[styles.textInput, {marginTop: '20%'}]}
                        maxMenuHeight={160}
                        mode="outlined"
                        hideMenuHeader= {true}
                        />
                    </View>
                    <TextInput
                        label="Password"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={{ marginBottom: 10, height: 56 }}
                        right={
                            <TextInput.Icon
                              icon={showPassword ? "eye" : "eye-off"} // change icon
                              onPress={() => setShowPassword(!showPassword)} 
                              forceTextInputFocus={false}
                            />
                          }
                    />

                    {/* Password requirements */}
                    {passwordRequirements.map((req, idx) =>
                        !req.test(password) ? (
                        <Text key={idx} style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 2 }}>
                            • {req.label}
                        </Text>
                        ) : null
                    )}




                    <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20, borderRadius:6 }} buttonColor="#4B5563" textColor="#eee">
                        Sign Up
                    </Button>
                    {error && <Text style={styles.error}>{error}</Text>}
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </Provider>
    </ThemedView>
   
  );
}

export default Register

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'default', justifyContent: 'center' },
    inputContainer: { width: '80%', marginBottom: 15, backgroundColor: 'rgba(0,0,0,0)', left:'-5%' },
    input: { width: '100%', padding: 10 },
    label: { fontSize: 14, color: '#ccc', marginBottom: 5, backgroundColor: 'rgba(0,0,0,0)' },
    row: { flexDirection: 'row', width: '80%', marginBottom: 15 },
    requirement: { color: 'red', fontSize: 12, marginLeft: 5 },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10
    },
    textInput: {
        backgroundColor: '#0E1340',
        color: '#d4d4d4',
        borderRadius: 6,
        marginTop: '-10%', borderColor: '#d4d4d4', borderWidth: 0.7
    },
    error: {
        color: Colors.warning,
        padding: 10,
        backgroundColor: '#f5c1c8',
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: 6,
        margin: 10,
      }
});