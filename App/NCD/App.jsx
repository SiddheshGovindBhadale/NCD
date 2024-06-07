import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from './src/auth/Auth';
import Login from './src/auth/Login';
import Register from './src/auth/Register';
import Home from './src/screens/Home';
import BottomNav from './src/navigation/BottomNav';
import Issued from './src/screens/Issued';
import Invoice from './src/components/issues/Invoice';
import History from './src/components/issues/History';
import ForgotPasswordScreen from './src/auth/ForgotPasswordScreen';
import ChangePassword from './src/auth/ChangePassword';
import SearchResult from './src/screens/SearchResult';

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="BottomNav" component={BottomNav} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Issued" component={Issued} />
        <Stack.Screen name="Invoice" component={Invoice} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="SearchResult" component={SearchResult} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})