import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Login from './src/components/BaiKetThucMon/login';
import {
  initiaProduct_typeTable,
  initiaProductTable,
  initUserTable,
} from './src/components/BaiKetThucMon/database';
import SignUpUIOnly from './src/components/BaiKetThucMon/SignUpUIOnly';
import AppNavigator from './src/components/navigationService';
import {NavigationContainer} from '@react-navigation/native';
import ForgotPassword from './src/components/BaiKetThucMon/ForgotPasswordUIScreen';
import Home from './src/components/BaiKetThucMon/Home';
import Product_details from './src/components/BaiKetThucMon/Product_details';
const App = () => {
  useEffect(() => {
    initUserTable();
    initiaProductTable();
    initiaProduct_typeTable();
  }, []);
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
    // <View>
    //   <Product_details/>
    // </View>
  );
};

export default App;

const styles = StyleSheet.create({});
