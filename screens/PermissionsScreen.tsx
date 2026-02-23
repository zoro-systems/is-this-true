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
      id: 'overlay',
      name: 'Display Over Apps',
      description: 'Show the IS THIS TRUE button on top of other apps',
      icon: '🔘',
      granted: false,
      required: true,
    },
    {
      id: 'screenshot',
      name: 'Take Screenshots',
      description: 'Capture the current screen for analysis',
      icon: '📸',
      granted: false,
      required: true,
    },
    {
      id: 'media',
      name: 'Media Access',
      description: 'Save and access screenshots',
      icon: '📁',
      granted: false,
      required: false,
    },
  ]);

  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // In a real app, check actual permission status
    // For now, we'll request them
  };

  const requestPermission = async (permissionId: string) => {
    setLoading(permissionId);

    try {
      switch (permissionId) {
        case 'overlay':
          const overlayGranted = await requestOverlayPermission();
          updatePermission('overlay', overlayGranted);
          if (!overlayGranted) {
            Alert.alert(
              'Overlay Permission Required',
              'Please enable Display Over Apps in your device settings to use this feature.',
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
        'Please grant the required permissions to use this app.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Permissions</Text>
          <Text style={styles.subtitle}>
            We need some permissions to work properly
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
                    ? '✓ Granted'
                    : 'Grant'}
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
                ? 'All Permissions Granted!'
                : requiredPermissionsGranted
                ? 'Core Permissions Ready'
                : 'More Permissions Needed'}
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
          🔒 Your privacy is important. We only analyze images locally and{'\n'}
          never share your personal data.
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
    minWidth: 80,
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
    fontSize: 14,
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
