import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useUser} from './useUser';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigationService';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Header = ({user, setUser}: any) => {
  // const {user, setUser} = useUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn đăng xuất không?',
      [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            setUser(null);
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.welcomeSection}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Xin chào, {user.username}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.welcomeText}>
            Chào mừng bạn đến với ứng dụng!
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.logoutButtonText}>Đăng Nhập</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F0F2F5',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
  },
  welcomeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  logoutButton: {
    // Nút đăng xuất
    backgroundColor: '#E74C3C', // Màu đỏ để phân biệt
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  loginButton: {
    // Nút đăng nhập khi chưa đăng nhập
    backgroundColor: '#00C853', // Màu xanh chính
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
