import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '@/utils/haptics';

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey: string) {
  if (!dateKey) {
    return new Date();
  }

  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function getMonthCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const blankCount = firstDay === 0 ? 6 : firstDay - 1;
  const lastDate = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: blankCount }, () => null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];
}

type CalendarPickerModalProps = {
  visible: boolean;
  initialDate: string;
  isDark: boolean;
  onCancel: () => void;
  onSave: (dateKey: string) => void;
};

export default function CalendarPickerModal({
  visible,
  initialDate,
  isDark,
  onCancel,
  onSave,
}: CalendarPickerModalProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const today = useMemo(() => new Date(), []);
  const selectedDate = initialDate || toDateKey(today);

  useEffect(() => {
    if (visible) {
      const date = fromDateKey(initialDate);
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [visible, initialDate]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const days = getMonthCalendarDays(year, month);
  const cellWidth = `${(100 / 7).toFixed(4)}%` as unknown as number;

  const textPrimary = isDark ? '#FFFFFF' : '#181A21';

  const handleSelectDate = (dateKey: string) => {
    void Haptics.selectionAsync();
    onSave(dateKey);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.sheetBackdrop} onPress={onCancel}>
        <Pressable
          className={`rounded-t-[28px] px-6 pb-8 pt-5 ${isDark ? 'bg-[#111111]' : 'bg-white'}`}
          style={styles.calendarSheet}
          onPress={(event) => event.stopPropagation()}>
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable
              className={`h-9 w-9 items-center justify-center rounded-full ${
                isDark ? 'bg-[#242424]' : 'bg-[#F4F4F4]'
              }`}
              onPress={() => setVisibleMonth(new Date(year, month - 1, 1))}>
              <Ionicons name="chevron-back" size={18} color={isDark ? '#FFFFFF' : textPrimary} />
            </Pressable>

            <Text
              className={`text-[17px] font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              {year}년 {month + 1}월
            </Text>

            <Pressable
              className={`h-9 w-9 items-center justify-center rounded-full ${
                isDark ? 'bg-[#242424]' : 'bg-[#F4F4F4]'
              }`}
              onPress={() => setVisibleMonth(new Date(year, month + 1, 1))}>
              <Ionicons name="chevron-forward" size={18} color={isDark ? '#FFFFFF' : textPrimary} />
            </Pressable>
          </View>

          <View className="mb-2 flex-row">
            {WEEK_DAYS.map((day) => (
              <View key={day} style={{ width: cellWidth as number, alignItems: 'center' }}>
                <Text className="text-xs font-medium text-[#A5A5A5]">{day}</Text>
              </View>
            ))}
          </View>

          <View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {days.map((day, index) => {
                if (day === null) {
                  return <View key={`blank-${index}`} style={{ width: cellWidth, height: 50 }} />;
                }

                const dateKey = toDateKey(new Date(year, month, day));
                const isSelected = selectedDate === dateKey;
                const isToday = toDateKey(today) === dateKey;

                return (
                  <Pressable
                    key={dateKey}
                    style={{
                      width: cellWidth,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => handleSelectDate(dateKey)}>
                    <View
                      style={[
                        {
                          width: 37,
                          height: 37,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 18.5,
                        },
                        isSelected
                          ? { backgroundColor: isDark ? '#DDDDDD' : '#111111' }
                          : undefined,
                        isToday && !isSelected
                          ? { borderWidth: 1, borderColor: isDark ? '#DDDDDD' : '#111111' }
                          : undefined,
                      ]}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isSelected ? '700' : '500',
                          color: isSelected
                            ? isDark
                              ? '#000000'
                              : '#FFFFFF'
                            : isDark
                              ? '#CCCCCC'
                              : '#454545',
                        }}>
                        {day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            className={`mt-5 h-12 items-center justify-center rounded-full ${
              isDark ? 'bg-white' : 'bg-black'
            }`}
            onPress={onCancel}>
            <Text className={`text-sm font-semibold ${isDark ? 'text-black' : 'text-white'}`}>
              닫기
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },

  calendarSheet: {
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    elevation: 12,
  },
});
