import React from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthWelcome'>;

export default function AuthWelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/logos/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Image
          source={require('@/assets/logos/woman.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.question}>Do you have an account?</Text>

        <Pressable style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <Pressable style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Create account</Text>
        </Pressable>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    transform: [{ translateY: -30 }],
  },
  logo: {
    width: 98,
    height: 30,
  },
  image: {
    width: 292,
    height: 292,
  },
  slogan: {
    marginTop: 16,
    fontSize: 18,
    color: '#181A21',
  },
  question: {
    marginTop: 48,
    marginBottom: 18,
    fontSize: 14,
    fontWeight: '600',
    color: '#181A21',
  },
  loginButton: {
    width: '100%',
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    paddingHorizontal: 20,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#BDBDBD',
  },
  orText: {
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#181A21',
  },
  signUpButton: {
    width: '100%',
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#77C2F8',
  },
});
