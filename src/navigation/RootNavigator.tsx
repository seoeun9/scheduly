import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthWelcomeScreen from '../screens/auth/AuthWelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import MainScreen from '@/screens/MainScreen';
import SettingScreen from '@/screens/SettingScreen';
import AppTabNavigator from './AppTapNavigator';
import AddTodoScreen from '@/screens/AddTodoScreen';
import EditTodoScreen from '@/screens/EditTodoScreen';
import AddRoutineScreen from '@/screens/routine/AddRoutineScreen';
import EditRoutineScreen from '@/screens/routine/EditRoutineScreen';
import EditRoutineQuoteScreen from '@/screens/routine/EditRoutineQuoteScreen';
import TodoListScreen from '@/screens/TodoListScreen';

export type RootStackParamList = {
  AuthWelcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  TodoList: undefined;
  SettingsSheet: undefined;
  AddTodo:
    | {
        previewMode?: 'calendar' | 'list';
      }
    | undefined;
  EditTodo: {
    todoId: string;
    previewMode?: 'calendar' | 'list';
  };
  AddRoutine: undefined;
  EditRoutine: {
    routineId: string;
  };
  EditRoutineQuote: undefined;
  AppTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="AppTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthWelcome" component={AuthWelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="TodoList" component={TodoListScreen} />
      {/* <Stack.Screen
        name="SettingsSheet"
        component={SettingScreen}
        options={{
          presentation: 'formSheet',
          headerShown: false,

          sheetAllowedDetents: [0.82, 1],
          sheetInitialDetentIndex: 0,

          sheetGrabberVisible: true,
          sheetCornerRadius: 28,
          sheetElevation: 18,

          sheetLargestUndimmedDetentIndex: 'none',

          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      /> */}
      <Stack.Screen
        name="SettingsSheet"
        component={SettingScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          headerShown: false,

          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <Stack.Screen
        name="AddTodo"
        component={AddTodoScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          headerShown: false,

          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <Stack.Screen
        name="EditTodo"
        component={EditTodoScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          headerShown: false,

          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <Stack.Screen
        name="AddRoutine"
        component={AddRoutineScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          headerShown: false,

          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <Stack.Screen
        name="EditRoutine"
        component={EditRoutineScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          headerShown: false,

          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <Stack.Screen
        name="EditRoutineQuote"
        component={EditRoutineQuoteScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          headerShown: false,

          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <Stack.Screen name="AppTabs" component={AppTabNavigator} />
    </Stack.Navigator>
  );
}
