import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import Spacer from "../../../components/Spacer"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import {NeonCard} from '../../../components/NeonCard'
import { StatsCard } from '../../../components/StatsCard'
import { Colors } from '../../../constants/Colors'
import { router } from 'expo-router'

const Home = () => {
  return (
    <ThemedView style={styles.container} safe={true}>

      {/* <Spacer />
      <ThemedText title={true} style={styles.heading}>
        Your Reading List
      </ThemedText> */}
      <Spacer/>
      <Pressable onPress={() => router.push("/career")} style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'25%'}}>
        <StatsCard 
          profileImage={{uri:"https://randomuser.me/api/portraits/men/32.jpg"}}
          racketIcon={require("../../../assets/icons/racket.png")}
        />
      </Pressable>
      <Spacer height={60}/>
      {/* <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'7%'}}>
        <NeonCard flexDirection={'row'} style={{flex:1}} onPress={() => console.log("Rectangle pressed")}>
          <Spacer width={'10%'}/>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '15%', height: '100%', color:"#fff", }} />
          <Spacer width={'15%'}/>
          <Text style={{ color: "#fff",flex:1  }}>Private Court</Text>
        </NeonCard>
      </View> */}
      <Spacer height={10}/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'15%'}}>
        <NeonCard onPress={() => router.push("/bookacourt")}>
          <Image source={require("../../../assets/icons/BOOK A COURT.png")} style={{ width: '40%', height: '30%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>Book a Court</Text>
        </NeonCard>
        <Spacer width={'10%'}/>
        <NeonCard variant={4} onPress={() => router.push("/findamatch")}>
          <Image source={require("../../../assets/icons/FIND A MATCH.png")} style={{ width: '35%', height: '30%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>Find a Match</Text>
        </NeonCard>
      </View>
      <Spacer height={10}/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'15%'}}>
        <NeonCard variant={2} onPress={() => router.push("/mybookings")}>
          <Image source={require("../../../assets/icons/MY BOOKNGS.png")} style={{ width: '35%', height: '50%', color:"#fff" }} />
          <Spacer height={10}/>
          <Text style={{ color: "#fff" }}>My Bookings</Text>
        </NeonCard>
        <Spacer width={'10%'}/>
        <NeonCard variant={3} onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/LEADERBOARDS.png")} style={{ width: '35%', height: '50%', color:"#fff" }} />
          <Spacer height={10}/>
          <Text style={{ color: "#fff" }}>Leaderboards</Text>
        </NeonCard>
      </View>
      <Spacer height={10}/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'15%'}}>
        <NeonCard variant={4} onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/MY CLUB.png")} style={{ width: '40%', height: '40%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>My Clubs</Text>
        </NeonCard>
        <Spacer width={'10%'}/>
        <NeonCard  variant={2} onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/TOURNAMENTS.png")} style={{ width: '25%', height: '37%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>Tournaments</Text>
        </NeonCard>
      </View>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
})