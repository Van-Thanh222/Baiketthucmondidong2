import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AsyncStorage.getItem('user');
        if (data) setUser(JSON.parse(data));
      } catch (err) {
        console.error('Lỗi lấy user:', err);
      }
    };
    fetchUser();
  }, []);

  return {user, setUser};
}
