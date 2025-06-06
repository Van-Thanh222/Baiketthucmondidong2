// AutoDismissAlert.tsx
import React, {useEffect} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';

type AlertType = 'success' | 'error' | 'info';

type AutoDismissAlertProps = {
  visible: boolean;
  title?: string;
  message: string;
  type?: AlertType;
  duration?: number;
  onClose: () => void;
};

const typeConfig: Record<AlertType, {color: string; emoji: string}> = {
  success: {color: '#27AE60', emoji: '✅'},
  error: {color: '#E74C3C', emoji: '❌'},
  info: {color: '#3498DB', emoji: 'ℹ️'},
};

const AutoDismissAlert: React.FC<AutoDismissAlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  duration = 2000,
  onClose,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const {color, emoji} = typeConfig[type];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.alertBox, {borderColor: color}]}>
          <Text style={[styles.emoji]}>{emoji}</Text>
          <Text style={[styles.alertTitle, {color}]}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 18,
    minWidth: 280,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    borderWidth: 2,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  alertMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default AutoDismissAlert;
