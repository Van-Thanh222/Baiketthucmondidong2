// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import Producttype from './Producttype';
// import {fetchproduct, fetchtype, Product, Product_type} from '../database';
// import {useNavigation} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../navigationService';
// type Props = {
//   selectedTypeId: number;
//   setSelectedTypeId: (id: number) => void;
// };
// export const Product_List_page = ({
//   selectedTypeId,
//   setSelectedTypeId,
// }: Props) => {
//   const [types, setTypes] = useState<Product_type[]>([]);
//   // const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
//   const [products, setProducts] = useState<Product[]>([]);

//   // Thêm useEffect để fetch dữ liệu
//   useEffect(() => {
//     const loadTypes = async () => {
//       const data = await fetchtype();
//       setTypes(data);
//     };
//     const loadProducts = async () => {
//       const data = await fetchproduct();
//       setProducts(data);
//     };
//     loadTypes();
//     loadProducts();
//   }, []);
//   // chuyển trang
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   return (
//     <View>
//       <Text style={styles.subTitle}>Loại xe</Text>{' '}
//       <Producttype
//         types={types}
//         selectedTypeId={selectedTypeId}
//         setSelectedTypeId={setSelectedTypeId}
//       />
//       <Text style={styles.subTitle}>
//         {selectedTypeId === 0
//           ? 'Tất cả xe'
//           : `Xe thuộc loại: ${types.find(t => t.id === selectedTypeId)?.name}`}
//       </Text>
//       <FlatList
//         showsVerticalScrollIndicator={false}
//         data={
//           selectedTypeId === 0
//             ? products
//             : products.filter(p => p.typeid === selectedTypeId)
//         }
//         keyExtractor={item => item.id.toString()}
//         renderItem={({item}) => (
//           <TouchableOpacity style={styles.carCard}>
//             <Image style={styles.carImage} source={{uri: item.img}} />
//             <View style={styles.carDetails}>
//               <Text style={styles.carName}>{item.name}</Text>
//               <Text style={styles.carPrice}>
//                 Giá: {item.price.toLocaleString('en-US')} VND
//               </Text>
//               <TouchableOpacity
//                 style={styles.viewDetailsButton}
//                 onPress={() =>
//                   navigation.navigate('Product_details', {
//                     product: item,
//                     types: types,
//                   })
//                 }>
//                 <Text style={styles.viewDetailsButtonText}>Xem chi tiết</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.emptyListText}>Không có sản phẩm nào.</Text>
//         }
//       />
//     </View>
//   );
// };

// export default Product_List_page;
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import Producttype from './Producttype';
import {fetchproduct, fetchtype, Product, Product_type} from '../database';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigationService';

type Props = {
  selectedTypeId: number;
  setSelectedTypeId: (id: number) => void;
};

export const Product_List_page = ({
  selectedTypeId,
  setSelectedTypeId,
}: Props) => {
  const [types, setTypes] = useState<Product_type[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const loadTypes = async () => {
      const data = await fetchtype();
      setTypes(data);
    };
    const loadProducts = async () => {
      const data = await fetchproduct();
      setProducts(data);
    };
    loadTypes();
    loadProducts();
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Lọc sản phẩm theo loại, tên và giá
  const filteredProducts = products.filter(item => {
    // Lọc theo loại
    const matchType = selectedTypeId === 0 || item.typeid === selectedTypeId;
    // Lọc theo tên
    const matchName = item.name.toLowerCase().includes(search.toLowerCase());
    // Lọc theo giá
    const price = Number(item.price);
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;
    const matchPrice = price >= min && price <= max;
    return matchType && matchName && matchPrice;
  });

  return (
    <View>
      <Text style={styles.subTitle}>Tìm kiếm & Lọc sản phẩm</Text>
      <TextInput
        placeholder="Nhập tên xe..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
        }}
      />
      <View style={{flexDirection: 'row', marginBottom: 8}}>
        <TextInput
          placeholder="Giá từ"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 8,
            marginRight: 4,
          }}
        />
        <TextInput
          placeholder="Đến"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 8,
            marginLeft: 4,
          }}
        />
      </View>
      <Producttype
        types={types}
        selectedTypeId={selectedTypeId}
        setSelectedTypeId={setSelectedTypeId}
      />
      <Text style={styles.subTitle}>
        {selectedTypeId === 0
          ? 'Tất cả xe'
          : `Xe thuộc loại: ${types.find(t => t.id === selectedTypeId)?.name}`}
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.carCard}>
            <Image style={styles.carImage} source={{uri: item.img}} />
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
                <Text style={styles.viewDetailsButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>Không có sản phẩm nào.</Text>
        }
      />
    </View>
  );
};

export default Product_List_page;
const styles = StyleSheet.create({
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
});
