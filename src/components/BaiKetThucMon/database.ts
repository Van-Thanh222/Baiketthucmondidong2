import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
let db: SQLiteDatabase | null = null;
export const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabase({
    name: 'databaseapp.db',
    location: 'default',
  });
  console.log('Database opened successfully!');
  return db;
};
//////// tạo bảng người dùng
// Tạo các trường id, username, password, email, avatar, address, phome
export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  avatar: string;
  address: string;
  phome: string;
};
// Tạo dữ liệu mẫu
const initiaUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    email: 'admin@gmail.com',
    avatar:
      'file:///data/user/0/com.laptrinhreactnative/cache/rn_image_picker_lib_temp_0b0af829-1cb8-4413-b4df-9d10f107eba4.jpg',
    address: 'Quảng Nam',
    phome: '0123456789',
  },
];
// Tạo bảng người dùng
// export const initUserTable = async (onSuccess?: () => void): Promise<void> => {
//   try {
//     const db = await getDb();
//     await db.executeSql(
//       `CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT NOT NULL,
//         password TEXT NOT NULL,
//         email TEXT NOT NULL,
//         avatar TEXT,
//         address TEXT,
//         phome TEXT
//       )`,
//     );
//     console.log('User table created successfully!');
//     // Chèn dữ liệu mẫu vào bảng người dùng
//     for (const user of initiaUsers) {
//       await db.executeSql(
//         'INSERT INTO users (username, password, email, avatar, address, phome) VALUES (?, ?, ?, ?, ?, ?)',
//         [
//           user.username,
//           user.password,
//           user.email,
//           user.avatar,
//           user.address,
//           user.phome,
//         ],
//       );
//     }
//     if (onSuccess) {
//       onSuccess();
//     }
//   } catch (error) {
//     console.error('Error initializing user table:', error);
//   }
// };
export const initUserTable = async (onSuccess?: () => void): Promise<void> => {
  try {
    const db = await getDb();
    // Xoá bảng nếu đã tồn tại
    // await db.executeSql('DROP TABLE IF EXISTS users');
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar TEXT,
        address TEXT,
        phome TEXT
      )`,
    );
    console.log('User table created successfully!');

    // 🔍 Kiểm tra xem bảng đã có dữ liệu hay chưa
    const checkResult = await db.executeSql(
      'SELECT COUNT(*) as count FROM users',
    );
    const count = checkResult[0].rows.item(0).count;

    if (count === 0) {
      // 📥 Nếu chưa có dữ liệu thì chèn
      for (const user of initiaUsers) {
        await db.executeSql(
          'INSERT INTO users (username, password, email, avatar, address, phome) VALUES (?, ?, ?, ?, ?, ?)',
          [
            user.username,
            user.password,
            user.email,
            user.avatar,
            user.address,
            user.phome,
          ],
        );
      }
      console.log('Sample users inserted successfully!');
    } else {
      console.log('Users already exist, skipping sample data insertion.');
    }

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Error initializing user table:', error);
  }
};

// Lấy danh sách người dùng
export const findUsers = async (
  email_input: string,
  password_input: string,
): Promise<User | null> => {
  try {
    const db = await getDb();
    const result = await db.executeSql(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email_input, password_input],
    );
    if (result[0].rows.length > 0) {
      const user = result[0].rows.item(0);
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        avatar: user.avatar,
        address: user.address,
        phome: user.phome,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error finding users:', error);
    return null;
  }
};
// Thêm người dùng mới
export type UserInput = Omit<User, 'id'>;
export const addUser = async (user: UserInput): Promise<void> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO users (username, password, email, avatar, address, phome) VALUES (?, ?, ?, ?, ?, ?)',
      [
        user.username,
        user.password,
        user.email,
        user.avatar,
        user.address,
        user.phome,
      ],
    );
    console.log('User added successfully!', user);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error; // để Alert báo lỗi
  }
};
// Kiểm tra email đã tồn tại hay chưa
export const isEmailTaken = async (email: string): Promise<boolean> => {
  try {
    const db = await getDb();
    const result = await db.executeSql(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email],
    );
    const count = result[0].rows.item(0).count;
    return count > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};
// Kiểm tra email của login để đổi ảnh
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const db = await getDb();
    const result = await db.executeSql('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    if (result[0].rows.length > 0) {
      const user = result[0].rows.item(0);
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        avatar: user.avatar,
        address: user.address,
        phome: user.phome,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};
