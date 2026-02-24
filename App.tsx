// Main App - Is This True?

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert,
  AppState,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import OverlayButton from './components/OverlayButton';
import ResultPopup from './components/ResultPopup';
import { analyzeImageMock } from './services/api';
import { captureImage } from './services/screenshot';
import { colors, spacing, typography, borderRadius, shadows } from './constants/theme';

type AppState = 'home' | 'permissions' | 'active';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [showOverlay, setShowOverlay] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    claim: string;
    percentage: number;
    summary: string;
    sources: string[];
  } | null>(null);

  // Track app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    // Show overlay when app goes to background (other apps are visible)
    if (nextAppState === 'background' && appState === 'active') {
      setShowOverlay(true);
    }
  };

  const handleGetStarted = () => {
    setAppState('permissions');
  };

  const handlePermissionsComplete = () => {
    setAppState('active');
    // Request to show overlay (requires additional permissions on Android)
    requestOverlayService();
  };

  const requestOverlayService = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if we already have overlay permission
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW
        );

        if (!hasPermission) {
          // Request the permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW,
            {
              title: 'Enable Overlay',
              message:
                'Enable "Display over other apps" to show the IS THIS TRUE button on your screen.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Success!',
              'The "IS THIS TRUE" button will now appear on your screen when you use other apps.'
            );
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleOverlayPress = async () => {
    setShowOverlay(false);
    setLoading(true);
    setShowResult(true);

    try {
      // Get image from camera or gallery
      const imageBase64 = await captureImage();

      if (!imageBase64) {
        // User cancelled
        setShowResult(false);
        return;
      }

      // For demo, use mock (replace with actual API call)
      const response = await analyzeImageMock(imageBase64);

      if (response.success && response.result) {
        setResult(response.result);
      } else {
        setResult({
          claim: 'Unable to analyze',
          percentage: 0,
          summary: response.error || 'Something went wrong. Please try again.',
          sources: [],
        });
      }
    } catch (error) {
      setResult({
        claim: 'Error',
        percentage: 0,
        summary: 'Failed to analyze image. Please try again.',
        sources: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />

        {appState === 'home' && <HomeScreen onGetStarted={handleGetStarted} />}

        {appState === 'permissions' && (
          <PermissionsScreen onComplete={handlePermissionsComplete} />
        )}

        {appState === 'active' && (
          <View style={styles.activeContainer}>
            <View style={styles.activeContent}>
              <Text style={styles.activeTitle}>📸 Is This True?</Text>
              <Text style={styles.activeSubtitle}>
                Tap the button below to capture or select an image
              </Text>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleOverlayPress}
              >
                <Text style={styles.captureButtonText}>📷 Capture Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Overlay Button - appears on top of everything */}
        <OverlayButton
          onPress={handleOverlayPress}
          visible={showOverlay && appState === 'active'}
        />

        {/* Result Popup */}
        <ResultPopup
          visible={showResult}
          claim={result?.claim || ''}
          percentage={result?.percentage || 0}
          summary={result?.summary || ''}
          sources={result?.sources || []}
          loading={loading}
          onClose={handleCloseResult}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  activeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  activeTitle: {
    ...typography.heading,
    color: colors.text,
    fontSize: 28,
    marginBottom: spacing.md,
  },
  activeSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  captureButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.large,
  },
  captureButtonText: {
    ...typography.title,
    color: colors.text,
  },
});
