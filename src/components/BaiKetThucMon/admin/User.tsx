import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  User,
  UserInput,
  addUser,
  getDb,
  updateUser,
  isEmailTaken,
  updateUserRole,
} from '../database';
import AutoDismissAlert from '../notification_function';

const UserScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [phome, setPhome] = useState('');
  const [role, setRole] = useState('user');

  // Lấy danh sách user
  const fetchUsers = async () => {
    try {
      const db = await getDb();
      const result = await db.executeSql('SELECT * FROM users');
      const rows = result[0].rows;
      const userList: User[] = [];
      for (let i = 0; i < rows.length; i++) {
        userList.push(rows.item(i));
      }
      setUsers(userList);
    } catch (error) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertStpe('error');
      setAlertMessage('Không thể lấy danh sách user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Chọn ảnh đại diện
  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        setAvatar(response.assets[0].uri ?? null);
      }
    });
  };

  // Validate
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Thêm user mới
  const handleAddUser = async () => {
    if (!username || !password || !email || !address || !phome || !avatar) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertStpe('error');
      setAlertMessage('Vui lòng nhập đầy đủ thông tin');

      return;
    }
    if (!isValidEmail(email)) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertStpe('error');
      setAlertMessage('Email không hợp lệ');
      return;
    }
    if (await isEmailTaken(email)) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertStpe('error');
      setAlertMessage('Email đã được sử dụng');
      return;
    }
    if (!isValidPhone(phome)) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertStpe('error');
      setAlertMessage('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0');
      return;
    }
    try {
      await addUser({
        username,
        password,
        email,
        avatar: avatar ?? '',
        address,
        phome,
        role,
      });
      setUsername('');
      setPassword('');
      setEmail('');
      setAvatar(null);
      setAddress('');
      setPhome('');
      setRole('user');
      fetchUsers();
      setAlertVisible(true);
      setAlerttite('Thành công');
      setAlertStpe('success');
      setAlertMessage(`Đã thêm user ${username}`);
    } catch (error) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertStpe('error');
      setAlertMessage('Không thể thêm user');
    }
  };

  // Xóa user
  const handleDeleteUser = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa user này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await getDb();
            await db.executeSql('DELETE FROM users WHERE id = ?', [id]);
            fetchUsers();
            setAlertVisible(true);
            setAlerttite('Thành công');
            setAlertStpe('success');
            setAlertMessage('Đã xóa user');
          } catch (error) {
            setAlertVisible(true);
            setAlerttite('Thông Báo : ');
            setAlertStpe('error');
            setAlertMessage('Không thể xóa user');
          }
        },
      },
    ]);
  };

  const getImageSource = (img: string | null) => {
    if (img && img.startsWith('file://')) {
      return {uri: img};
    }
    return require('../../../../assets/image/anhavatarmacdinh.png');
  };
  // thông báo
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alerttite, setAlerttite] = React.useState('');
  const [alertStpe, setAlertStpe] = React.useState<
    'success' | 'error' | 'info'
  >('info');
  return (
    <SafeAreaView style={styles.safeArea}>
      <AutoDismissAlert
        visible={alertVisible}
        title={alerttite}
        message={alertMessage}
        type={alertStpe}
        onClose={() => setAlertVisible(false)}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản Lý Người Dùng</Text>
        </View>

        <View style={styles.addEditCard}>
          <Text style={styles.cardTitle}>➕ Thêm Người Dùng Mới</Text>

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
            <Text style={styles.changeAvatarText}>Chọn ảnh đại diện</Text>
          </TouchableOpacity>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Tên đăng nhập:</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Mật khẩu:</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Địa chỉ:</Text>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Số điện thoại:</Text>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phome}
              onChangeText={setPhome}
              keyboardType="phone-pad"
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>
          <View style={styles.roleSelectionRow}>
            <Text style={styles.inputLabel}>Vai trò:</Text>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'user' && styles.roleBtnActive]}
              onPress={() => setRole('user')}>
              <Text
                style={
                  role === 'user'
                    ? styles.roleBtnTextActive
                    : styles.roleBtnText
                }>
                Người Dùng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]}
              onPress={() => setRole('admin')}>
              <Text
                style={
                  role === 'admin'
                    ? styles.roleBtnTextActive
                    : styles.roleBtnText
                }>
                Quản Trị
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAddUser}>
            <Text style={styles.addBtnText}>➕ Thêm Người Dùng</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userListCard}>
          <Text style={styles.cardTitle}>📋 Danh Sách Người Dùng</Text>
          <FlatList
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.userItem}>
                <View style={styles.userInfoLeft}>
                  <Image
                    source={getImageSource(item.avatar)}
                    style={styles.userAvatarSmall}
                    onError={e => {
                      console.log(
                        'Error loading user avatar:',
                        e.nativeEvent.error,
                      );
                    }}
                  />
                  <View style={styles.userInfoText}>
                    <Text style={styles.userName}>{item.username}</Text>
                    <Text style={styles.userEmail}>📧 {item.email}</Text>
                    <Text style={styles.userPhone}>📞 {item.phome}</Text>
                    <Text style={styles.userAddress}>🏠 {item.address}</Text>
                  </View>
                </View>
                {item.role == 'admin' ? (
                  <></>
                ) : (
                  <>
                    {' '}
                    <View style={styles.userActions}>
                      <Text style={styles.userRoleLabel}>Vai trò:</Text>
                      <TouchableOpacity
                        style={[
                          styles.roleToggleBtn,
                          item.role === 'user' && styles.roleToggleBtnActive,
                        ]}
                        onPress={async () => {
                          if (item.role !== 'user') {
                            await updateUserRole(item.id, 'user');
                            setAlertVisible(true);
                            setAlerttite('Thông Báo : ');
                            setAlertStpe('success');
                            setAlertMessage('Cập Nhật thành Công');
                            fetchUsers();
                          }
                        }}>
                        <Text
                          style={
                            item.role === 'user'
                              ? styles.roleToggleBtnTextActive
                              : styles.roleToggleBtnText
                          }>
                          👤 User
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.roleToggleBtn,
                          item.role === 'admin' && styles.roleToggleBtnActive,
                        ]}
                        onPress={async () => {
                          if (item.role !== 'admin') {
                            setAlertVisible(true);
                            setAlerttite('Thông Báo : ');
                            setAlertStpe('success');
                            setAlertMessage('Cập Nhật thành Công');
                            await updateUserRole(item.id, 'admin');
                            fetchUsers();
                          }
                        }}>
                        <Text
                          style={
                            item.role === 'admin'
                              ? styles.roleToggleBtnTextActive
                              : styles.roleToggleBtnText
                          }>
                          👑 Admin
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteUserBtn}
                        onPress={() => handleDeleteUser(item.id)}>
                        <Text style={styles.deleteUserBtnText}>🗑️ Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  // Định nghĩa màu sắc (copy từ Account.js để đồng bộ)
  //   COLOR_BRIGHT_GREEN: '#00C853', // Xanh lá cây tươi sáng
  //   COLOR_WHITE: '#FFFFFF', // Trắng
  //   COLOR_DARK_GRAY: '#2C3E50', // Xám đậm, gần đen
  //   COLOR_LIGHT_GRAY: '#F0F2F5', // Xám nhạt
  //   COLOR_RED_DELETE: '#E74C3C', // Màu đỏ cho đăng xuất/xóa
  //   COLOR_MEDIUM_GRAY: '#7F8C8D', // Xám trung tính
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
  avatarPicker: {
    alignSelf: 'center',
    marginBottom: 20,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00C853',
    resizeMode: 'cover',
  },
  changeAvatarText: {
    color: '#008060', // Xanh lá cây đậm hơn
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  inputLabel: {
    width: 110, // Cố định chiều rộng cho label
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  placeholderText: {
    color: '#A0A0A0',
  },
  roleSelectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    marginTop: 10,
  },
  roleBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    marginHorizontal: 5,
    backgroundColor: '#F0F0F0',
  },
  roleBtnActive: {
    backgroundColor: '#00C853', // Xanh lá cây khi active
    borderColor: '#00C853',
  },
  roleBtnText: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: '#00C853', // Màu xanh lá cây
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // User List Styles
  userListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    marginBottom: 5, // Khoảng cách giữa các item
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2, // Chiếm nhiều không gian hơn
  },
  userAvatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    resizeMode: 'cover',
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  userAddress: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  userActions: {
    flex: 1, // Chiếm không gian còn lại
    alignItems: 'flex-end', // Căn chỉnh các nút sang phải
  },
  userRoleLabel: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: 5,
  },
  roleToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    marginBottom: 5,
    backgroundColor: '#F7F7F7',
    minWidth: 80, // Đảm bảo nút có chiều rộng đủ
    alignItems: 'center',
  },
  roleToggleBtnActive: {
    backgroundColor: '#3498DB', // Xanh dương khi active
    borderColor: '#3498DB',
  },
  roleToggleBtnText: {
    color: '#2C3E50',
    fontSize: 12,
    fontWeight: '500',
  },
  roleToggleBtnTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteUserBtn: {
    backgroundColor: '#E74C3C', // Đỏ cho xóa
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '100%', // Nút xóa chiếm hết chiều rộng
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteUserBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Styles
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền mờ hơn
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Chiều rộng modal
    maxWidth: 350,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  modalUsername: {
    marginBottom: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  modalRoleSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonSave: {
    backgroundColor: '#00C853', // Màu xanh lá cây
  },
  modalButtonCancel: {
    backgroundColor: '#E74C3C', // Màu đỏ
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
