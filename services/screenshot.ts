// Screenshot service for Is This True? app

import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';

export async function requestScreenshotPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const { status } = await ScreenCapture.requestPermissionsAsync();
    return status === 'granted';
  } else {
    // Android
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Screenshot Permission',
          message: 'This app needs access to take screenshots for analysis.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}

export async function requestOverlayPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW,
      {
        title: 'Overlay Permission',
        message: 'This app needs permission to display over other apps.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

export async function takeScreenshot(): Promise<string | null> {
  try {
    // Check if screen capture is available
    const hasPermission = await ScreenCapture.hasPermissionsAsync();
    if (!hasPermission) {
      const permission = await ScreenCapture.requestPermissionsAsync();
      if (!permission.granted) {
        console.log('Screen capture permission denied');
        return null;
      }
    }

    // Take screenshot
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

// Fallback: Use image picker to capture
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
