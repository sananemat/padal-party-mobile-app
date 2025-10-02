import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react";
import { Text } from "react-native";

const ClubAdminOnly = ({ children }) => {
    const {user, authChecked, logout} = useUser();
    const router = useRouter()

    useEffect(() => {
        if (authChecked) {
          if (!user || user.role !== "clubAdmin") {
            logout();
            router.replace("/login");
          }
        }
      }, [user, authChecked]);
    
      if (!authChecked || !user || user.role !== "clubAdmin") {
        return <Text>Loading...</Text>;
      }
    
      return children;
}

export default ClubAdminOnly