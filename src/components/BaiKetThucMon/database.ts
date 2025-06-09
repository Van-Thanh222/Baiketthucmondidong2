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
// sửa user
export const updateUser = async (user: User): Promise<void> => {
  try {
    const db = await getDb();
    await db.executeSql(
      `UPDATE users SET 
        username = ?, 
        password = ?, 
        avatar = ?, 
        address = ?, 
        phome = ?
      WHERE id = ?`,
      [
        user.username,
        user.password,
        user.avatar,
        user.address,
        user.phome,
        user.id,
      ],
    );
    console.log('✅ User updated');
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
};
//////// Tạo Bảng product_type
// tạo các trường cho loại sp
export type Product_type = {
  id: number;
  name: string;
  avatar: string;
};

const initialProduct_type: Product_type[] = [
  {
    id: 0,
    name: 'ALL',
    avatar: '',
  },
  {
    id: 1,
    name: 'Toyota',
    avatar: 'https://rubee.com.vn/wp-content/uploads/2021/05/logo-Toyota.jpg',
  },
  {
    id: 2,
    name: 'Honda',
    avatar:
      'data:image/jpeg;base64,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',
  },
  {
    id: 3,
    name: 'Mazda',
    avatar:
      'data:image/jpeg;base64,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',
  },
];

// Tạo bảng product_type
export const initiaProduct_typeTable = async (
  onSuccess?: () => void,
): Promise<void> => {
  try {
    const db = await getDb();
    // await db.executeSql('DROP TABLE IF EXISTS product_type');
    // Tạo bảng nếu chưa tồn tại
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS product_type (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL
      )`,
    );
    console.log('✅ product_type table created successfully!');

    // Kiểm tra dữ liệu mẫu đã tồn tại chưa
    const checkResult = await db.executeSql(
      'SELECT COUNT(*) as count FROM product_type',
    );
    const count = checkResult[0].rows.item(0).count;

    if (count === 0) {
      // Nếu chưa có dữ liệu, chèn dữ liệu mẫu
      for (const type of initialProduct_type) {
        await db.executeSql(
          'INSERT INTO product_type (id,name,avatar) VALUES (?,?,?)',
          [type.id, type.name, type.avatar],
        );
      }
      console.log('📥 Sample product types inserted successfully!');
    } else {
      console.log('ℹ️ Product types already exist, skipping insertion.');
    }

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('❌ Error initializing product_type table:', error);
  }
};
export const fetchtype = async (): Promise<Product_type[]> => {
  try {
    const db = await getDb();
    const results = await db.executeSql('SELECT * FROM product_type');
    const productTypes: Product_type[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      productTypes.push(rows.item(i));
    }
    return productTypes;
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
};
//////// Tạo Bảng product
// tạo các trường cho SP
export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  Describe: string;
  typeid: number;
};
const initiaProduct: Product[] = [
  {
    id: 1,
    name: 'Toyota Fortuner',
    price: 1434000000,
    img: 'data:image/jpeg;base64,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ERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERED/9k=',
    Describe: 'SUV 7 chỗ mạnh mẽ, bền bỉ',
    typeid: 1,
  },
];
// tạo Bảng
export const initiaProductTable = async (
  onSuccess?: () => void,
): Promise<void> => {
  try {
    const db = await getDb();

    // Tạo bảng nếu chưa tồn tại
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price NUMBER NOT NULL,
        img TEXT,
        Describe TEXT,
        typeid INTEGER
      )`,
    );
    console.log('✅ product table created successfully!');

    // Kiểm tra dữ liệu mẫu đã tồn tại chưa
    const checkResult = await db.executeSql(
      'SELECT COUNT(*) as count FROM product',
    );
    const count = checkResult[0].rows.item(0).count;

    if (count === 0) {
      // Nếu chưa có dữ liệu, chèn dữ liệu mẫu
      for (const product of initiaProduct) {
        await db.executeSql(
          'INSERT INTO product (name, price, img, Describe, typeid) VALUES (?, ?, ?, ?, ?)',
          [
            product.name,
            product.price,
            product.img,
            product.Describe,
            product.typeid,
          ],
        );
      }
      console.log('📥 Sample product inserted successfully!');
    } else {
      console.log('ℹ️ Product already exist, skipping insertion.');
    }

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('❌ Error initializing product table:', error);
  }
};
export const fetchproduct = async (): Promise<Product[]> => {
  try {
    const db = await getDb();
    const results = await db.executeSql('SELECT * FROM product');
    const product: Product[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      product.push(rows.item(i));
    }
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return [];
  }
};
