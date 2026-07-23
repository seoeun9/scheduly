import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SPARKS = [
  { index: 0, color: '#FF7474' },
  { index: 1, color: '#FFB45C' },
  { index: 2, color: '#E8CD47' },
  { index: 3, color: '#55B889' },
  { index: 5, color: '#4AB4FF' },
  { index: 6, color: '#5967C8' },
  { index: 7, color: '#C765F4' },
  { index: 8, color: '#FF82BE' },
];

type RainbowCompleteButtonProps = {
  done: boolean;
  color: string;
  onPress: () => void;
};

export default function RainbowCompleteButton({
  done,
  color,
  onPress,
}: RainbowCompleteButtonProps) {
  const paletteColor = color || '#4AB4FF';

  const sparkProgress = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const checkOpacity = useRef(new Animated.Value(1)).current;

  const mounted = useRef(false);
  const previousDone = useRef(done);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      previousDone.current = done;
      return;
    }

    const becameCompleted = !previousDone.current && done;

    previousDone.current = done;

    buttonScale.stopAnimation();
    checkOpacity.stopAnimation();

    buttonScale.setValue(1);
    checkOpacity.setValue(0.35);

    const buttonAnimation = Animated.parallel([
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.9,
          duration: 70,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),

        Animated.timing(buttonScale, {
          toValue: 1.06,
          duration: 95,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 90,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(checkOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    if (!becameCompleted) {
      sparkProgress.stopAnimation();
      sparkProgress.setValue(0);

      buttonAnimation.start();
      return;
    }

    sparkProgress.stopAnimation();
    sparkProgress.setValue(0);

    Animated.parallel([
      buttonAnimation,

      Animated.timing(sparkProgress, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [done, buttonScale, checkOpacity, sparkProgress]);

  const sparkOpacity = sparkProgress.interpolate({
    inputRange: [0, 0.08, 0.6, 1],
    outputRange: [0, 1, 0.75, 0],
  });

  const sparkScale = sparkProgress.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0.35, 1, 0.65],
  });

  return (
    <View
      style={{
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}>
      <Pressable
        style={({ pressed }) => ({
          width: 34,
          height: 34,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          opacity: pressed ? 0.55 : 1,
        })}
        onPress={(event) => {
          event.stopPropagation();
          onPress();
        }}
        hitSlop={8}>
        <Animated.View
          pointerEvents="none"
          style={{
            width: 54,
            height: 54,

            flexDirection: 'row',
            flexWrap: 'wrap',

            overflow: 'visible',

            transform: [
              {
                scale: buttonScale,
              },
            ],
          }}>
          {Array.from({ length: 9 }, (_, index) => {
            if (index === 4) {
              return (
                <View
                  key="check"
                  style={{
                    width: 18,
                    height: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'visible',
                  }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,

                      alignItems: 'center',
                      justifyContent: 'center',

                      borderColor: done ? paletteColor : '#B7B7B7',

                      overflow: 'visible',
                    }}>
                    <Animated.View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',

                        opacity: checkOpacity,

                        transform: [
                          {
                            translateX: 1,
                          },
                          {
                            translateY: -3,
                          },
                          {
                            rotate: '-8deg',
                          },
                        ],
                      }}>
                      <Ionicons
                        name="checkmark-done"
                        size={28}
                        color={done ? paletteColor : '#B7B7B7'}
                      />
                    </Animated.View>
                  </View>
                </View>
              );
            }

            const spark = SPARKS.find((item) => item.index === index);

            if (!spark) {
              return (
                <View
                  key={index}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
              );
            }

            const column = index % 3;
            const row = Math.floor(index / 3);

            const cellX = column * 18 + 9 - 27;
            const cellY = row * 18 + 9 - 27;

            const length = Math.sqrt(cellX * cellX + cellY * cellY);

            const unitX = cellX / length;
            const unitY = cellY / length;

            const startRadius = 14;
            const endRadius = 25;

            const startX = unitX * startRadius - cellX;
            const startY = unitY * startRadius - cellY;

            const endX = unitX * endRadius - cellX;
            const endY = unitY * endRadius - cellY;

            const angle = (Math.atan2(unitY, unitX) * 180) / Math.PI;

            const translateX = sparkProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [startX, endX],
            });

            const translateY = sparkProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [startY, endY],
            });

            return (
              <View
                key={index}
                style={{
                  width: 18,
                  height: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'visible',
                }}>
                <Animated.View
                  style={{
                    width: 2.5,
                    height: 7,

                    borderRadius: 2,
                    backgroundColor: spark.color,

                    opacity: sparkOpacity,

                    transform: [
                      {
                        translateX,
                      },
                      {
                        translateY,
                      },
                      {
                        rotate: `${angle - 90}deg`,
                      },
                      {
                        scaleY: sparkScale,
                      },
                    ],
                  }}
                />
              </View>
            );
          })}
        </Animated.View>
      </Pressable>
    </View>
  );
}
