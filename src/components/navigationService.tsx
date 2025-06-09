import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './BaiKetThucMon/login';
import SignUpUIOnly from './BaiKetThucMon/SignUpUIOnly';
import ForgotPassword from './BaiKetThucMon/ForgotPasswordUIScreen';
import Home from './BaiKetThucMon/Home';
import taknavgation from './taknavgation';
import Product_details from './BaiKetThucMon/Product_details';
import {Product, Product_type} from './BaiKetThucMon/database';
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Product_details: {product: Product; types: Product_type[]};
};
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="taknavgation"
    // screenOptions={{headerShown: false}}
  >
    <Stack.Screen
      name="taknavgation"
      component={taknavgation}
      options={{headerShown: false}}
    />
    {/* <Stack.Screen name="Login" component={Login} /> */}
    {/* <Stack.Screen name="SignUp" component={SignUpUIOnly} /> */}
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{headerShown: false}}
    />
    {/* <Stack.Screen name="Home" component={Home} /> */}
    <Stack.Screen name="Product_details" component={Product_details} />
  </Stack.Navigator>
);

export default AppNavigator;
