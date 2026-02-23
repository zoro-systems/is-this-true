// Result Popup - Shows analysis results

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ResultPopupProps {
  visible: boolean;
  claim: string;
  percentage: number;
  summary: string;
  sources: string[];
  loading: boolean;
  error?: string;
  onClose: () => void;
}

export default function ResultPopup({
  visible,
  claim,
  percentage,
  summary,
  sources,
  loading,
  error,
  onClose,
}: ResultPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const getPercentageColor = () => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 50) return colors.warning;
    return colors.error;
  };

  const getPercentageLabel = () => {
    if (percentage >= 80) return 'Likely True';
    if (percentage >= 50) return 'Uncertain';
    return 'Likely False';
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingSpinner}>
                <Text style={styles.loadingEmoji}>🔍</Text>
              </View>
              <Text style={styles.loadingText}>Analyzing...</Text>
              <Text style={styles.loadingSubtext}>
                Searching the web for truth
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorEmoji}>😕</Text>
              <Text style={styles.errorTitle}>Oops!</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.button} onPress={handleClose}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <View
                  style={[
                    styles.percentageCircle,
                    { borderColor: getPercentageColor() },
                  ]}
                >
                  <Text
                    style={[styles.percentageText, { color: getPercentageColor() }]}
                  >
                    {percentage}%
                  </Text>
                </View>
                <Text style={styles.claimText}>{claim}</Text>
              </View>

              <View style={styles.resultBadge}>
                <Text
                  style={[styles.resultLabel, { color: getPercentageColor() }]}
                >
                  {getPercentageLabel()}
                </Text>
              </View>

              <Text style={styles.summaryText}>{summary}</Text>

              {sources.length > 0 && (
                <View style={styles.sourcesContainer}>
                  <Text style={styles.sourcesTitle}>Sources:</Text>
                  {sources.map((source, index) => (
                    <Text key={index} style={styles.sourceText}>
                      • {source}
                    </Text>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.button} onPress={handleClose}>
                <Text style={styles.buttonText}>Got it!</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: SCREEN_WIDTH - spacing.lg * 2,
    maxWidth: 400,
    alignItems: 'center',
    ...shadows.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  percentageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  claimText: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  resultBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  resultLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  sourcesContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  sourcesTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sourceText: {
    ...typography.caption,
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.subtitle,
    color: colors.text,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loadingEmoji: {
    fontSize: 36,
  },
  loadingText: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  loadingSubtext: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
