import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

export const AboutShopScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Về Chúng Tôi</Text>
        <View style={styles.imageSection}>
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2017/08/02/06/00/auto-2569507_1280.jpg',
            }}
            style={styles.shopImage}
          />
          <Text style={styles.imageCaption}>
            Cửa hàng và đội ngũ của chúng tôi
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Chào Mừng Đến Với CarRent App!
          </Text>
          <Text style={styles.bodyText}>
            Chúng tôi tự hào là đối tác tin cậy của bạn trên mọi nẻo đường. Tại
            CarRent, chúng tôi chuyên cung cấp dịch vụ cho thuê xe ô tô đa dạng
            từ xe phổ thông đến xe cao cấp, đáp ứng mọi nhu cầu di chuyển của
            quý khách hàng, dù là đi công tác, du lịch hay đơn giản là di chuyển
            hàng ngày.
          </Text>
          <Text style={styles.bodyText}>
            Với đội ngũ nhân viên chuyên nghiệp, tận tâm và quy trình thuê xe
            nhanh chóng, minh bạch, chúng tôi cam kết mang đến trải nghiệm thuê
            xe dễ dàng, an toàn và tiết kiệm nhất. Mỗi chiếc xe của chúng tôi
            đều được bảo dưỡng định kỳ, đảm bảo chất lượng và an toàn tuyệt đối
            trước mỗi hành trình.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin Liên Hệ</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Địa chỉ:</Text>
            <Text style={styles.contactText}>
              123 Đường ABC, Quận XYZ, Thành phố Hồ Chí Minh
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Điện thoại:</Text>
            <Text style={styles.contactText}>090 123 4567</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactText}>support@carrent.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Giờ làm việc:</Text>
            <Text style={styles.contactText}>Thứ 2 - Thứ 7: 8:00 - 18:00</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giá Trị Của Chúng Tôi</Text>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Uy Tín và Chất Lượng:</Text>
            <Text style={styles.bodyText}>
              Chúng tôi luôn đặt sự hài lòng và an toàn của khách hàng lên hàng
              đầu.
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Đa Dạng Lựa Chọn:</Text>
            <Text style={styles.bodyText}>
              Kho xe phong phú, đáp ứng mọi nhu cầu và ngân sách.
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Dịch Vụ Tận Tâm:</Text>
            <Text style={styles.bodyText}>
              Đội ngũ hỗ trợ chuyên nghiệp, sẵn sàng giải đáp mọi thắc mắc.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutShopScreen;

const styles = StyleSheet.create({
  // Định nghĩa màu sắc theo hướng dẫn
  // COLOR_BRIGHT_GREEN: '#00C853',
  // COLOR_WHITE: '#FFFFFF',
  // COLOR_DARK_GRAY: '#2C3E50',
  // COLOR_LIGHT_GRAY: '#F0F2F5',
  // COLOR_MEDIUM_GRAY: '#7F8C8D',

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Nền toàn bộ màn hình
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 25,
  },
  imageSection: {
    backgroundColor: '#F0F2F5', // Nền xám nhạt cho khu vực ảnh
    borderRadius: 15,
    padding: 10,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  shopImage: {
    width: '100%',
    height: 200, // Chiều cao ảnh
    resizeMode: 'cover', // Đảm bảo ảnh lấp đầy
    borderRadius: 10,
    marginBottom: 10,
  },
  imageCaption: {
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00C853', // Màu xanh lá cây chính cho tiêu đề phần
    marginBottom: 15,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#2C3E50', // Xám đậm cho nội dung chính
    lineHeight: 24, // Khoảng cách dòng để dễ đọc
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start', // Căn trên nếu text dài
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    width: 100, // Chiều rộng cố định cho nhãn
  },
  contactText: {
    flex: 1, // Chiếm phần còn lại
    fontSize: 16,
    color: '#7F8C8D',
  },
  valueItem: {
    marginBottom: 15,
  },
  valueTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#008060', // Xanh lá cây đậm hơn cho tiêu đề giá trị
    marginBottom: 5,
  },
});
