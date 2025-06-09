import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './BaiKetThucMon/login';
import SignUpUIOnly from './BaiKetThucMon/SignUpUIOnly';
import Home from './BaiKetThucMon/Home';
import {useUser} from './BaiKetThucMon/import_function/useUser';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import account from './BaiKetThucMon/import_function/account';
const taknavgation = () => {
  const Tab = createBottomTabNavigator();
  /////
  const [user, setUser] = useState<any>(null);
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          const data = await AsyncStorage.getItem('user');
          if (data) setUser(JSON.parse(data));
          else setUser(null);
        } catch (err) {
          setUser(null);
        }
      };
      fetchUser();
    }, []),
  );
  return (
    <Tab.Navigator
      key={user ? 'user-logged-in' : 'user-logged-out'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00C853',
        tabBarLabelStyle: {fontSize: 14},
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>🏡</Text>
          ),
        }}
      />
      {user ? (
        <>
          <Tab.Screen
            name="Account"
            component={account}
            options={{
              title: 'Account',
              tabBarIcon: ({color, size}) => (
                <Text style={{fontSize: size, color}}>👤</Text>
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Login',
              tabBarIcon: ({color, size}) => (
                <Text style={{fontSize: size, color}}>🔒</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Register"
            component={SignUpUIOnly}
            options={{
              title: 'Register',
              tabBarIcon: ({color, size}) => (
                <Text style={{fontSize: size, color}}>®️</Text>
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default taknavgation;

const styles = StyleSheet.create({});
