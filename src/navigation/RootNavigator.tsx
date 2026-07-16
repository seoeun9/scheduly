import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthWelcomeScreen from '../screens/auth/AuthWelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

export type RootStackParamList = {
  AuthWelcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="AuthWelcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthWelcome" component={AuthWelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
