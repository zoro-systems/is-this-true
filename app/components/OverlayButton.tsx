// Overlay Button - The sticky "IS THIS TRUE" button

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OverlayButtonProps {
  onPress: () => void;
  visible: boolean;
}

export default function OverlayButton({ onPress, visible }: OverlayButtonProps) {
  const [position] = useState({
    x: SCREEN_WIDTH - 120,
    y: SCREEN_HEIGHT / 2,
  });

  const pan = useRef(new Animated.ValueXY({ x: position.x, y: position.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const scaleAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scaleAnim },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>IS THIS</Text>
        <Text style={styles.buttonTextBold}>TRUE?</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    ...shadows.large,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  buttonText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  buttonTextBold: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
