import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigationService';
import {fetchtype, Product_type, fetchproduct, Product} from './database';
import Header from './import_function/Header';
import Producttype from './import_function/Producttype';
import {useUser} from './import_function/useUser';
import AboutShopScreen from './import_function/AboutShopScreen';
import Product_List_page from './import_function/Product_List_page';
///
//thay đổi cho đồng bộ dữ liệu (1)
type HomeProps = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};
///
const Home = (
  //thay đổi cho đồng bộ dữ liệu (1)
  {user, setUser}: HomeProps,
) =>
  //
  {
    const [types, setTypes] = useState<Product_type[]>([]);
    useEffect(() => {
      const loadTypes = async () => {
        const data = await fetchtype();
        console.log('Types:', data);
        setTypes(data);
      };
      loadTypes();
    }, []);
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
      const loadProduct = async () => {
        const data = await fetchproduct();
        setProducts(data);
      };
      loadProduct();
    }, []);
    ///// CHuyển qua file header
    // const [user, setUser] = useState<any>(null);
    // const navigation =
    //   useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    // useEffect(() => {
    //   const fetchUser = async () => {
    //     try {
    //       const data = await AsyncStorage.getItem('user');
    //       if (data) {
    //         const parsed = JSON.parse(data);
    //         setUser(parsed);
    //       }
    //     } catch (err) {
    //       console.error('Lỗi lấy user:', err);
    //     }
    //   };
    //   fetchUser();
    // }, []);

    // const handleLogout = async () => {
    //   await AsyncStorage.removeItem('user');
    //   setUser(null);
    // };

    // const handleLogin = () => {
    //   navigation.navigate('Login');
    // };
    ///////

    //Tìm Kiếm SP
    const [tim, setTim] = useState<string>('');
    const search = products.filter(item =>
      item.name.toLocaleLowerCase().includes(tim.toLocaleLowerCase()),
    );
    //
    ////// Tìm Theo Loại :
    const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
    //// kiểm tra Xem Đã đăng nhập hay chưa
    // const [user, setUser] = useState<any>(null);
    // useFocusEffect nó sẽ giúp reload lại user ở Home khi quay về
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
    //// CHuyển trang
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    ///// Hiện Trang
    const [activeMenu, setActiveMenu] = useState<
      | 'home'
      | 'category'
      // | 'account'
      | 'about'
    >('home');
    //// truyền dữ liệu từ trang chi tiết về danh mục
    const route = useRoute();
    useEffect(() => {
      if (route.params && (route.params as any).selectedTypeId !== undefined) {
        setActiveMenu('category');
        setSelectedTypeId((route.params as any).selectedTypeId);
      }
    }, [route.params]);
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            style={styles.imgBn}
            source={require('../../../assets/image/banner/banner3.jpg')}
          />
          {/*  */}
          <Header user={user} setUser={setUser} />
          {/* <Header /> */}
          {/* <View style={styles.welcomeSection}>
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
              <Text style={styles.welcomeText}>
                Chào mừng bạn đến với ứng dụng!
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}>
                <Text style={styles.logoutButtonText}>Đăng Nhập</Text>
              </TouchableOpacity>
            </>
          )}
        </View> */}

          <View style={styles.mainNavButtonsContainer}>
            <TouchableOpacity
              style={styles.mainNavButton}
              onPress={() => setActiveMenu('home')}>
              <Text style={styles.mainNavButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mainNavButton}
              onPress={() => setActiveMenu('category')}>
              <Text style={styles.mainNavButtonText}>Danh mục</Text>
            </TouchableOpacity>
            {/* {user ? (
            <TouchableOpacity
              style={styles.mainNavButton}
              onPress={() => setActiveMenu('account')}>
              <Text style={styles.mainNavButtonText}>Tài Khoản</Text>
            </TouchableOpacity>
          ) : ( */}
            <TouchableOpacity
              style={styles.mainNavButton}
              onPress={() => setActiveMenu('about')}>
              <Text style={styles.mainNavButtonText}>Giới Thiệu</Text>
            </TouchableOpacity>
            {/* )} */}
          </View>

          <View style={styles.contentSection}>
            {activeMenu == 'home' && (
              <>
                <Text style={styles.contentSectionTitle}>
                  Tìm kiếm xe mơ ước của bạn
                </Text>
                <View style={styles.searchBar}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Nhập Tên Xe..."
                    placeholderTextColor="#7F8C8D"
                    onChangeText={setTim}
                  />
                  <TouchableOpacity style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>Tìm kiếm</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subTitle}>Hãng xe</Text>

                {/* <FlatList
            horizontal // Hiển thị ngang
            showsHorizontalScrollIndicator={false}
            data={types}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.typeCard}>
                <Image
                  style={styles.typeImage}
                  source={
                    item.name === 'ALL'
                      ? require('../../../assets/image/logoALL.png')
                      : {uri: item.avatar}
                  }
                />
                <Text style={styles.typeName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>Không có loại xe nào.</Text>
            }
            contentContainerStyle={styles.typeListContainer}
          /> */}
                {/* <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={types}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  selectedTypeId === item.id && {
                    borderColor: '#00C853',
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSelectedTypeId(item.id)}>
                <Image
                  style={styles.typeImage}
                  source={
                    item.name === 'ALL'
                      ? require('../../../assets/image/logoALL.png')
                      : {uri: item.avatar}
                  }
                />
                <Text style={styles.typeName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>Không có loại xe nào.</Text>
            }
            contentContainerStyle={styles.typeListContainer}
          /> */}
                <Producttype
                  types={types}
                  selectedTypeId={selectedTypeId}
                  setSelectedTypeId={setSelectedTypeId}
                />
                {tim == '' ? (
                  <>
                    {/* <Text style={styles.subTitle}>Xe phổ biến</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.carCard}>
                    <Image style={styles.carImage} source={{uri: item.img}} />
                    <View style={styles.carDetails}>
                      <Text style={styles.carName}>{item.name}</Text>
                      <Text style={styles.carPrice}>
                        Giá: {item.price.toLocaleString('en-US')} VND
                      </Text>
                      <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsButtonText}>
                          Xem chi tiết
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    Không có sản phẩm nào.
                  </Text>
                }
              /> */}
                    <Text style={styles.subTitle}>
                      {selectedTypeId === 0
                        ? 'Tất cả xe'
                        : `Xe thuộc loại: ${
                            types.find(t => t.id === selectedTypeId)?.name
                          }`}
                    </Text>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={
                        selectedTypeId === 0
                          ? products
                          : products.filter(p => p.typeid === selectedTypeId)
                      }
                      keyExtractor={item => item.id.toString()}
                      renderItem={({item}) => (
                        <TouchableOpacity style={styles.carCard}>
                          <Image
                            style={styles.carImage}
                            source={{uri: item.img}}
                          />
                          <View style={styles.carDetails}>
                            <Text style={styles.carName}>{item.name}</Text>
                            <Text style={styles.carPrice}>
                              Giá: {item.price.toLocaleString('en-US')} VND
                            </Text>
                            <TouchableOpacity
                              style={styles.viewDetailsButton}
                              onPress={() =>
                                navigation.navigate('Product_details', {
                                  product: item,
                                  types: types,
                                })
                              }>
                              <Text style={styles.viewDetailsButtonText}>
                                Xem chi tiết
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        <Text style={styles.emptyListText}>
                          Không có sản phẩm nào.
                        </Text>
                      }
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.subTitle}>Xe Tìm : {tim}</Text>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={search}
                      keyExtractor={item => item.id.toString()}
                      renderItem={({item}) => (
                        <TouchableOpacity style={styles.carCard}>
                          <Image
                            style={styles.carImage}
                            source={{uri: item.img}}
                          />
                          <View style={styles.carDetails}>
                            <Text style={styles.carName}>{item.name}</Text>
                            <Text style={styles.carPrice}>
                              Giá: {item.price} VND
                            </Text>
                            <TouchableOpacity
                              style={styles.viewDetailsButton}
                              onPress={() =>
                                navigation.navigate('Product_details', {
                                  product: item,
                                  types: types,
                                })
                              }>
                              <Text style={styles.viewDetailsButtonText}>
                                Xem chi tiết
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        <Text style={styles.emptyListText}>
                          Không có sản phẩm nào.
                        </Text>
                      }
                    />
                  </>
                )}
              </>
            )}
            {activeMenu == 'about' && (
              <>
                <AboutShopScreen />
              </>
            )}
            {activeMenu == 'category' && (
              <>
                <Product_List_page
                  selectedTypeId={selectedTypeId}
                  setSelectedTypeId={setSelectedTypeId}
                />
              </>
            )}
          </View>
          <View style={styles.traditionalFooter}>
            <Text style={styles.footerAppName}>CarRent App</Text>
            <Text style={styles.footerCopyright}>
              © 2025 CarRent. All rights reserved.
            </Text>
            <Text style={styles.footerLink}>
              Chính sách bảo mật | Điều khoản sử dụng
            </Text>
            <Text style={styles.footerContact}>
              Liên hệ: support@carrent.com
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
export default Home;

const styles = StyleSheet.create({
  // COLOR_BRIGHT_GREEN: '#00C853',
  // COLOR_WHITE: '#FFFFFF',
  // COLOR_DARK_GRAY: '#2C3E50',
  // COLOR_LIGHT_GRAY: '#F0F2F5',
  // COLOR_RED_DELETE: '#E74C3C',

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

  // === Khu vực chào mừng/đăng nhập/đăng xuất ===
  // các nút này chuyển qua file headr rồi

  // welcomeSection: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingVertical: 12,
  //   paddingHorizontal: 15,
  //   backgroundColor: '#F0F2F5',
  //   borderBottomLeftRadius: 15,
  //   borderBottomRightRadius: 15,
  //   marginBottom: 10,
  // },
  // welcomeText: {
  //   flex: 1,
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#2C3E50',
  // },
  // logoutButton: {
  //   // Nút đăng xuất
  //   backgroundColor: '#E74C3C', // Màu đỏ để phân biệt
  //   paddingVertical: 8,
  //   paddingHorizontal: 15,
  //   borderRadius: 8,
  // },
  // loginButton: {
  //   // Nút đăng nhập khi chưa đăng nhập
  //   backgroundColor: '#00C853', // Màu xanh chính
  //   paddingVertical: 8,
  //   paddingHorizontal: 15,
  //   borderRadius: 8,
  // },
  // logoutButtonText: {
  //   color: '#FFFFFF',
  //   fontSize: 14,
  //   fontWeight: '500',
  // },

  // === Các nút điều hướng chính (Home, Danh mục, Sản phẩm) ===
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
    backgroundColor: '#008060', // Xanh lá cây đậm hơn
    borderRadius: 25,
  },
  mainNavButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  // === Các phần nội dung khác ===
  contentSection: {
    paddingHorizontal: 15,
    // Không cần marginBottom ở đây, để FlatList cuối cùng tự đẩy ScrollView
  },
  contentSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    padding: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    // Style mới cho TextInput
    flex: 1,
    fontSize: 15,
    color: '#2C3E50', // Màu chữ khi nhập
    paddingHorizontal: 5,
    paddingVertical: 0, // Quan trọng để TextInput không bị quá cao
  },
  searchButton: {
    backgroundColor: '#00C853',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // === Danh sách loại xe (Type List) ===
  typeListContainer: {
    paddingBottom: 10, // Khoảng cách dưới FlatList ngang
    marginBottom: 15, // Khoảng cách với phần tiếp theo
  },
  typeCard: {
    alignItems: 'center',
    marginRight: 15, // Khoảng cách giữa các loại xe
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: 90, // Chiều rộng cố định cho mỗi card loại
    height: 90, // Chiều cao cố định
    justifyContent: 'center',
  },
  typeImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Bo tròn ảnh loại
    marginBottom: 5,
    resizeMode: 'contain', // Đảm bảo ảnh icon vừa vặn
  },
  typeName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C3E50',
    textAlign: 'center',
  },

  // === Tiêu đề phụ ===
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
    marginTop: 10,
  },

  // === Card sản phẩm (Product Card) ===
  carCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover', // Đảm bảo ảnh xe hiển thị tốt hơn
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
    color: '#008060',
    marginTop: 5,
    marginBottom: 5,
  },
  viewDetailsButton: {
    backgroundColor: '#00C853',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 20,
    fontStyle: 'italic',
  },
  // === STYLE MỚI CHO FOOTER TRUYỀN THỐNG ===
  traditionalFooter: {
    backgroundColor: '#F0F2F5', // Nền xám nhạt
    paddingVertical: 25, // Padding dọc để tạo không gian
    paddingHorizontal: 20,
    alignItems: 'center', // Căn giữa nội dung
    marginTop: 30, // Khoảng cách với phần nội dung phía trên
    borderTopLeftRadius: 15, // Bo góc trên để khớp với phong cách card
    borderTopRightRadius: 15,
  },
  footerAppName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50', // Xám đậm
    marginBottom: 5,
  },
  footerCopyright: {
    fontSize: 13,
    color: '#7F8C8D', // Xám trung tính
    marginBottom: 5,
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 13,
    color: '#008060', // Xanh lá cây đậm hơn cho các liên kết
    textDecorationLine: 'underline', // Gạch chân để báo hiệu là link
    marginBottom: 5,
    textAlign: 'center',
  },
  footerContact: {
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});
