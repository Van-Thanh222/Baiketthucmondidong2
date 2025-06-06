import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {findUsers, getUserByEmail} from './database';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigationService';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AutoDismissAlert from './notification_function';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
  const [email_input, setEmail_input] = useState<string>('');
  const [password_input, setPassword] = useState<string>('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  //
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alerttite, setAlerttite] = useState('');
  const [alertStpe, setAlertStpe] = useState<'success' | 'error' | 'info'>(
    'info',
  );
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!email_input) {
        setAvatarUri(null);
        return;
      }

      const user = await getUserByEmail(email_input);
      if (user && user.avatar) {
        setAvatarUri(user.avatar);
      } else {
        setAvatarUri(null);
      }
    };

    fetchAvatar();
  }, [email_input]);

  const handlelogin = async () => {
    if (!email_input || !password_input) {
      setAlertVisible(true);
      setAlerttite('Thông Báo : ');
      setAlertStpe('info');
      setAlertMessage('Mời Bạn Nhập Đầy Đủ Thông Tin');

      return;
    } else {
      const user = await findUsers(email_input, password_input);
      if (user) {
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          address: user.address,
          phome: user.phome,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setAlertVisible(true);
        setAlerttite('Đăng Nhập Thành Công');
        setAlertStpe('success');
        setAlertMessage(`Chào mừng ${user.username}`);
        navigation.navigate('Home');
      } else {
        setAlertVisible(true);
        setAlertStpe('error');
        setAlerttite('Đăng Nhập Thất Bại ');
        setAlertMessage('Thông tin đăng nhập không chính xác');
      }
    }
  };
  // điều hướng
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };
  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };
  // Hiện thị mật khẩu
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <AutoDismissAlert
        visible={alertVisible}
        title={alerttite}
        message={alertMessage}
        type={alertStpe}
        onClose={() => setAlertVisible(false)}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <TouchableOpacity onPress={goToSignUp}>
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Image
            style={{width: 100, height: 100, borderRadius: 50}}
            source={
              avatarUri
                ? {uri: avatarUri}
                : require('../../../assets/image/anhavatarmacdinh.png')
            }
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username or email address"
          placeholderTextColor="#757575"
          onChangeText={text => setEmail_input(text)}
          value={email_input}
        />
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#757575"
            onChangeText={text => setPassword(text)}
            secureTextEntry={!showPassword}
            value={password_input}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
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
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handlelogin}>
        <Text style={styles.loginButtonText}>✔️ Login</Text>
      </TouchableOpacity>
      <View style={styles.loginWithContainer}>
        <Text style={styles.loginWithText}>Login with</Text>
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity>
            <Image
              style={styles.socialIcon}
              source={require('../../../assets/image/logo/logofb.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.socialIcon}
              source={require('../../../assets/image/logo/logoingaram.jpg')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.socialIcon}
              source={require('../../../assets/image/logo/logotele.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.socialIcon}
              source={require('../../../assets/image/logo/logotinder.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Forgot Your Password?</Text>
        <TouchableOpacity onPress={goToForgotPassword}>
          <Text style={styles.signUpButtonText}>Recover Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
    height: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  header: {
    width: '90%',
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#ede7f6',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  loginButtonText: {
    color: '#5e35b1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginWithContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginWithText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 10,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  socialIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#757575',
    marginRight: 5,
  },
  signUpButtonText: {
    fontSize: 16,
    color: '#5e35b1',
    fontWeight: 'bold',
  },
  // ...existing code...
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
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
  },
  // ...existing code...
});
