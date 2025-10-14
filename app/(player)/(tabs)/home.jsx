import { Image, StyleSheet, Text, View } from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import Spacer from "../../../components/Spacer"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import {NeonCard} from '../../../components/NeonCard'
import { StatsCard } from '../../../components/StatsCard'

const Home = () => {
  return (
    <ThemedView style={styles.container} safe={true}>

      {/* <Spacer />
      <ThemedText title={true} style={styles.heading}>
        Your Reading List
      </ThemedText> */}
      <Spacer/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'25%'}}>
        <StatsCard 
          profileImage={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQi2Mm5P8j09P4hPKa1B-t9eIOHzHmR7IBkw&s"}}
          racketIcon={require("../../../assets/icons/racket.png")}
        />
      </View>
      <Spacer height={40}/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'7%'}}>
        <NeonCard flexDirection={'row'} style={{flex:1}} onPress={() => console.log("Rectangle pressed")}>
          <Spacer width={'10%'}/>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '15%', height: '100%', color:"#fff", }} />
          <Spacer width={'15%'}/>
          <Text style={{ color: "#fff",flex:1  }}>Private Court</Text>
        </NeonCard>
      </View>
      <Spacer height={10}/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'15%'}}>
        <NeonCard onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '30%', height: '30%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>Book a Court</Text>
        </NeonCard>
        <Spacer width={'10%'}/>
        <NeonCard onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '30%', height: '30%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>Find a Match</Text>
        </NeonCard>
      </View>
      <Spacer height={10}/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'15%'}}>
        <NeonCard onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '30%', height: '30%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>My Bookings</Text>
        </NeonCard>
        <Spacer width={'10%'}/>
        <NeonCard onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '30%', height: '30%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>Leaderboards</Text>
        </NeonCard>
      </View>
      <Spacer height={10}/>
      <View style={{flexDirection: 'row', alignItems:'center', width:'90%', height:'15%'}}>
        <NeonCard onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '30%', height: '30%', color:"#fff" }} />
          <Spacer height={20}/>
          <Text style={{ color: "#fff" }}>My Clubs</Text>
        </NeonCard>
        <Spacer width={'10%'}/>
        <NeonCard onPress={() => console.log("Square pressed")}>
          <Image source={require("../../../assets/icons/tennis-court.png")} style={{ width: '30%', height: '30%', color:"#fff" }} />
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