import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput, // Thêm SafeAreaView để xử lý vùng an toàn trên iOS
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigationService';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AsyncStorage.getItem('user');
        if (data) {
          const parsed = JSON.parse(data);
          setUser(parsed);
        }
      } catch (err) {
        console.error('Lỗi lấy user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const handle = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Image
          style={styles.imgBn}
          source={require('../../../assets/image/banner/banner3.jpg')}
        />
        <View style={styles.welcomeSection}>
          {user ? (
            <>
              <Text style={styles.welcomeText}>Xin chào, {user.username}</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.welcomeText}>Chưa Đăng Nhập</Text>
              <TouchableOpacity style={styles.logoutButton1} onPress={handle}>
                <Text style={styles.logoutButtonText}>Đăng Nhập</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.mainNavButtonsContainer}>
          <TouchableOpacity style={styles.mainNavButton}>
            <Text style={styles.mainNavButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainNavButton}>
            <Text style={styles.mainNavButtonText}>Danh mục</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainNavButton}>
            <Text style={styles.mainNavButtonText}>Sản phẩm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentSectionTitle}>
            Tìm kiếm xe mơ ước của bạn
          </Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchBarPlaceholder}
              placeholder="Nhập địa điểm, loại xe..."></TextInput>
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Tìm kiếm</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subTitle}>Xe phổ biến</Text>
          <View style={styles.carCard}>
            <Image
              style={styles.carImage}
              source={{
                uri: 'https://cdn.pixabay.com/photo/2016/04/01/12/16/car-1300629_1280.png',
              }} 
            />
            <View style={styles.carDetails}>
              <Text style={styles.carName}>Audi A4 Sedan</Text>
              <Text style={styles.carPrice}>$50/ngày</Text>
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;

const styles = StyleSheet.create({
  //   // Màu sắc định nghĩa theo hướng dẫn trước
  //   COLOR_BRIGHT_GREEN: '#00C853', // Xanh lá cây tươi sáng
  //   COLOR_WHITE: '#FFFFFF', // Trắng
  //   COLOR_DARK_GRAY: '#2C3E50', // Xám đậm, gần đen
  //   COLOR_LIGHT_GRAY: '#F0F2F5', // Xám nhạt

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  container: {
    flexGrow: 1, 
    backgroundColor: '#FFFFFF', 
  },
  imgBn: {
    width: '100%',
    height: 120,
  },
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
    backgroundColor: '#E74C3C', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8, 
  },
  logoutButton1: {
    backgroundColor: '#00C853', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8, 
  },
  logoutButtonText: {
    color: '#FFFFFF', 
    fontSize: 14,
    fontWeight: '500',
  },
  notLoggedInPlaceholder: {
    flex: 1,
    paddingVertical: 8,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#7F8C8D', 
    fontStyle: 'italic',
  },

  mainNavButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    paddingVertical: 10,
    paddingHorizontal: 5, 
    backgroundColor: '#00C853', 
    borderRadius: 10, 
    marginHorizontal: 15, 
    marginBottom: 20, 
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mainNavButton: {
    flex: 1, 
    marginHorizontal: 5, 
    paddingVertical: 10,
    backgroundColor: '#008060', 
    borderRadius: 25,
  },
  mainNavButtonText: {
    color: '#FFFFFF', // Chữ trắng
    fontSize: 15,
    fontWeight: '600', // Đậm hơn
    textAlign: 'center',
  },

  // === Các phần nội dung khác (ví dụ: tìm kiếm, danh sách xe) ===
  contentSection: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  contentSectionTitle: {
    fontSize: 20,
    fontWeight: '700', // Rất đậm
    color: '#2C3E50', // Xám đậm
    marginBottom: 15,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5', // Nền xám nhạt cho thanh tìm kiếm
    borderRadius: 10,
    padding: 8,
    marginBottom: 20,
    shadowColor: '#000', // Bóng nhẹ
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  searchBarPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#7F8C8D', // Xám trung tính cho placeholder
    paddingHorizontal: 5,
  },
  searchButton: {
    backgroundColor: '#00C853', // Nút tìm kiếm màu xanh lá chính
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
    marginTop: 10,
  },
  carCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000', // Đổ bóng nhẹ cho card
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Android shadow
  },
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'contain', // Đảm bảo ảnh hiển thị đầy đủ
  },
  carDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  carName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  carPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#008060', // Xanh lá cây đậm hơn cho giá
    marginTop: 5,
    marginBottom: 5,
  },
  viewDetailsButton: {
    backgroundColor: '#00C853',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start', // Nút chỉ chiếm đủ không gian cần thiết
  },
  viewDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
