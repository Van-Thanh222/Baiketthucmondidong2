import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  fetchproduct,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchtype,
  Product,
  Product_type,
} from '../database';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigationService';

const ProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [types, setTypes] = useState<Product_type[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [Describe, setDescribe] = useState('');
  const [typeid, setTypeid] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const loadProducts = async () => {
    const data = await fetchproduct();
    setProducts(data);
  };
  const loadTypes = async () => {
    const data = await fetchtype();
    setTypes(data);
    if (data.length > 0 && typeid === null) setTypeid(data[0].id);
  };

  useEffect(() => {
    loadProducts();
    loadTypes();
  }, []);

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.didCancel) {
        // User cancelled
      } else if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh');
      } else if (response.assets && response.assets[0]) {
        setImg(response.assets[0].uri ?? '');
      }
    });
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim() || !price.trim() || !typeid) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin');
      return;
    }
    try {
      if (editId === null) {
        await addProduct({
          name,
          price: Number(price),
          img,
          Describe,
          typeid,
        });
        Alert.alert('Thành công', 'Đã thêm sản phẩm');
      } else {
        await updateProduct({
          id: editId,
          name,
          price: Number(price),
          img,
          Describe,
          typeid,
        });
        Alert.alert('Thành công', 'Đã sửa sản phẩm');
        setEditId(null);
      }
      setName('');
      setPrice('');
      setImg('');
      setDescribe('');
      setTypeid(types.length > 0 ? types[0].id : null);
      loadProducts();
    } catch (e) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setImg(product.img);
    setDescribe(product.Describe);
    setTypeid(product.typeid);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sản phẩm này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(id);
            loadProducts();
            Alert.alert('Thành công', 'Đã xóa sản phẩm');
          } catch (e) {
            Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
          }
        },
      },
    ]);
  };
  //
  const route = useRoute<RouteProp<RootStackParamList, 'Product'>>();

  useEffect(() => {
    loadProducts();
    fetchtype().then(data => {
      setTypes(data);
      if (route.params?.typeid !== undefined && route.params?.typeid !== null) {
        setTypeid(route.params.typeid);
      } else if (data.length > 0) {
        setTypeid(data[0].id);
      }
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Tên sản phẩm"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
          {img ? (
            <Image source={{uri: img}} style={styles.avatarPreview} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>Chọn ảnh</Text>
            </View>
          )}
          <Text style={styles.changeAvatarText}>Chọn ảnh sản phẩm</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, {flex: 2}]}
          placeholder="Mô tả"
          value={Describe}
          onChangeText={setDescribe}
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={{marginRight: 8}}>Loại:</Text>
        <ScrollView horizontal>
          {types.map(type => (
            <View>
              {type.id == 0 ? (
                <></>
              ) : (
                <>
                  {' '}
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeBtn,
                      typeid === type.id && styles.typeBtnActive,
                    ]}
                    onPress={() => setTypeid(type.id)}>
                    <Text
                      style={
                        typeid === type.id
                          ? styles.typeBtnTextActive
                          : styles.typeBtnText
                      }>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddOrUpdate}>
          <Text style={styles.addBtnText}>
            {editId === null ? 'Thêm' : 'Lưu'}
          </Text>
        </TouchableOpacity>
        {editId !== null && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setEditId(null);
              setName('');
              setPrice('');
              setImg('');
              setDescribe('');
              setTypeid(types.length > 0 ? types[0].id : null);
            }}>
            <Text style={styles.cancelBtnText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.productItem}>
            {item.img ? (
              <Image source={{uri: item.img}} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <View style={{flex: 1}}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                Giá: {item.price.toLocaleString()} đ
              </Text>
              <Text style={styles.productType}>
                Loại: {types.find(t => t.id === item.typeid)?.name || ''}
              </Text>
              <Text style={styles.productDesc}>{item.Describe}</Text>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => handleEdit(item)}>
              <Text style={styles.editBtnText}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteBtnText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{marginTop: 16}}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  inputRow: {flexDirection: 'row', marginBottom: 12, alignItems: 'center'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  avatarPicker: {
    alignItems: 'center',
    marginRight: 8,
  },
  avatarPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00C853',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CCC',
    overflow: 'hidden',
  },
  avatarPlaceholderText: {
    color: '#888',
    fontSize: 14,
  },
  changeAvatarText: {
    color: '#008060',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  addBtn: {backgroundColor: '#2196F3', padding: 10, borderRadius: 6},
  addBtnText: {color: '#fff', fontWeight: 'bold'},
  cancelBtn: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelBtnText: {color: '#fff'},
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  productName: {fontSize: 16, fontWeight: 'bold'},
  productPrice: {fontSize: 14, color: '#2196F3'},
  productType: {fontSize: 13, color: '#888'},
  productDesc: {fontSize: 13, color: '#444'},
  editBtn: {
    backgroundColor: '#FFC107',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  editBtnText: {color: '#fff'},
  deleteBtn: {backgroundColor: '#F44336', padding: 8, borderRadius: 6},
  deleteBtnText: {color: '#fff'},
  typeBtn: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  typeBtnActive: {
    backgroundColor: '#2196F3',
  },
  typeBtnText: {color: '#2196F3', fontWeight: 'bold'},
  typeBtnTextActive: {color: '#fff', fontWeight: 'bold'},
});

export default ProductScreen;
