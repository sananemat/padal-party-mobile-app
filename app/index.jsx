import { StyleSheet, View} from 'react-native'
import {Link} from 'expo-router'
import ThemedView from '../components/ThemedView';
import ThemedLogo from '../components/ThemedLogo';
import Spacer from '../components/Spacer';
import ThemedText from '../components/ThemedText';
import {LinearGradient} from 'expo-linear-gradient';

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
            <Link href="/profile" style={styles.link}>
                <ThemedText>Profile Page</ThemedText>
            </Link>
            <Link href="/caprofile" style={styles.link}>
                <ThemedText>Club Admin Profile</ThemedText>
            </Link>
            <Link href="/cadashboard" style={styles.link}>
                <ThemedText>Club Admin Dashboard</ThemedText>
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
    card: {
        backgroundColor: '#eee',
        padding: 20,
        borderRadius: 5,
        boxShadow: '2px 2px 2px 2px rgba(0,0,0,0.1)'
    },
    link: {
        marginVertical: 10,
        borderBottomWidth: 1
    },
    gradientLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '30%',
        opacity: 1,
    },
    gradientLayer2: {
        position: 'absolute',
        top: '70%',
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 1
    }
})