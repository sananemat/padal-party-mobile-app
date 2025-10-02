import {useState, useEffect} from "react";
import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback, ScrollView, Keyboard, Text, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // if using Expo
import ThemedView from "../components/ThemedView";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import ThemedText from "../components/ThemedText";
import ThemedTextInput from "../components/ThemedTextInput";
import { Picker } from "@react-native-picker/picker";
import { Button, MD3DarkTheme, Menu, Provider, Surface, TextInput, TouchableRipple } from "react-native-paper";
import Spacer from "../components/Spacer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-paper-dropdown";
import DropDownPicker from "react-native-dropdown-picker";

const myTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      onSurface: MD3DarkTheme.colors.onSurface,
      // Transparent ripple layer
      surfaceVariant: "transparent",
      outlineVariant: "transparent",
      background: '#3C54A5',
    },
  };

const countries = ["USA", "Canada", "Australia", "UK", "Pakistan"];
const cities = ["New York", "Toronto", "Sydney", "London", "Karachi"];
const genders = ["Male", "Female", "Other"];
const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

const test = () => {

    

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
    const handleSubmit = () => {
        console.log("Register Pressed", {
            Platform: `${Platform.OS}`,
            firstName,
            lastName,
            email,
            phone: `${areaCode} ${phoneNumber}`,
            dob: `${dobDay}-${dobMonth}-${dobYear}`,
            gender,
            country,
            city,
            password,
        });
    };
    const [open, setOpen] = useState(false);
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
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Blue radial glow (top-left) */}
          <RadialGradient
            id="blueGlow"
            cx="20%" cy="90%" r="88%"
            fx="20%" fy="90%"
          >
            <Stop offset="0%" stopColor="#2DA8FF" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#0E1340" stopOpacity="0" />
          </RadialGradient>

          {/* Pink radial glow (bottom-right) */}
          <RadialGradient
            id="pinkGlow"
            cx="100%" cy="40%" r="34%"
            fx="110%" fy="30%"
          >
            <Stop offset="0%" stopColor="#FF2D78" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#0E1340" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Draw rectangles filled with those radial gradients */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#blueGlow)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#pinkGlow)" />
      </Svg>
        <Provider theme={myTheme} >
        <ThemedView safe={true} style={{marginBottom:'0%'}}>
        </ThemedView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            
                <KeyboardAwareScrollView width="100%" style={{flex:1}}  contentContainerStyle={{ padding: 20}} enableOnAndroid={true} keyboardShouldPersistTaps="handled"
                    keyboardOpeningTime={25000} extraScrollHeight={130} automaticallyAdjustKeyboardInsets={true}  scrollEventThrottle={10} extraHeight={50} 
                    resetScrollToCoords={{x: 0, y: 0}} enableAutomaticScroll={(Platform.OS === 'android')}>
                    <ThemedText style={[styles.title, {marginBottom:'-7%', marginTop:'-6%'}]} title={true}>
                        Sign Up
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
                        {/* <TextInput label="Day" mode="outlined" value={dobDay} onChangeText={setDobDay} style={[{ flex: 1, marginRight: 5 }]} keyboardType="numeric" />
                        <TextInput label="Month" mode="outlined" value={dobMonth} onChangeText={setDobMonth} style={[{ flex: 1, marginRight: 5 }, ]} keyboardType="numeric" />
                        <TextInput label="Year" mode="outlined" value={dobYear} onChangeText={setDobYear} style={[{ flex: 2 }, ]} keyboardType="numeric" /> */}
                        {/* Day */}
                    <View style={{ flex: 1.5, marginRight: 5,marginBottom: 10 }}>
                        <Dropdown
                        label={"Day"}
                        mode={"outlined"}
                        value={dobDay}
                        onSelect={setDobDay}
                        Touchable={Pressable}
                        options={days}
                        hideMenuHeader= {true}
                        menuContentStyle={[styles.textInput, {marginTop: '70%'}]}
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
                        menuContentStyle={[styles.textInput, {marginTop: '52%'}]}
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
                        menuContentStyle={[styles.textInput, {marginTop: '53%'}]}
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
                        <Text key={idx} style={{ color: "#d4d4d4", fontSize: 12, marginBottom: 2 }}>
                            • {req.label}
                        </Text>
                        ) : null
                    )}




                    <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20, borderRadius:6 }} buttonColor="#89939E" textColor="#eee">
                        Sign Up
                    </Button>
        {/* <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>First Name</ThemedText>
            <ThemedTextInput 
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
            />
        </ThemedView>
        <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Last Name</ThemedText>
            <ThemedTextInput 
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
            />
        </ThemedView>
        <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedTextInput 
                placeholder="Enter your Email address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
        </ThemedView>
        <ThemedText style={[styles.label, styles.inputContainer]}>Date of Birth</ThemedText>
        <ThemedView style={[styles.row, styles.inputContainer]}>
            <Picker selectedValue={dobDay} style={{flex:2}} onValueChange={setDobDay}>
                {[...Array(31)].map((_, i) => <Picker.Item key={i} label={`${i+1}`} value={i+1} />)}
            </Picker>
            <Picker selectedValue={dobMonth} style={{flex:2}} onValueChange={setDobMonth}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                .map((m,i) => <Picker.Item key={i} label={m} value={i+1} />)}
            </Picker>
            <Picker selectedValue={dobYear} style={{flex:3}} onValueChange={setDobYear}>
                {[...Array(100)].map((_,i) => {
                const year = new Date().getFullYear() - i;
                return <Picker.Item key={year} label={`${year}`} value={year}/>
                })}
            </Picker>
        </ThemedView> */}
        {/*<ThemedText  style={styles.label}>Gender</ThemedText>
        <Picker selectedValue={gender} onValueChange={setGender}>
            <Picker.Item label="Male" value="male"/>
            <Picker.Item label="Female" value="female"/>
            <Picker.Item label="Other" value="other"/>
        </Picker>

        <ThemedText style={styles.label}>Country</ThemedText>
        <Picker selectedValue={country} onValueChange={setCountry}>
            {["USA","UK","Canada","Pakistan","Australia"].map((c) =>
                <Picker.Item key={c} label={c} value={c}/>
            )}
        </Picker>

        <ThemedText style={styles.label}>City</ThemedText>
        <Picker selectedValue={city} onValueChange={setCity}>
            {["New York","London","Toronto","Karachi","Sydney"].map((c) =>
                <Picker.Item key={c} label={c} value={c}/>
            )}
        </Picker>
        <ThemedText style={styles.label}>Password</ThemedText>
        <ThemedTextInput
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        />

        {Object.entries(requirements).map(([key, notMet]) =>
        notMet && (
            <ThemedText key={key} style={styles.requirement}>
                {key === "capital" && "• At least 1 capital letter"}
                {key === "number" && "• At least 1 number"}
                {key === "minLength" && "• Minimum 8 characters"}
            </ThemedText>
        )
        )} */}
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </Provider>
    </ThemedView>
   
  );
}
export default test;

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
});
