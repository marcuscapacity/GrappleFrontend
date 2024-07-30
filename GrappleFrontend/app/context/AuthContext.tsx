import {createContext, useContext, useEffect, useState} from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    onRetrieveWord?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt'
const IP_ADDRESS = '192.168.0.15'
export const API_URL = `http://${IP_ADDRESS}:8080`
const AuthContext = createContext<AuthProps>({})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null }>({
        token: null,
        authenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("stored token: ", token)
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({token, authenticated: true});
            } else {
                setAuthState({token: null, authenticated: false});
            }
            await loadToken();
        }
    });

    const register = async (email: string, password: string) => {
        console.log('register with email: ', email, ' and password: ', password)
        try {
            return await axios.post(`${API_URL}/api/register`, {email, password});
        } catch (e) {
            return {error: true, msg: (e as any).response};
        }
    }

    const login = async (email: string, password: string) => {
        console.log("login called")
        try {
            const result = await axios.post(`${API_URL}/api/auth`, {email, password});

            setAuthState({token: result.data.token, authenticated: true});

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            return result;
        } catch (e) {
            console.log('e error: ', e)
            return {error: true, msg: (e as any).response};
        }
    }

    const logout = async () => {
        // remove the token from the state
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        // Update HTTP headers
        axios.defaults.headers.common['Authorization'] = '';

        // Reset the auth state
        setAuthState({token: null, authenticated: false});
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }

    const retrieveWord = async () => {
        console.log('retrieveWord called')
        try {
            console.log(`POST request to: ${API_URL}/api/test`)
            const response = await fetch(`${API_URL}/api/test`, {
                method: 'GET',
                redirect: "follow",
            });
            if (response.ok) {
                const word = await response.text();
                console.log('word: ', word)
                return word;
                // Optionally, you can perform any necessary actions upon successful form submission
            } else {
                console.error('Error getting word. Status:', response.status, 'StatusText:', response.statusText);
                // Optionally, you can handle error cases or display an error message to the user
            }
        } catch (error) {
            console.error('Error getting word catch:', error);
        }
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onRetrieveWord: retrieveWord,
        authState,
    };
    // @ts-ignore
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}