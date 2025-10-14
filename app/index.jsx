import { StyleSheet, View} from 'react-native'
import {Link} from 'expo-router'
import ThemedView from '../components/ThemedView';
import ThemedLogo from '../components/ThemedLogo';
import Spacer from '../components/Spacer';
import ThemedText from '../components/ThemedText';

const Home = () => {
    return (
        <ThemedView style={styles.container}>
            <ThemedLogo/>
            <Spacer height={20}/>

            <ThemedText style={[styles.title]} title={true}>Padel Party App</ThemedText>

            <Spacer height={10}/>
            <ThemedText>This will be the signup page</ThemedText>
            <Spacer />

            <Link href="/login" style={styles.link}>
                <ThemedText>Login Page</ThemedText>
            </Link>
            <Link href="/register" style={styles.link}>
                <ThemedText>Register Page</ThemedText>
            </Link>
            <Link href="/home" style={styles.link}>
                <ThemedText>Player Home Page</ThemedText>
            </Link>
            <Link href="/cadashboard" style={styles.link}>
                <ThemedText>Club Admin Dashboard</ThemedText>
            </Link>
            <Link href="/career" style={styles.link}>
                <ThemedText>Career</ThemedText>
            </Link>
            <Link href="/bookacourt" style={styles.link}>
                <ThemedText>Book a Court</ThemedText>
            </Link>
            <Link href="/mybookings" style={styles.link}>
                <ThemedText>My Bookings</ThemedText>
            </Link>
            <Link href="/findamatch" style={styles.link}>
                <ThemedText>Find Match</ThemedText>
            </Link>

        </ThemedView>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#ffffff'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    link: {
        marginVertical: 10,
        borderBottomWidth: 1
    },
})