import { Stack } from "expo-router"
import { StatusBar, useColorScheme } from "react-native"
import { useUser } from "../../hooks/useUser"
import ClubAdminOnly from "../../components/auth/ClubAdminOnly"
import { Colors } from "../../constants/Colors"

export default function ClubAdminLayout() {

  const {user} = useUser()
  //console.log(user)
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.dark

  return (
    <>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{
          headerStyle: {backgroundColor: theme.navBackground},
          headerTintColor: theme.title,
          headerShadowVisible: false,
          headerTitleStyle: {fontSize:24, fontWeight: "bold"},
          headerBackButtonMenuEnabled: false,
          headerBackTitle: "Back"
          
          
      }} 
      >
        <Stack.Screen name="cadashboard" options={{title: 'Club Admin Portal' }}/>
        <Stack.Screen name="caprofile" options={{title: 'Club Profile'}}/>
        <Stack.Screen name="cacourts" options={{title: 'Court Management'}}/>
        <Stack.Screen name="cabookings" options={{title: 'Booking Management'}}/>
        {/* <Stack.Screen name="caprofile" options={{title: 'Testing',headerShown: false}}/> */}
      </Stack>
    </>
  )
}