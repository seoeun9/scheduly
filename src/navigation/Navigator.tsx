import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, View } from 'react-native';
import CalendarIcon from '@/assets/icons/calendarIcon.svg';
import ListIcon from '@/assets/icons/listIcon.svg';
import SettingIcon from '@/assets/icons/settingIcon.svg';

import CalendarScreen from '@/screens/CalendarScreen';
import ListScreen from '@/screens/ListScreen';
import SettingScreen from '@/screens/SettingScreen';

const Tab = createBottomTabNavigator();

function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View style={styles.tabBar}>
        <BlurView tint="light" intensity={70} style={StyleSheet.absoluteFill} />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          return (
            <Pressable
              key={route.key}
              style={styles.tabItem}
              onPress={() => navigation.navigate(route.name)}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? '#715E65' : '#FFD5E6',
                size: 28,
              })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <GlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ color }) => <CalendarIcon color={color} />,
          }}
        />
        <Tab.Screen
          name="List"
          component={ListScreen}
          options={{
            tabBarIcon: ({ color }) => <ListIcon color={color} />,
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ color }) => <SettingIcon color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 28,

    width: 335,
    height: 50,
    borderRadius: 38,
    overflow: 'hidden',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    backgroundColor: '#FFFFFF',
  },

  tabItem: {
    flex: 1,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
