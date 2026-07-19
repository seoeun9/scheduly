import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (nextMessage: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setMessage(nextMessage);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
        <AntDesign name="coffee" size={24} color="black" />
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 70,
    left: 24,
    right: 24,
    zIndex: 999,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  text: {
    fontSize: 14,
    color: '#212121',
    fontFamily: 'McLaren',
  },

  icon: {},
});
