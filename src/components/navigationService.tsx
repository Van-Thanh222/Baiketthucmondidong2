import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './BaiKetThucMon/login';
import SignUpUIOnly from './BaiKetThucMon/SignUpUIOnly';
import ForgotPassword from './BaiKetThucMon/ForgotPasswordUIScreen';
import Home from './BaiKetThucMon/Home';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
};
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUpUIOnly} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);

export default AppNavigator;
