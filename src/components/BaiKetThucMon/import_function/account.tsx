import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {updateUser} from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutoDismissAlert from '../notification_function';

type AccountProps = {
  user: any;
  onUserUpdate: (user: any) => void;
};

const Account = ({user, onUserUpdate}: AccountProps) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    avatar: '',
    address: '',
    phome: '',
    oldPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || 'https://via.placeholder.com/120',
        address: user.address || '',
        phome: user.phome || '',
        oldPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.didCancel) {
      } else if (response.errorCode) {
        setAlertVisible(true);
        setAlertStpe('error');
        setAlerttite('Lỗi');
        setAlertMessage('Không thể chọn ảnh');
      } else if (response.assets && response.assets[0]) {
        setForm({...form, avatar: response.assets[0].uri ?? ''});
      }
    });
  };

  const handleSave = async () => {
    try {
      if (!user?.id) return;

      if (!form.username.trim() || !form.address.trim() || !form.phome.trim()) {
        setAlertVisible(true);
        setAlertStpe('error');
        setAlerttite('Lỗi');
        setAlertMessage(
          'Tên đăng nhập, địa chỉ và số điện thoại không được để trống',
        );
        return;
      }

      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(form.phome)) {
        setAlertVisible(true);
        setAlertStpe('error');
        setAlerttite('Lỗi');
        setAlertMessage(
          'Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số',
        );
        return;
      }

      if (form.oldPassword !== '') {
        if (form.oldPassword !== user.password) {
          setAlertVisible(true);
          setAlertStpe('error');
          setAlerttite('Lỗi');
          setAlertMessage('Mật khẩu cũ không đúng');
          return;
        }
        if (
          form.newPassword.trim().length > 0 &&
          form.newPassword.trim().length < 6
        ) {
          setAlertVisible(true);
          setAlertStpe('error');
          setAlerttite('Lỗi');
          setAlertMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
          return;
        }
      } else if (form.newPassword.trim() !== '') {
        setAlertVisible(true);
        setAlertStpe('error');
        setAlerttite('Lỗi');
        setAlertMessage('Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới.');
        return;
      }

      const newPassword =
        form.newPassword.trim() !== '' ? form.newPassword : user.password;

      const updatedUser = {
        id: user.id,
        username: form.username,
        password: newPassword,
        email: user.email,
        avatar: form.avatar,
        address: form.address,
        phome: form.phome,
      };

      await updateUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);

      setAlertVisible(true);
      setAlertStpe('success');
      setAlerttite('Thành Công');
      setAlertMessage('Đã cập nhật tài khoản');
      setForm(prevForm => ({...prevForm, oldPassword: '', newPassword: ''}));
    } catch (err) {
      console.error('🔴 Update user error:', err);
      setAlertVisible(true);
      setAlertStpe('error');
      setAlerttite('Lỗi');
      setAlertMessage('Không thể cập nhật tài khoản');
    }
  };

  // Thông báo (GIỮ NGUYÊN LOGIC CỦA BẠN)
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alerttite, setAlerttite] = useState('');
  const [alertStpe, setAlertStpe] = useState<'success' | 'error' | 'info'>(
    'info',
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.accountCard}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.avatarTouchable}>
              <Image
                source={{uri: form.avatar}}
                style={styles.avatar}
                onError={e => {
                  console.log('Error loading avatar:', e.nativeEvent.error);
                  setForm(prevForm => ({
                    ...prevForm,
                    avatar: 'https://via.placeholder.com/120?text=Lỗi+Ảnh',
                  }));
                }}
              />
              <Text style={styles.changeAvatarText}>Chọn ảnh mới</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Tên đăng nhập:</Text>
            <TextInput
              style={styles.input}
              value={form.username}
              onChangeText={text => setForm({...form, username: text})}
              placeholder="Nhập tên đăng nhập"
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={form.email}
              editable={false}
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Địa chỉ:</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={text => setForm({...form, address: text})}
              placeholder="Nhập địa chỉ"
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Số điện thoại:</Text>
            <TextInput
              style={styles.input}
              value={form.phome}
              onChangeText={text => setForm({...form, phome: text})}
              keyboardType="phone-pad"
              placeholder="Nhập số điện thoại"
              placeholderTextColor={styles.placeholderText.color}
            />
          </View>

          <View style={styles.passwordSection}>
            <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Mật khẩu cũ:</Text>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu cũ"
                secureTextEntry
                value={form.oldPassword}
                onChangeText={text => setForm({...form, oldPassword: text})}
                placeholderTextColor={styles.placeholderText.color}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Mật khẩu mới:</Text>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới (để trống nếu không đổi)"
                secureTextEntry
                value={form.newPassword}
                onChangeText={text => setForm({...form, newPassword: text})}
                placeholderTextColor={styles.placeholderText.color}
              />
            </View>
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveChangesBtn}>
            <Text style={styles.saveChangesBtnText}>✔️ Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AutoDismissAlert
        visible={alertVisible}
        title={alerttite}
        message={alertMessage}
        type={alertStpe}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Định nghĩa màu sắc theo hướng dẫn
  // COLOR_BRIGHT_GREEN: '#00C853', // Xanh lá cây tươi sáng
  // COLOR_WHITE: '#FFFFFF', // Trắng
  // COLOR_DARK_GRAY: '#2C3E50', // Xám đậm, gần đen
  // COLOR_LIGHT_GRAY: '#F0F2F5', // Xám nhạt
  // COLOR_RED_DELETE: '#E74C3C', // Màu đỏ cho đăng xuất
  // COLOR_MEDIUM_GRAY: '#7F8C8D', // Xám trung tính

  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Nền tổng thể xám nhạt để card nổi bật
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
  accountCard: {
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarTouchable: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#00C853', // Màu border xanh lá cây
    marginBottom: 10,
    resizeMode: 'cover',
  },
  changeAvatarText: {
    color: '#008060', // Xanh lá cây đậm hơn
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5', // Đường phân cách nhạt
  },
  inputLabel: {
    width: 120, // Chiều rộng cố định cho nhãn
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50', // Xám đậm
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    paddingVertical: 5, // Tối ưu padding
  },
  disabledInput: {
    color: '#7F8C8D', // Màu xám cho input không chỉnh sửa được
    backgroundColor: '#F9F9F9', // Nền hơi khác cho input bị disable
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  placeholderText: {
    color: '#A0A0A0', // Màu xám cho placeholder
  },
  passwordSection: {
    marginTop: 20,
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5', // Đường phân cách trên phần đổi mật khẩu
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#008060', // Tiêu đề phần đổi mật khẩu
    marginBottom: 15,
    textAlign: 'center',
  },
  saveChangesBtn: {
    backgroundColor: '#00C853', // Nút lưu màu xanh lá cây tươi sáng
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveChangesBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    // Đảm bảo icon Unicode hiển thị đúng trên các nền tảng
    ...Platform.select({
      android: {
        lineHeight: 25, // Adjust for better vertical alignment of unicode characters on Android
      },
    }),
  },
});

export default Account;
