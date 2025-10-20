import { Stack } from "expo-router"
import { StatusBar } from "react-native"
import { useUser } from "../../hooks/useUser"
import GuestOnly from "../../components/auth/GuestOnly"
import { Colors } from "../../constants/Colors"

export default function AuthLayout() {

  const {user} = useUser()
  //console.log(user)

  return (
    <GuestOnly>
      <StatusBar style="auto" />
      <Stack
              screenOptions={{
                  headerStyle: {backgroundColor: Colors.navBackground},
                  headerTintColor: Colors.title,
                  headerShadowVisible: false,
                  headerTitleStyle: {fontSize:24, fontWeight: "bold"},
                  headerBackButtonMenuEnabled: false,
                  // headerBackTitle: "",
                  headerBackButtonDisplayMode: "minimal"
                  
                  
              }}
          >
            <Stack.Screen
              name="register"
              options={{
                title: "Sign Up",
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                title: "Login",
                headerShown: true,
              }}
            />
          </Stack>
    </GuestOnly>
  )
}