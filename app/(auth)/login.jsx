import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, useColorScheme } from 'react-native'
import {Link} from 'expo-router'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

import ThemedView from '../../components/ThemedView';
import ThemedLogo from '../../components/ThemedLogo';
import Spacer from '../../components/Spacer';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import ThemedTextInput from '../../components/ThemedTextInput';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../hooks/useUser';

const Login = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error,setError] = useState(null)

    const [pwvisibility, setPwvisibility] = useState(true)

    const {user, login} = useUser()

    const handleSubmit = async () => {
        setError(null)
        try{
            console.log("Current User: ", user)
            console.log("Login Pressed", email, password)
            await login(email,password)
        }
        catch(error){
            setError(error.message)
        }
        
    }


  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView safe={true} style={styles.container}>

            {/* <LinearGradient
                colors={['#0E1340', '#EE3C79']}
                start={{ x: 0.7, y: 0.4 }}
                end={{  x: 0.8, y: 0.5 }}
                style={styles.gradientLayer}
            />
            <LinearGradient
                colors={['#EE3C79', '#38C6F4','#38C6F4']}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 0.2, y: 1.3 }}
                style={styles.gradientLayer2}
            /> */}

            <Spacer/>
            <ThemedText title={true} style={styles.title}>
                Login to Your Account
            </ThemedText>

            <ThemedTextInput 
                style={{width: '80%', marginBottom: 20}}
                placeholder='Email'
                keyboardType="email-address"
                keyboardAppearance="dark"
                onChangeText ={setEmail}
                value={email}
            />
            <ThemedView style={{width: '80%', marginBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.uiBackground}} >
                <ThemedTextInput
                    style={{flex:4}}
                    placeholder='Password'
                    keyboardAppearance="dark"
                    onChangeText ={setPassword}
                    value={password}
                    secureTextEntry={pwvisibility}
                />
                <TouchableOpacity style={{position: 'absolute', right: 20, flex:1}} onPress={() => setPwvisibility(!pwvisibility)}>
                    <Ionicons name={pwvisibility ? 'eye-off' : 'eye'} size={24} color={theme.iconColor} />
                </TouchableOpacity>
            </ThemedView>
            
            <ThemedButton
                onPress={handleSubmit}
                >
                <Text style={{color: '#f2f2f2'}}>Login</Text>
            </ThemedButton>
            <Spacer/>
            {error && <Text style={styles.error}>{error}</Text>}
            <Spacer height={100}/>
            <Link href="/register" style={styles.link}>
                <ThemedText style={{textAlign: 'center'}}>
                    Register Instead
                </ThemedText>
            </Link>



        </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 30
    },
    btn:{
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5
    },
    pressed:{
        opacity: 0.8
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
    },
    error: {
        color: Colors.warning,
        padding:10,
        backgroundColor: '#f5c1c8',
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: 6,
        marginHorizontal: 10
    }
})