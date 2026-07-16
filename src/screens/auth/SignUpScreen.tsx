import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignUp = () => {
    console.log({
      name,
      email,
      password,
      passwordConfirm,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color="#181A21" />
        </Pressable>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.description}>Start planning your day with Scheduly.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#A3A3A3"
                style={styles.input}
              />
            </View>

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
                placeholder="Create a password"
                placeholderTextColor="#A3A3A3"
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>

              <TextInput
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                placeholder="Enter your password again"
                placeholderTextColor="#A3A3A3"
                secureTextEntry
                style={styles.input}
              />
            </View>

            <Pressable style={styles.primaryButton} onPress={handleSignUp}>
              <Text style={styles.primaryButtonText}>Create account</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>

            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    marginTop: 10,
    marginLeft: 10,
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
    marginTop: 40,
  },
  field: {
    marginBottom: 18,
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
  primaryButton: {
    height: 58,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#77C2F8',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    paddingBottom: 32,
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
