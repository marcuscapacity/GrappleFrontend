import {View, Text, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../context/AuthContext";


const Home = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        console.log('home screen')
        const testCall = async () => {
            console.log('testCall')
            const result = await axios.get(`${API_URL}/api/users`)
            console.log('testCall users result: ', result)
            setUsers(result.data)
        }
        testCall();
    }, [])
    return (
        <ScrollView>
            {users.map((user: any) => {
                return <Text key={user._id}>{user.email}</Text>
            })}
        </ScrollView>
    );
}

export default Home;