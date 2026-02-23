// Permissions Screen - Request and display permission status

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import {
  requestCameraPermission,
  requestScreenshotPermission,
  requestOverlayPermission,
  requestMediaLibraryPermission,
} from '../services/screenshot';

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
      granted: false,
      required: true,
    },
    {
      id: 'screenshot',
      name: 'Screenshot Access',
      description: 'Capture screenshots for analysis',
      icon: '📸',
      granted: false,
      required: true,
    },
    {
      id: 'media',
      name: 'Photo Library',
      description: 'Save and access photos',
      icon: '🖼️',
      granted: false,
      required: false,
    },
  ]);

  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check all permissions on mount
    const cameraGranted = await requestCameraPermission();
    const screenshotGranted = await requestScreenshotPermission();
    const mediaGranted = await requestMediaLibraryPermission();
    
    updatePermission('camera', cameraGranted);
    updatePermission('screenshot', screenshotGranted);
    updatePermission('media', mediaGranted);
  };

  const requestPermission = async (permissionId: string) => {
    setLoading(permissionId);

    try {
      switch (permissionId) {
        case 'camera':
          const cameraGranted = await requestCameraPermission();
          updatePermission('camera', cameraGranted);
          if (!cameraGranted) {
            Alert.alert(
              'Camera Permission',
              'Camera access is needed to take photos for analysis.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          }
          break;

        case 'screenshot':
          const screenshotGranted = await requestScreenshotPermission();
          updatePermission('screenshot', screenshotGranted);
          if (!screenshotGranted) {
            Alert.alert(
              'Permission Required',
              'Screenshot access is needed to capture your screen.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          }
          break;

        case 'media':
          const mediaGranted = await requestMediaLibraryPermission();
          updatePermission('media', mediaGranted);
          break;
      }
    } catch (error) {
      console.error('Permission error:', error);
    } finally {
      setLoading(null);
    }
  };

  const updatePermission = (id: string, granted: boolean) => {
    setPermissions(prev =>
      prev.map(p => (p.id === id ? { ...p, granted } : p))
    );
  };

  const requiredPermissionsGranted = permissions
    .filter(p => p.required)
    .every(p => p.granted);

  const allPermissionsGranted = permissions.every(p => p.granted);

  const handleContinue = () => {
    if (requiredPermissionsGranted) {
      onComplete();
    } else {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and screenshot permissions to use this app.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📸 Is This True?</Text>
          <Text style={styles.subtitle}>
            We need a few permissions to analyze images
          </Text>
        </View>

        <View style={styles.permissionList}>
          {permissions.map(permission => (
            <View key={permission.id} style={styles.permissionCard}>
              <View style={styles.permissionIcon}>
                <Text style={styles.iconText}>{permission.icon}</Text>
              </View>
              <View style={styles.permissionInfo}>
                <View style={styles.permissionHeader}>
                  <Text style={styles.permissionName}>{permission.name}</Text>
                  {permission.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.permissionDesc}>
                  {permission.description}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.permissionButton,
                  permission.granted && styles.permissionButtonGranted,
                  loading === permission.id && styles.permissionButtonLoading,
                ]}
                onPress={() => requestPermission(permission.id)}
                disabled={permission.granted || loading === permission.id}
              >
                <Text
                  style={[
                    styles.permissionButtonText,
                    permission.granted && styles.permissionButtonTextGranted,
                  ]}
                >
                  {loading === permission.id
                    ? '...'
                    : permission.granted
                    ? '✓ Allowed'
                    : 'Allow'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              allPermissionsGranted ? styles.statusGranted : styles.statusPending,
            ]}
          >
            <Text style={styles.statusText}>
              {allPermissionsGranted
                ? '✅ All Permissions Granted!'
                : requiredPermissionsGranted
                ? '✅ Core Features Ready'
                : '⚠️ Permissions Needed'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            !requiredPermissionsGranted && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!requiredPermissionsGranted}
        >
          <Text style={styles.buttonText}>
            {allPermissionsGranted ? 'Start Using App' : 'Continue'}
          </Text>
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
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionName: {
    ...typography.subtitle,
    color: colors.text,
  },
  requiredBadge: {
    backgroundColor: colors.warning + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  requiredText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: '600',
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
  permissionButtonLoading: {
    backgroundColor: colors.textSecondary,
  },
  permissionButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  permissionButtonTextGranted: {
    color: colors.text,
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
  statusPending: {
    backgroundColor: colors.warning + '30',
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
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
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
