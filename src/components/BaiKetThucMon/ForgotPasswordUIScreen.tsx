import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {getUserByEmail} from './database';
import {useNavigation} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../navigationService';
import AutoDismissAlert from './notification_function';
import Taknavgation from '../taknavgation';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  // Hàm xử lý Thông báo:
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alerttite, setAlerttite] = useState('');
  const [alertStpe, setAlertStpe] = useState<'success' | 'error' | 'info'>(
    'info',
  );
  // Hàm xử lý quên mật khẩu
  const handleForgotPassword = async () => {
    if (!email || !phone || !username) {
      // Sử dụng AutoDismissAlert để hiển thị thông báo
      setAlertVisible(true);
      setAlerttite('Thông báo');
      setAlertMessage('Vui lòng nhập đầy đủ thông tin');
      setAlertStpe('info');
      return;
    }

    const user = await getUserByEmail(email);
    if (user && user.phome === phone && user.username === username) {
      // Sử dụng AutoDismissAlert để hiển thị thông báo
      setAlertVisible(true);
      setAlerttite('Mật khẩu : ');
      setAlertStpe('success');
      setAlertMessage(`Mật khẩu của bạn là: ${user.password}`);
      return;
    } else {
      setAlertVisible(true);
      setAlerttite('Thông báo : ');
      setAlertStpe('error');
      setAlertMessage(`Thông tin không chính xác`);
    }
  };
  // Điều hướng
  const navigation = useNavigation() as any;
  // useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const gotologin = () => {
    navigation.navigate('Taknavgation', {screen: 'Login'});
  };
  return (
    <View style={styles.container}>
      <AutoDismissAlert
        visible={alertVisible}
        type={alertStpe}
        title={alerttite}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <Text style={styles.title}>Recover Password</Text>

      <Image
        source={require('../../../assets/image/anhavatarmacdinh.png')}
        style={styles.image}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#757575"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        placeholderTextColor="#757575"
        onChangeText={setPhone}
        value={phone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Tên người dùng"
        placeholderTextColor="#757575"
        onChangeText={setUsername}
        value={username}
      />

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Get password</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>You Already Have Password?</Text>
        <TouchableOpacity onPress={gotologin}>
          <Text style={styles.signUpButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5e35b1',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#5e35b1',
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});
