// import { useEffect, useRef, useState } from 'react';
// import { Animated, Easing, Platform, View, Text, Pressable, Modal } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import * as Haptics from '@/utils/haptics';
// import { useColorScheme } from 'nativewind';
// import { useThemeStore, ThemeMode } from '@/stores/themeStore';
// import { useTheme } from '@/hooks/useTheme';

// type SettingSectionProps = {
//   title: string;
//   function?: [];
// };

// export default function SettingSection(props: SettingSectionProps) {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
//   const [isReminderTimeOpen, setIsReminderTimeOpen] = useState(false);
//   const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
//   const [reminderTime, setReminderTime] = useState(() => {
//     const initialTime = new Date();

//     initialTime.setHours(20, 0, 0, 0);

//     return initialTime;
//   });
//   const [draftReminderTime, setDraftReminderTime] = useState(reminderTime);
//   const { setColorScheme } = useColorScheme();
//   const { themeMode, setThemeMode } = useThemeStore();
//   const { isDark } = useTheme();

//   const handleChangeTheme = (mode: ThemeMode) => {
//     Haptics.selectionAsync();
//     setThemeMode(mode);
//     setColorScheme(mode);
//   };

//   const handleOpenTimePicker = () => {
//     void Haptics.selectionAsync();

//     setDraftReminderTime(new Date(reminderTime));
//     setIsTimePickerOpen(true);
//   };

//   const handleCancelTimePicker = () => {
//     void Haptics.selectionAsync();
//     setIsTimePickerOpen(false);
//   };

//   const handleConfirmTimePicker = () => {
//     void Haptics.selectionAsync();

//     setReminderTime(new Date(draftReminderTime));
//     setIsTimePickerOpen(false);
//   };

//   const toggleTranslateX = useRef(new Animated.Value(notificationsEnabled ? 18 : 0)).current;
//   const themeFadeOpacity = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.spring(toggleTranslateX, {
//       toValue: notificationsEnabled ? 18 : 0,
//       tension: 180,
//       friction: 18,
//       useNativeDriver: true,
//     }).start();
//   }, [notificationsEnabled, toggleTranslateX]);

//   useEffect(() => {
//     Animated.timing(themeFadeOpacity, {
//       toValue: 1,
//       duration: 170,
//       easing: Easing.out(Easing.quad),
//       useNativeDriver: true,
//     }).start();
//   }, [themeMode, themeFadeOpacity]);

//   const handleToggleNotifications = () => {
//     void Haptics.selectionAsync();
//     setNotificationsEnabled((previous) => !previous);
//   };

//   const handleToggleReminderTime = () => {
//     void Haptics.selectionAsync();
//     setIsReminderTimeOpen((previous) => !previous);
//   };

//   const handleSelectPresetTime = (hour: number) => {
//     void Haptics.selectionAsync();
//     setReminderTime((current) => {
//       const next = new Date(current);

//       next.setHours(hour, 0, 0, 0);

//       return next;
//     });
//   };

//   const handleChangeReminderTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
//     if (Platform.OS === 'android') {
//       setIsTimePickerOpen(false);
//     }

//     if (event.type === 'set' && selectedTime) {
//       setReminderTime(selectedTime);
//       void Haptics.selectionAsync();
//     }
//   };

//   const formattedReminderTime = reminderTime.toLocaleTimeString('ko-KR', {
//     hour: 'numeric',
//     minute: '2-digit',
//   });

//   const reminderPresetHours = [9, 18, 20, 21];

//   return (
//     <>
//       <View className="flex flex-col items-start justify-center gap-3 px-10 pt-10">
//         <Text className="text-[13px] font-medium text-[#7C7C7C]">{props.title}</Text>
//         <View
//           className={`w-full rounded-[18px] border px-7 py-6 ${isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-[#F1F1F1] bg-white'}`}>
//           {props.title === '일반' && (
//             <View className="flex flex-col items-center justify-start gap-1">
//               <View className="flex w-full flex-row items-center justify-between">
//                 <View className="flex flex-row items-center justify-start gap-3">
//                   <Ionicons
//                     name="notifications-outline"
//                     size={18}
//                     color={isDark ? '#FFFFFF' : '#222631'}
//                   />
//                   <Text
//                     className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
//                     알림
//                   </Text>
//                 </View>
//                 <View className="flex-row items-center gap-2">
//                   <Pressable
//                     accessibilityRole="button"
//                     accessibilityLabel={`리마인드 시간 ${formattedReminderTime}`}
//                     onPress={handleToggleReminderTime}
//                     className={`h-[30px] flex-row items-center gap-1.5 rounded-full px-2.5 ${
//                       isReminderTimeOpen ? (isDark ? 'bg-[#2F2F2F]' : 'bg-[#F1F1F1]') : ''
//                     }`}>
//                     <Ionicons
//                       name="time-outline"
//                       size={17}
//                       color={
//                         notificationsEnabled
//                           ? isDark
//                             ? '#FFFFFF'
//                             : '#222631'
//                           : isDark
//                             ? '#666666'
//                             : '#B0B0B0'
//                       }
//                     />
//                     <Text
//                       className={`text-[12px] font-semibold ${
//                         notificationsEnabled
//                           ? isDark
//                             ? 'text-white'
//                             : 'text-[#222631]'
//                           : 'text-[#A5A5A5]'
//                       }`}>
//                       {formattedReminderTime}
//                     </Text>
//                     <Ionicons
//                       name={isReminderTimeOpen ? 'chevron-up' : 'chevron-down'}
//                       size={13}
//                       color={isDark ? '#8A8A8A' : '#888888'}
//                     />
//                   </Pressable>

//                   <Pressable
//                     accessibilityRole="switch"
//                     accessibilityState={{ checked: notificationsEnabled }}
//                     onPress={handleToggleNotifications}
//                     className="h-[26px] w-[44px] rounded-full px-[4px] py-[4px]"
//                     style={{
//                       backgroundColor: notificationsEnabled
//                         ? isDark
//                           ? '#FFFFFF'
//                           : '#111111'
//                         : isDark
//                           ? '#3A3A3A'
//                           : '#E7E7EA',
//                     }}>
//                     <Animated.View
//                       className="h-[18px] w-[18px] rounded-full"
//                       style={{
//                         backgroundColor: isDark && notificationsEnabled ? '#111111' : '#FFFFFF',
//                         transform: [{ translateX: toggleTranslateX }],
//                         shadowColor: '#000000',
//                         shadowOpacity: 0.16,
//                         shadowRadius: 3,
//                         shadowOffset: { width: 0, height: 1 },
//                         elevation: 1,
//                       }}
//                     />
//                   </Pressable>
//                 </View>
//               </View>

//               {isReminderTimeOpen && (
//                 <View
//                   className={`mt-4 w-full rounded-2xl p-4 ${
//                     isDark ? 'bg-[#1A1A1A]' : 'bg-[#F7F7F7]'
//                   }`}>
//                   <View className="mb-3 flex-row items-center justify-between">
//                     <View>
//                       <Text
//                         className={`text-[13px] font-semibold ${
//                           isDark ? 'text-white' : 'text-[#222631]'
//                         }`}>
//                         알림 받을 시간
//                       </Text>
//                       <Text className="mt-1 text-[11px] text-[#8A8A8A]">
//                         남은 할 일이 있을 때 알려드려요
//                       </Text>
//                     </View>
//                     <Text
//                       className={`text-[16px] font-semibold ${
//                         isDark ? 'text-white' : 'text-[#222631]'
//                       }`}>
//                       {formattedReminderTime}
//                     </Text>
//                   </View>

//                   <View className="flex-row flex-wrap gap-2">
//                     {reminderPresetHours.map((hour) => {
//                       const isSelected =
//                         reminderTime.getHours() === hour && reminderTime.getMinutes() === 0;
//                       const label = new Date(2026, 0, 1, hour).toLocaleTimeString('ko-KR', {
//                         hour: 'numeric',
//                       });

//                       return (
//                         <Pressable
//                           key={hour}
//                           onPress={() => handleSelectPresetTime(hour)}
//                           className={`rounded-full border px-3 py-2 ${
//                             isSelected
//                               ? isDark
//                                 ? 'border-white bg-white'
//                                 : 'border-[#222631] bg-[#222631]'
//                               : isDark
//                                 ? 'border-[#343434] bg-[#242424]'
//                                 : 'border-[#E4E4E4] bg-white'
//                           }`}>
//                           <Text
//                             className={`text-[12px] font-medium ${
//                               isSelected
//                                 ? isDark
//                                   ? 'text-black'
//                                   : 'text-white'
//                                 : isDark
//                                   ? 'text-[#D0D0D0]'
//                                   : 'text-[#555555]'
//                             }`}>
//                             {label}
//                           </Text>
//                         </Pressable>
//                       );
//                     })}

//                     <Pressable
//                       onPress={handleOpenTimePicker}
//                       className={`flex-row items-center gap-1 rounded-full border px-3 py-2 ${
//                         isDark ? 'border-[#343434] bg-[#242424]' : 'border-[#E4E4E4] bg-white'
//                       }`}>
//                       <Ionicons
//                         name="options-outline"
//                         size={13}
//                         color={isDark ? '#D0D0D0' : '#555555'}
//                       />

//                       <Text
//                         className={`text-[12px] font-medium ${
//                           isDark ? 'text-[#D0D0D0]' : 'text-[#555555]'
//                         }`}>
//                         직접 설정
//                       </Text>
//                     </Pressable>
//                   </View>
//                 </View>
//               )}

//               <View className={`my-5 h-px w-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#F1F1F1]'}`} />

//               <View className="flex w-full flex-row items-center justify-between">
//                 <View className="flex flex-row items-center justify-start gap-3">
//                   <Ionicons
//                     name="color-palette-outline"
//                     size={18}
//                     color={isDark ? '#FFFFFF' : '#222631'}
//                   />
//                   <Text
//                     className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
//                     테마
//                   </Text>
//                 </View>
//                 <View
//                   className={`relative flex-row items-center rounded-full border p-[2px] ${isDark ? 'border-[#3A3A3A] bg-[#1A1A1A]' : 'border-[#DCDCDC] bg-[#FCFCFC]'}`}>
//                   <Pressable
//                     onPress={() => handleChangeTheme('system')}
//                     className="relative h-[24px] w-[48px] items-center justify-center rounded-full">
//                     {themeMode === 'system' && (
//                       <Animated.View
//                         pointerEvents="none"
//                         className="absolute inset-0 rounded-full"
//                         style={{
//                           opacity: themeFadeOpacity,
//                           backgroundColor: isDark ? '#333333' : '#FFFFFF',
//                           shadowColor: '#000000',
//                           shadowOpacity: 0.07,
//                           shadowRadius: 4,
//                           shadowOffset: { width: 0, height: 2 },
//                           elevation: 1,
//                         }}
//                       />
//                     )}
//                     <Text
//                       className="text-[12px] font-medium"
//                       style={{
//                         color:
//                           themeMode === 'system'
//                             ? isDark
//                               ? '#FFFFFF'
//                               : '#3A3A3A'
//                             : isDark
//                               ? '#555555'
//                               : '#B0B0B0',
//                       }}>
//                       시스템
//                     </Text>
//                   </Pressable>

//                   <Pressable
//                     onPress={() => handleChangeTheme('light')}
//                     className="relative h-[24px] w-[28px] items-center justify-center rounded-full">
//                     {themeMode === 'light' && (
//                       <Animated.View
//                         pointerEvents="none"
//                         className="absolute inset-0 rounded-full"
//                         style={{
//                           opacity: themeFadeOpacity,
//                           backgroundColor: isDark ? '#333333' : '#FFFFFF',
//                           shadowColor: '#000000',
//                           shadowOpacity: 0.07,
//                           shadowRadius: 4,
//                           shadowOffset: { width: 0, height: 2 },
//                           elevation: 1,
//                         }}
//                       />
//                     )}
//                     <Ionicons
//                       name="sunny-outline"
//                       size={14}
//                       color={
//                         themeMode === 'light'
//                           ? isDark
//                             ? '#FFFFFF'
//                             : '#111111'
//                           : isDark
//                             ? '#555555'
//                             : '#C8C8C8'
//                       }
//                     />
//                   </Pressable>

//                   <Pressable
//                     onPress={() => handleChangeTheme('dark')}
//                     className="relative h-[24px] w-[28px] items-center justify-center rounded-full">
//                     {themeMode === 'dark' && (
//                       <Animated.View
//                         pointerEvents="none"
//                         className="absolute inset-0 rounded-full"
//                         style={{
//                           opacity: themeFadeOpacity,
//                           backgroundColor: isDark ? '#333333' : '#FFFFFF',
//                           shadowColor: '#000000',
//                           shadowOpacity: 0.07,
//                           shadowRadius: 4,
//                           shadowOffset: { width: 0, height: 2 },
//                           elevation: 1,
//                         }}
//                       />
//                     )}
//                     <Ionicons
//                       name="moon-outline"
//                       size={14}
//                       color={
//                         themeMode === 'dark'
//                           ? isDark
//                             ? '#FFFFFF'
//                             : '#111111'
//                           : isDark
//                             ? '#555555'
//                             : '#C8C8C8'
//                       }
//                     />
//                   </Pressable>
//                 </View>
//               </View>
//             </View>
//           )}
//           {props.title === '계정' && (
//             <View className="flex flex-col items-center justify-start gap-2 ">
//               <View className="flex w-full flex-row items-center justify-between">
//                 <View className="flex flex-row items-center justify-start gap-3">
//                   <Ionicons
//                     name="person-outline"
//                     size={18}
//                     color={isDark ? '#FFFFFF' : '#222631'}
//                   />
//                   <Text
//                     className={`text-[15px] font-medium ${isDark ? 'text-[#989898]' : 'text-[#989898]'}`}>
//                     백업 및 동기화 (개발 중이에요)
//                   </Text>
//                 </View>
//                 {/*로그아웃*/}
//               </View>
//             </View>
//           )}
//           {props.title === '피드백' && (
//             <View className="flex flex-col items-center justify-start gap-2 ">
//               <View className="flex w-full flex-row items-center justify-between">
//                 <View className="flex flex-row items-center justify-start gap-3">
//                   <Ionicons
//                     name="chatbubble-ellipses-outline"
//                     size={18}
//                     color={isDark ? '#FFFFFF' : '#222631'}
//                   />
//                   <Text
//                     className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
//                     피드백 보내기
//                   </Text>
//                 </View>
//                 <Pressable className="ㅐ h-[18px] items-center justify-center">
//                   <Text className="text-xs text-[#757575]">jseoeun26@gmail.com</Text>
//                 </Pressable>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>
//       <Modal
//         visible={isTimePickerOpen}
//         transparent
//         animationType="fade"
//         statusBarTranslucent
//         onRequestClose={handleCancelTimePicker}>
//         <View className="flex-1 justify-end bg-black/40">
//           {/* 어두운 배경을 누르면 취소 */}
//           <Pressable className="flex-1" onPress={handleCancelTimePicker} />

//           <View
//             className={`rounded-t-[28px] px-6 pb-10 pt-4 ${isDark ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
//             {/* 상단 손잡이 */}
//             <View className="mb-2 h-1 w-10 self-center rounded-full bg-[#C8C8C8]" />

//             {/* 모달 헤더 */}
//             <View className="flex-row items-center justify-between py-3">
//               <Pressable onPress={handleCancelTimePicker} hitSlop={10}>
//                 <Text className="text-[15px] font-medium text-[#8A8A8A]">취소</Text>
//               </Pressable>

//               <Text
//                 className={`text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#222631]'}`}>
//                 알림 시간 설정
//               </Text>

//               <Pressable onPress={handleConfirmTimePicker} hitSlop={10}>
//                 <Text
//                   className={`text-[15px] font-semibold ${
//                     isDark ? 'text-white' : 'text-[#222631]'
//                   }`}>
//                   완료
//                 </Text>
//               </Pressable>
//             </View>

//             <DateTimePicker
//               value={draftReminderTime}
//               mode="time"
//               display="spinner"
//               minuteInterval={5}
//               themeVariant={isDark ? 'dark' : 'light'}
//               onChange={(_, selectedTime) => {
//                 if (selectedTime) {
//                   setDraftReminderTime(selectedTime);
//                 }
//               }}
//               style={{
//                 alignSelf: 'center',
//                 width: '100%',
//               }}
//             />
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReminderSettingsSection } from '@/components/ReminderSettingsSection';
import { ThemeSettingsSection } from '@/components/ThemeSettingsSection';
import { useTheme } from '@/hooks/useTheme';

type SettingSectionProps = {
  title: string;
  function?: [];
};

export default function SettingSection(props: SettingSectionProps) {
  const { isDark } = useTheme();

  return (
    <View className="flex flex-col items-start justify-center gap-3 px-10 pt-10">
      <Text className="text-[13px] font-medium text-[#7C7C7C]">{props.title}</Text>

      <View
        className={`w-full rounded-[18px] border px-7 py-6 ${
          isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-[#F1F1F1] bg-white'
        }`}>
        {props.title === '일반' && (
          <View className="flex flex-col items-center justify-start gap-1">
            <ReminderSettingsSection />

            <View className={`my-5 h-px w-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#F1F1F1]'}`} />

            <ThemeSettingsSection />
          </View>
        )}

        {props.title === '계정' && (
          <View className="flex flex-col items-center justify-start gap-2">
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons name="person-outline" size={18} color={isDark ? '#FFFFFF' : '#222631'} />

                <Text className="text-[15px] font-medium text-[#989898]">
                  백업 및 동기화 (개발 중이에요)
                </Text>
              </View>
            </View>
          </View>
        )}

        {props.title === '피드백' && (
          <View className="flex flex-col items-center justify-start gap-2">
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={isDark ? '#FFFFFF' : '#222631'}
                />

                <Text
                  className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
                  피드백 보내기
                </Text>
              </View>

              <Pressable className="h-[18px] items-center justify-center">
                <Text className="text-xs text-[#757575]">jseoeun26@gmail.com</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
