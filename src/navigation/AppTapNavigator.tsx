// src/navigation/AppTabNavigator.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MainScreen from '@/screens/MainScreen';
import TodoListScreen from '@/screens/TodoListScreen';
import SettingScreen from '@/screens/SettingScreen';
import * as Haptics from 'expo-haptics';

export type AppTabParamList = {
  Calendar: undefined;
  Todos: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

type TabIconProps = {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

function TabIcon({ focused, icon, label }: TabIconProps) {
  return (
    <View className="flex w-[100px] items-center pt-3">
      <View>
        <Ionicons name={icon} size={21} color={focused ? '#111111' : '#818181'} />
      </View>

      <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>{label}</Text>
    </View>
  );
}

export default function AppTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Todos"
      screenListeners={{
        tabPress: () => {
          void Haptics.selectionAsync();
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,

        sceneStyle: {
          backgroundColor: 'transparent',
        },
      }}>
      <Tab.Screen
        name="Calendar"
        component={MainScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? 'calendar' : 'calendar-outline'}
              label="캘린더"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Todos"
        component={TodoListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={focused ? 'list' : 'list-outline'} label="리스트" />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();

            void Haptics.selectionAsync();

            navigation.getParent<any>()?.navigate('SettingsSheet');
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="settings-outline" label="설정" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,

    height: 65,
    paddingTop: 7,
    paddingBottom: 7,

    borderTopWidth: 0,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255)',

    shadowColor: '#6D9AB5',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.16,
    shadowRadius: 16,

    elevation: 10,
  },

  tabBarItem: {
    height: 58,
  },
  tabLabel: {
    marginTop: 7,
    color: '#818181',
    fontSize: 10,
    fontWeight: '500',
  },

  activeTabLabel: {
    color: '#111111',
    fontWeight: '700',
  },
});
