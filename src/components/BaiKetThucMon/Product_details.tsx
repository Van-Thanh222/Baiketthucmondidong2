import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Producttype from './import_function/Producttype';
import {RootStackParamList} from '../navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
// Giả định đối tượng product để UI Only có thể chạy và minh họa
// Trong thực tế, bạn sẽ nhận product qua props hoặc navigation params

export const Product_details = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Product_details'>>();
  // const route = useRoute();
  const {product, types} = route.params as {product: any; types: any[]};

  // Hàm xử lý khi nhấn vào loại sản phẩm
  // const navigation = useNavigation();
  // const handleTypePress = async (typeId: number) => {
  //   await AsyncStorage.setItem('selectedTypeId', typeId.toString());
  //   (navigation as any).navigate('Home');
  // };
  ///// truyền dữ liệu từ trang chi tiết sang trang danh mục ở home
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{uri: product.img}} style={styles.image} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>
            Giá:{' '}
            <Text style={styles.priceValue}>
              {product.price.toLocaleString()} đ
            </Text>{' '}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Mô tả:</Text>
          <Text style={styles.describe}>{product.Describe}</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Loại sản phẩm:</Text>
          <Producttype
            types={types}
            selectedTypeId={product.typeid}
            // setSelectedTypeId={() => {}} // Không cho đổi loại ở đây
            setSelectedTypeId={(typeId: number) => {
              navigation.navigate('Taknavgation', {
                screen: 'Home',
                params: {selectedTypeId: typeId},
              });
              // Nếu vẫn không được, thử dùng reset như bên dưới:
              // navigation.reset({
              //   index: 0,
              //   routes: [
              //     {
              //       name: 'Taknavgation',
              //       state: {
              //         routes: [
              //           { name: 'Home', params: { selectedTypeId: typeId } },
              //         ],
              //       },
              //     },
              //   ],
              // });
            }}
          />
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Mua Ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Product_details;

const styles = StyleSheet.create({
  // Định nghĩa màu sắc theo hướng dẫn
  //   COLOR_BRIGHT_GREEN: '#00C853',
  //   COLOR_WHITE: '#FFFFFF',
  //   COLOR_DARK_GRAY: '#2C3E50',
  //   COLOR_LIGHT_GRAY: '#F0F2F5',
  //   COLOR_MEDIUM_GRAY: '#7F8C8D',

  safeArea: {
    // flex: 1,
    backgroundColor: '#FFFFFF', // Nền toàn bộ màn hình là trắng
  },
  container: {
    flexGrow: 1,
    padding: 15, // Giảm padding tổng thể để các phần tử có thể dàn trải hơn
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 300, // Tăng chiều cao để ảnh nổi bật hơn
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5', // Nền xám nhạt cho khu vực ảnh
    borderRadius: 15, // Bo góc cho container ảnh
    marginBottom: 20,
    shadowColor: '#000', // Đổ bóng nhẹ
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '90%', // Ảnh chiếm 90% chiều rộng container
    height: '90%', // Ảnh chiếm 90% chiều cao container
    resizeMode: 'contain', // Đảm bảo toàn bộ ảnh hiển thị
    borderRadius: 10, // Bo góc cho chính ảnh
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF', // Nền trắng cho phần thông tin
    borderRadius: 15,
    padding: 20, // Padding lớn hơn cho nội dung
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 26, // Lớn hơn cho tên sản phẩm
    fontWeight: '700', // Rất đậm
    marginBottom: 8,
    textAlign: 'left', // Căn trái
    color: '#2C3E50', // Xám đậm
  },
  price: {
    fontSize: 18,
    color: '#2C3E50', // Xám đậm cho chữ "Giá:"
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'left',
  },
  priceValue: {
    fontSize: 22, // Lớn hơn cho giá trị số
    color: '#00C853', // Màu xanh lá cây nổi bật cho giá trị
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F2F5', // Đường phân cách màu xám nhạt
    marginVertical: 15, // Khoảng cách trên và dưới đường phân cách
  },
  label: {
    fontSize: 16,
    fontWeight: '600', // Đậm hơn cho nhãn
    color: '#2C3E50', // Xám đậm
    marginBottom: 5, // Khoảng cách với nội dung
  },
  describe: {
    fontSize: 15,
    color: '#7F8C8D', // Xám trung tính cho mô tả
    lineHeight: 22, // Khoảng cách dòng để dễ đọc
    marginBottom: 10, // Khoảng cách cuối mô tả
  },
  type: {
    fontSize: 15,
    color: '#7F8C8D', // Xám trung tính
    marginBottom: 20, // Khoảng cách cuối cùng trước nút
  },
  primaryButton: {
    backgroundColor: '#00C853', // Nút chính màu xanh lá
    paddingVertical: 15,
    borderRadius: 10, // Bo góc nút
    alignItems: 'center',
    marginTop: 20, // Khoảng cách với nội dung phía trên
    shadowColor: '#000', // Đổ bóng cho nút
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF', // Chữ trắng
    fontSize: 18,
    fontWeight: '700', // Rất đậm
  },
});
