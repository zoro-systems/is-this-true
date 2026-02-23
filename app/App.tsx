// Main App - Is This True?

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
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
import { takeScreenshot } from './services/screenshot';
import { colors } from './constants/theme';

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
      // Take screenshot
      const screenshotUri = await takeScreenshot();

      if (!screenshotUri) {
        // Fallback or error
        console.log('Screenshot failed, using mock');
      }

      // For demo, use mock (replace with actual API call)
      const response = await analyzeImageMock('');

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
            {/* Main app content - could show instructions */}
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
});
