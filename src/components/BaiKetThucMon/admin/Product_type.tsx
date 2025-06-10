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
  SafeAreaView, // Thêm SafeAreaView
  ScrollView, // Thêm ScrollView
  Platform, // Để điều chỉnh unicode icon trên Android
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  fetchtype,
  addProductType,
  updateProductType,
  deleteProductType,
  Product_type,
} from '../database';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationService';

const ProductTypeScreen = () => {
  const [types, setTypes] = useState<Product_type[]>([]);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const loadTypes = async () => {
    const data = await fetchtype();
    setTypes(data);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.didCancel) {
        // User cancelled
      } else if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh');
      } else if (response.assets && response.assets[0]) {
        setAvatar(response.assets[0].uri ?? '');
      }
    });
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Tên loại sản phẩm không được để trống');
      return;
    }
    // Thêm kiểm tra ảnh không trống
    if (!avatar && editId === null) {
      // Chỉ kiểm tra khi thêm mới
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh đại diện cho loại sản phẩm');
      return;
    }
    try {
      if (editId === null) {
        await addProductType(name, avatar);
        Alert.alert('Thành công', 'Đã thêm loại sản phẩm');
      } else {
        await updateProductType(editId, name, avatar);
        Alert.alert('Thành công', 'Đã sửa loại sản phẩm');
        setEditId(null);
      }
      setName('');
      setAvatar('');
      loadTypes();
    } catch (e) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (type: Product_type) => {
    setEditId(type.id);
    setName(type.name);
    setAvatar(type.avatar);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa loại sản phẩm này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProductType(id);
            loadTypes();
            Alert.alert('Thành công', 'Đã xóa loại sản phẩm');
          } catch (e) {
            Alert.alert('Lỗi', 'Không thể xóa loại sản phẩm');
          }
        },
      },
    ]);
  };

  // Hàm này để xử lý ảnh hiển thị nếu có lỗi hoặc ảnh trống
  const getImageSource = (imgUri: string | null) => {
    if (imgUri && imgUri.startsWith('file://')) {
      return {uri: imgUri};
    } else if (imgUri) {
      return {uri: imgUri};
    }
    return require('../../../../assets/image/anhavatarmacdinh.png');
  };
  //
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản Lý Danh Mục Sản Phẩm</Text>
        </View>

        {/* Card Thêm/Sửa Loại Sản Phẩm */}
        <View style={styles.addEditCard}>
          <Text style={styles.cardTitle}>
            {editId === null
              ? '➕ Thêm Loại Sản Phẩm Mới'
              : '📝 Sửa Loại Sản Phẩm'}
          </Text>

          <View style={styles.inputFormRow}>
            <TextInput
              style={styles.input}
              placeholder="Tên danh mục"
              value={name}
              onChangeText={setName}
              placeholderTextColor={styles.placeholderText.color}
            />
            <TouchableOpacity
              style={styles.avatarPicker}
              onPress={handlePickImage}>
              {avatar ? (
                <Image source={{uri: avatar}} style={styles.avatarPreview} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>Chọn ảnh</Text>
                </View>
              )}
              <Text style={styles.changeAvatarText}>Ảnh đại diện</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddOrUpdate}>
              <Text style={styles.actionButtonText}>
                {editId === null ? '➕ Thêm Mới' : '💾 Lưu Thay Đổi'}
              </Text>
            </TouchableOpacity>
            {editId !== null && (
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setEditId(null);
                  setName('');
                  setAvatar('');
                }}>
                <Text style={styles.actionButtonText}>❌ Hủy</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Card Danh sách Loại Sản Phẩm */}
        <View style={styles.listCard}>
          <Text style={styles.cardTitle}>📦 Danh Sách Loại Sản Phẩm</Text>
          <FlatList
            data={types}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) =>
              // Only render if id is not 0
              item.id !== 0 ? (
                <View style={styles.typeItem}>
                  <Image
                    source={getImageSource(item.avatar)}
                    style={styles.itemAvatar}
                  />
                  <Text style={styles.typeName}>{item.name}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => handleEdit(item)}>
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(item.id)}>
                      <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addProductBtn}
                      onPress={() =>
                        navigation.navigate('Product', {typeid: item.id})
                      }>
                      <Text style={styles.actionIcon}>➕ SP</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            }
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Định nghĩa màu sắc (copy từ các màn hình trước để đồng bộ)
  //   COLOR_BRIGHT_GREEN: '#00C853', // Xanh lá cây tươi sáng
  //   COLOR_WHITE: '#FFFFFF', // Trắng
  //   COLOR_DARK_GRAY: '#2C3E50', // Xám đậm, gần đen
  //   COLOR_LIGHT_GRAY: '#F0F2F5', // Xám nhạt
  //   COLOR_RED_DELETE: '#E74C3C', // Màu đỏ cho xóa
  //   COLOR_ORANGE_EDIT: '#FFC107', // Màu cam cho sửa
  //   COLOR_BLUE_ACCENT: '#3498DB', // Xanh dương cho các action
  //   COLOR_GREEN_SUCCESS: '#28A745', // Xanh lá cây cho thành công

  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Nền tổng thể xám nhạt
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50', // Xám đậm
    marginBottom: 20,
    textAlign: 'center',
  },
  addEditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  inputFormRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Căn chỉnh các item ở cuối hàng
    marginBottom: 20,
  },
  input: {
    flex: 1, // Chiếm phần lớn không gian
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
    fontSize: 16,
    paddingVertical: 10,
    marginRight: 15, // Khoảng cách với avatar picker
    color: '#2C3E50',
  },
  placeholderText: {
    color: '#A0A0A0',
  },
  avatarPicker: {
    alignItems: 'center',
  },
  avatarPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00C853',
    resizeMode: 'cover',
    marginBottom: 5,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CCC',
    marginBottom: 5,
  },
  avatarPlaceholderText: {
    color: '#888',
    fontSize: 12,
  },
  changeAvatarText: {
    color: '#008060', // Xanh lá cây đậm hơn
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#00C853', // Xanh lá cây cho nút chính
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    // Điều chỉnh cho Android nếu cần
    ...Platform.select({
      android: {
        lineHeight: 22,
      },
    }),
  },
  cancelButton: {
    backgroundColor: '#7F8C8D', // Xám cho nút hủy
  },

  // List Styles
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  flatListContent: {
    paddingBottom: 10, // Khoảng cách cuối danh sách
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#3498DB', // Xanh dương cho avatar list
    resizeMode: 'cover',
  },
  typeName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#FFC107', // Màu cam
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#E74C3C', // Màu đỏ
    padding: 8,
    borderRadius: 8,
  },
  actionIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    // Điều chỉnh cho Android nếu cần
    ...Platform.select({
      android: {
        lineHeight: 20,
      },
    }),
  },
  addProductBtn: {
    backgroundColor: '#00C853',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
});

export default ProductTypeScreen;
