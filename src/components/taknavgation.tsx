import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './BaiKetThucMon/login';
import SignUpUIOnly from './BaiKetThucMon/SignUpUIOnly';
import Home from './BaiKetThucMon/Home';
import {useUser} from './BaiKetThucMon/import_function/useUser';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Account from './BaiKetThucMon/import_function/account';
import Product_List_page from './BaiKetThucMon/import_function/Product_List_page';
import Admin_page from './BaiKetThucMon/Admin_page';
const Taknavgation = () => {
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
        //thay đổi cho đồng bộ dữ liệu (1)
        // component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>🏡</Text>
          ),
        }}
        //thay đổi cho đồng bộ dữ liệu (1)
        children={() => <Home user={user} setUser={setUser} />}
        //
      />
      {user ? (
        <>
          <Tab.Screen
            name="Account"
            options={{
              title: 'Account',
              tabBarIcon: ({color, size}) => (
                <Text style={{fontSize: size, color}}>👤</Text>
              ),
            }}>
            {() => <Account user={user} onUserUpdate={setUser} />}
          </Tab.Screen>
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
      {/* <Tab.Screen
        name="Product_List_page"
        component={Product_List_page}
        options={{}}
      /> */}
      {user && user.role === 'admin' && (
        <Tab.Screen
          name="Home Admin"
          component={Admin_page}
          options={{
            title: 'Home Admin',
            tabBarIcon: ({color, size}) => (
              <Text style={{fontSize: size, color}}>🪙</Text>
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Taknavgation;

const styles = StyleSheet.create({});
