// Permissions Screen - Request and display permission status

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: string;
  granted: boolean;
  required: boolean;
}

interface PermissionsScreenProps {
  onComplete: () => void;
}

export default function PermissionsScreen({ onComplete }: PermissionsScreenProps) {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'camera',
      name: 'Camera',
      description: 'Take photos to analyze',
      icon: '📷',
      granted: true, // Default to granted - will request when taking photo
      required: false,
    },
    {
      id: 'photos',
      name: 'Photo Library',
      description: 'Select photos to analyze',
      icon: '🖼️',
      granted: true, // Default to granted - will request when selecting
      required: false,
    },
  ]);

  const [loading, setLoading] = useState<string | null>(null);

  const requiredPermissionsGranted = permissions
    .filter(p => p.required)
    .every(p => p.granted);

  const handleContinue = () => {
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📸 Is This True?</Text>
          <Text style={styles.subtitle}>
            Analyze any image to check if it's true
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This app works like a magic lens - just tap the camera button to take a photo or select one from your gallery, and we'll analyze it for you!
          </Text>
        </View>

        <View style={styles.permissionList}>
          {permissions.map(permission => (
            <View key={permission.id} style={styles.permissionCard}>
              <View style={styles.permissionIcon}>
                <Text style={styles.iconText}>{permission.icon}</Text>
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionName}>{permission.name}</Text>
                <Text style={styles.permissionDesc}>
                  {permission.description}
                </Text>
              </View>
              <View style={[styles.permissionButton, styles.permissionButtonGranted]}>
                <Text style={styles.permissionButtonText}>✓ Ready</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, styles.statusGranted]}>
            <Text style={styles.statusText}>✅ Ready to Use!</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Start Using App</Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>
          🔒 Your photos stay on your device. We never upload or share them.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    fontSize: 28,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionList: {
    marginBottom: spacing.xl,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  permissionInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  permissionName: {
    ...typography.subtitle,
    color: colors.text,
  },
  permissionDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  permissionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    minWidth: 70,
    alignItems: 'center',
  },
  permissionButtonGranted: {
    backgroundColor: colors.success,
  },
  permissionButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusGranted: {
    backgroundColor: colors.success + '30',
  },
  statusText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  buttonText: {
    ...typography.subtitle,
    color: colors.text,
  },
  privacyNote: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 20,
  },
});
