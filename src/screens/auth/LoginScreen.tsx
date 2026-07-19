import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '@/components/ToastProvider';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      return;
    }
    showToast('Welcome back!');
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color="#181A21" />
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.description}>Log in to continue using Scheduly.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#A3A3A3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#A3A3A3"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Pressable style={styles.forgotButton} onPress={() => console.log('Forgot password')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Log in</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>

          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Create account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 28,
  },
  backButton: {
    width: 36,
    height: 36,
    marginTop: 10,
    marginLeft: -14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  title: {
    color: '#181A21',
    fontSize: 30,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    color: '#777777',
    fontSize: 16,
  },
  form: {
    marginTop: 48,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#181A21',
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 16,
    color: '#181A21',
    fontSize: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    color: '#4DA9EA',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    height: 58,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#000000',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: '#777777',
    fontSize: 15,
  },
  footerLink: {
    color: '#4DA9EA',
    fontSize: 15,
    fontWeight: '700',
  },
});
