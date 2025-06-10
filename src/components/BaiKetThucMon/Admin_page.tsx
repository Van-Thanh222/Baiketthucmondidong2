import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigationService';
import {useNavigation} from '@react-navigation/native';

const Admin_page = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trang Quản Lý Admin</Text>
        </View>

        <View style={styles.adminDashboardCard}>
          <Text style={styles.sectionTitle}>Các Chức Năng Quản Lý</Text>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('User')}>
            <Text style={styles.buttonIcon}>👥</Text>
            <Text style={styles.buttonText}>Quản Lý User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('Product', {})}>
            <Text style={styles.buttonIcon}>📂</Text>
            <Text style={styles.buttonText}>Quản Lý Sản Phẩm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('Product_Type')}>
            <Text style={styles.buttonIcon}>🧾</Text>
            <Text style={styles.buttonText}>Quản Lý Loại Sản Phẩm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Admin_page;

const styles = StyleSheet.create({
  //   COLOR_BRIGHT_GREEN: '#00C853',
  //   COLOR_WHITE: '#FFFFFF',
  //   COLOR_DARK_GRAY: '#2C3E50',
  //   COLOR_LIGHT_GRAY: '#F0F2F5',
  //   COLOR_RED_DELETE: '#E74C3C',
  //   COLOR_MEDIUM_GRAY: '#7F8C8D',

  safeArea: {
    // flex: 1,
    backgroundColor: '#F0F2F5', // Nền tổng thể xám nhạt
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: '#00C853', // Màu xanh lá cây chính
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF', // Chữ trắng
  },
  adminDashboardCard: {
    backgroundColor: '#FFFFFF', // Nền trắng cho card
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50', // Xám đậm
    marginBottom: 20,
    textAlign: 'center',
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7', // Nền nhẹ cho nút
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonIcon: {
    fontSize: 28, // Kích thước lớn hơn cho icon
    marginRight: 15,
    color: '#008060', // Màu xanh lá cây đậm cho icon
    // Điều chỉnh cho Android nếu cần
    ...Platform.select({
      android: {
        lineHeight: 32, // Tùy chỉnh để căn giữa icon trên Android
      },
    }),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50', // Xám đậm
    flex: 1, // Đảm bảo text chiếm đủ không gian còn lại
  },
});
