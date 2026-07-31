import { Platform } from 'react-native';
import * as ExpoHaptics from 'expo-haptics';

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';

export const ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;

async function performAndroidAsync(type: ExpoHaptics.AndroidHaptics) {
  try {
    await ExpoHaptics.performAndroidHapticsAsync(type);
    return;
  } catch {
    // Fall back for devices/ROMs where Android haptics constants are unavailable.
  }

  try {
    await ExpoHaptics.selectionAsync();
  } catch {
    // Final fallback intentionally ignored.
  }
}

export async function selectionAsync() {
  if (IS_IOS) {
    return ExpoHaptics.selectionAsync();
  }

  if (!IS_ANDROID) {
    return;
  }

  // Use a soft but consistently supported click-style effect.
  return performAndroidAsync(ExpoHaptics.AndroidHaptics.Context_Click);
}

export async function impactAsync(style: ExpoHaptics.ImpactFeedbackStyle) {
  if (IS_IOS) {
    return ExpoHaptics.impactAsync(style);
  }

  if (!IS_ANDROID) {
    return;
  }

  if (style === ExpoHaptics.ImpactFeedbackStyle.Heavy) {
    return performAndroidAsync(ExpoHaptics.AndroidHaptics.Long_Press);
  }

  if (style === ExpoHaptics.ImpactFeedbackStyle.Medium) {
    return performAndroidAsync(ExpoHaptics.AndroidHaptics.Segment_Tick);
  }

  return performAndroidAsync(ExpoHaptics.AndroidHaptics.Context_Click);
}

export async function notificationAsync(type: ExpoHaptics.NotificationFeedbackType) {
  if (IS_IOS) {
    return ExpoHaptics.notificationAsync(type);
  }

  if (!IS_ANDROID) {
    return;
  }

  if (type === ExpoHaptics.NotificationFeedbackType.Success) {
    return performAndroidAsync(ExpoHaptics.AndroidHaptics.Confirm);
  }

  if (type === ExpoHaptics.NotificationFeedbackType.Warning) {
    return performAndroidAsync(ExpoHaptics.AndroidHaptics.Context_Click);
  }

  return performAndroidAsync(ExpoHaptics.AndroidHaptics.Reject);
}
