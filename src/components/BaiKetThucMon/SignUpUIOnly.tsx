import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {addUser, UserInput, isEmailTaken} from './database';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigationService';
import AutoDismissAlert from './notification_function';

const SignUpUIOnly = () => {
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [address, setAddress] = React.useState<string>('');
  const [phome, setPhome] = React.useState<string>('');
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  //
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alerttite, setAlerttite] = React.useState('');
  const [alertStpe, setAlertStpe] = React.useState<
    'success' | 'error' | 'info'
  >('info');
  //
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{9}$/; // Bắt đầu bằng 0, đủ 10 số
    return phoneRegex.test(phone);
  };

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri ?? null);
      }
    });
  };

  const handleSignUp = async () => {
    if (!email || !username || !password || !address || !phome || !imageUri) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertMessage(`Mời bạn nhập đầy đủ thông tin`);
      setAlertStpe('info');
      return;
    }

    if (!isValidEmail(email)) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertMessage(`Email không hợp lệ`);
      setAlertStpe('error');
      return;
    }

    if (!(await isEmailTaken(email))) {
    } else {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertMessage(`Email đã được sử dụng`);
      setAlertStpe('error');
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
      const newUser: UserInput = {
        username,
        password,
        email,
        avatar: imageUri ?? '',
        address,
        phome,
      };

      await addUser(newUser);
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertMessage(`Đăng ký thành công Chào mừng ${username}`);
      setAlertStpe('success');
    } catch (error) {
      console.error('Lỗi khi đăng ký người dùng:', error);

      setAlertVisible(true);
      setAlerttite('Lỗi Đăng ký ');
      setAlertStpe('error');
      setAlertMessage(`Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.`);
    }
  };

  const getImageSource = (img: string) => {
    if (img.startsWith('file://')) {
      return {uri: img};
    }
    return require('../../../assets/image/anhavatarmacdinh.png');
  };
  // điều hướng
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const goToLogin = () => {
    navigation.navigate('Login');
  };
  // Hiện thị mật khẩu
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <AutoDismissAlert
        visible={alertVisible}
        title={alerttite}
        message={alertMessage}
        type={alertStpe}
        onClose={() => setAlertVisible(false)}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.avatarPlaceholder}
          onPress={handlePickImage}>
          <Image
            source={
              imageUri
                ? getImageSource(imageUri)
                : require('../../../assets/image/anhavatarmacdinh.png')
            }
            style={styles.avatarImage}
          />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            autoCapitalize="none"
            onChangeText={text => setUsername(text)}
          />
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              onChangeText={text => setPassword(text)}
              value={password}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={toggleShowPassword}>
              <Image
                source={
                  showPassword
                    ? require('../../../assets/image/icon/icon_mat_dong.png')
                    : require('../../../assets/image/icon/icon_mat_mo.png')
                }
                style={styles.eyeImage}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#999"
            onChangeText={text => setAddress(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            onChangeText={text => setPhome(text)}
          />
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>✔️ SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  loginText: {
    fontSize: 18,
    color: '#888',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    tintColor: '#ccc',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeImage: {
    width: 30,
    height: 30,
    // tintColor: '#888',
  },
  signUpButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 10,
  },
  termsText: {
    color: '#888',
    fontSize: 14,
  },
});

export default SignUpUIOnly;
