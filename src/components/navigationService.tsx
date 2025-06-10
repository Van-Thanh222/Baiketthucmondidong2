import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './BaiKetThucMon/login';
import SignUpUIOnly from './BaiKetThucMon/SignUpUIOnly';
import ForgotPassword from './BaiKetThucMon/ForgotPasswordUIScreen';
import Home from './BaiKetThucMon/Home';
import Product_details from './BaiKetThucMon/Product_details';
import {Product, Product_type} from './BaiKetThucMon/database';
import Taknavgation from './taknavgation';
import UserScreen from './BaiKetThucMon/admin/User';
import ProductTypeScreen from './BaiKetThucMon/admin/Product_type';
import ProductScreen from './BaiKetThucMon/admin/Product';
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Product_details: {product: Product; types: Product_type[]};

  User: undefined;
  Product_Type: undefined;
  Product: {typeid?: number};
};
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Taknavgation"
    // screenOptions={{headerShown: false}}
  >
    <Stack.Screen
      name="Taknavgation"
      component={Taknavgation}
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

    <Stack.Screen name="User" component={UserScreen} />
    <Stack.Screen name="Product_Type" component={ProductTypeScreen} />
    <Stack.Screen name="Product" component={ProductScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
