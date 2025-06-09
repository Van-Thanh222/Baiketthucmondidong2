import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Product_type} from '../database';

type Props = {
  types: Product_type[];
  selectedTypeId: number;
  setSelectedTypeId: (id: number) => void;
};

const Producttype: React.FC<Props> = ({
  types,
  selectedTypeId,
  setSelectedTypeId,
}) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={types}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedTypeId === item.id && {
              borderColor: '#00C853',
              borderWidth: 2,
            },
          ]}
          onPress={() => setSelectedTypeId(item.id)}>
          <Image
            style={styles.typeImage}
            source={
              item.name === 'ALL'
                ? require('../../../../assets/image/logoALL.png')
                : {uri: item.avatar}
            }
          />
          <Text style={styles.typeName}>{item.name}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyListText}>Không có loại xe nào.</Text>
      }
      contentContainerStyle={styles.typeListContainer}
    />
  );
};

export default Producttype;

const styles = StyleSheet.create({
  typeListContainer: {
    paddingBottom: 10, // Khoảng cách dưới FlatList ngang
    marginBottom: 15, // Khoảng cách với phần tiếp theo
  },
  typeCard: {
    alignItems: 'center',
    marginRight: 15, // Khoảng cách giữa các loại xe
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: 90, // Chiều rộng cố định cho mỗi card loại
    height: 90, // Chiều cao cố định
    justifyContent: 'center',
  },
  typeImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Bo tròn ảnh loại
    marginBottom: 5,
    resizeMode: 'contain', // Đảm bảo ảnh icon vừa vặn
  },
  typeName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C3E50',
    textAlign: 'center',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
