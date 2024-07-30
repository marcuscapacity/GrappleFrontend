import {View, Text, TextInput, Button} from "react-native";
import React, {useEffect, useState} from "react";
import {API_URL, useAuth} from "../context/AuthContext";
import {StyleSheet} from "react-native";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {onLogin, onRegister, onRetrieveWord} = useAuth();

    useEffect(() => {
        const testCall = async () => {
            const result = await axios.get(`${API_URL}/login`)
            console.log('testCall result: ', result)
        }
        // testCall()
    }, [])

    const printWordFromBackend = async () => {
        console.log('printWordFromBackend')
        const word = await onRetrieveWord();
        console.log('word: ', word)
        alert(word)
    }

    const login = async () => {
        const result = await onLogin(email, password);
        if (result && result.error) {
            alert(JSON.stringify(result.msg))
        }
    }
    const register = async () => {
        console.log('register run')
        const result = await onRegister(email, password);
        if (result && result.error) {

        } else {
            await login()
        }
    }
    return (
        <View>
            <Text>Click here for a random word!</Text>
            <Button title={"Random word from the backend you say!?"}
                    onPress={printWordFromBackend}
            />
            <Text>Login Below</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
            />
            <Button
                title="Login"
                onPress={login}
            />
            <Button
                title="Register"
                onPress={register}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
    },
});


export default Login;