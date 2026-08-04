// src/navigation/AppTabNavigator.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MainScreen from '@/screens/MainScreen';
import TodoListScreen from '@/screens/TodoListScreen';
import SettingScreen from '@/screens/SettingScreen';
import RoutineScreen from '@/screens/routine/RoutineScreen';
import * as Haptics from '@/utils/haptics';
import { useTheme } from '@/hooks/useTheme';

export type AppTabParamList = {
  Calendar: undefined;
  Todos: undefined;
  Settings: undefined;
  Routine: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

type TabIconProps = {
  focused: boolean;
  isDark: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  accentColor: string;
  activeBackgroundColor: string;
};

function TabIcon({
  focused,
  isDark,
  icon,
  label,
  accentColor,
  activeBackgroundColor,
}: TabIconProps) {
  const activeColor = accentColor;
  const inactiveColor = isDark ? '#777777' : '#929292';

  return (
    <View style={styles.tabContent}>
      <View
        style={[
          styles.iconContainer,
          focused && {
            backgroundColor: isDark ? '#292929' : activeBackgroundColor,
          },
        ]}>
        <Ionicons name={icon} size={22} color={focused ? activeColor : inactiveColor} />
      </View>

      <Text
        style={[
          styles.tabLabel,
          { color: focused ? activeColor : inactiveColor },
          focused && styles.activeTabLabel,
        ]}>
        {label}
      </Text>
    </View>
  );
}

export default function AppTabNavigator() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

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

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark ? '#111111' : '#FFFFFF',
            // shadowColor: isDark ? '#000000' : '#6D9AB5',
            // shadowOpacity: isDark ? 0.5 : 0.16,
            paddingBottom: Math.max(insets.bottom, 8),
            height: 76 + Math.max(insets.bottom - 8, 0),
          },
        ],
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
              isDark={isDark}
              icon={focused ? 'today' : 'today-outline'}
              label="캘린더"
              accentColor="#E56B6F"
              activeBackgroundColor="#FFF0F0"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Todos"
        component={TodoListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              isDark={isDark}
              icon={focused ? 'reader' : 'reader-outline'}
              label="리스트"
              accentColor="#5686D8"
              activeBackgroundColor="#EEF4FF"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Routine"
        component={RoutineScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              isDark={isDark}
              icon={focused ? 'flag' : 'flag-outline'}
              label="루틴"
              accentColor="#D38B26"
              activeBackgroundColor="#FFF5E5"
            />
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
            <TabIcon
              focused={focused}
              isDark={isDark}
              icon={focused ? 'settings' : 'settings-outline'}
              label="설정"
              accentColor="#8B72C8"
              activeBackgroundColor="#F4F0FF"
            />
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
    bottom: 5,

    height: 76,
    paddingTop: 7,
    paddingBottom: 8,

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
  tabContent: {
    width: 72,
    alignItems: 'center',
    paddingTop: 20,
  },
  iconContainer: {
    width: 42,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10.5,
    fontWeight: '500',
  },

  activeTabLabel: {
    fontWeight: '700',
  },
});
