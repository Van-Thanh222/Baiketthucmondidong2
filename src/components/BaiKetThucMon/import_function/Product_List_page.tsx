import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Producttype from './Producttype';
import {fetchproduct, fetchtype, Product, Product_type} from '../database';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigationService';

export const Product_List_page = () => {
  const [types, setTypes] = useState<Product_type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);

  // Thêm useEffect để fetch dữ liệu
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
  return (
    <View>
      <Text style={styles.subTitle}>Loại xe</Text>{' '}
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
        data={
          selectedTypeId === 0
            ? products
            : products.filter(p => p.typeid === selectedTypeId)
        }
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
