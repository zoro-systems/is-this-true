// Screenshot service for Is This True? app

import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === 'granted';
}

export async function requestScreenshotPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const { status } = await ScreenCapture.requestPermissionsAsync();
    return status === 'granted';
  } else {
    // Android - use MediaLibrary for screenshots
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }
}

export async function requestOverlayPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  // Android 11+ requires manual settings for overlay
  // Check if already granted
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW
  );
  
  if (hasPermission) {
    return true;
  }

  try {
    // This will NOT work on Android 6+ - it always returns denied
    // The user MUST enable it manually in settings
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW,
      {
        title: 'Display Over Other Apps',
        message: 'This app needs permission to display over other apps to show the capture button.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'Open Settings',
      }
    );
    
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    
    // If denied, guide user to settings
    Alert.alert(
      'Permission Required',
      'To display the capture button over other apps, please enable "Display over other apps" in Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  } catch (err) {
    console.warn('Overlay permission error:', err);
    return false;
  }
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

export async function takeScreenshot(): Promise<string | null> {
  try {
    const hasPermission = await ScreenCapture.hasPermissionsAsync();
    if (!hasPermission) {
      const permission = await ScreenCapture.requestPermissionsAsync();
      if (!permission.granted) {
        console.log('Screen capture permission denied');
        return null;
      }
    }

    const uri = await ScreenCapture.captureScreenAsync({
      format: 'png',
      quality: 0.8,
    });

    return uri.uri;
  } catch (error) {
    console.error('Screenshot error:', error);
    return null;
  }
}

export async function captureViaPicker(): Promise<string | null> {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      return result.assets[0].base64;
    }
    return null;
  } catch (error) {
    console.error('Image picker error:', error);
    return null;
  }
}
