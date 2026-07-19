import { View, Text } from 'react-native';

type SettingSectionProps = {
  title: string;
  function?: [];
};

export default function SettingSection(props: SettingSectionProps) {
  return (
    <View className="flex flex-col items-start justify-center gap-3 px-10 pt-10">
      <Text className="text-[13px] font-medium text-[#5C9BC8]">{props.title}</Text>
      <View className="h-[46px] w-full rounded-[10px] bg-white"></View>
    </View>
  );
}
