// Screenshot service for Is This True? app

import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

// Camera permission - use ImagePicker as fallback
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('Camera permission error:', error);
    return false;
  }
}

// Screenshot/Media permission - simplified
export async function requestScreenshotPermission(): Promise<boolean> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('Screenshot permission error:', error);
    return false;
  }
}

// No overlay permission needed for this version
export async function requestOverlayPermission(): Promise<boolean> {
  return true;
}

// Media library permission
export async function requestMediaLibraryPermission(): Promise<boolean> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('Media permission error:', error);
    return false;
  }
}

// Take screenshot using screen capture
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

// Fallback: Use image picker to capture/select image
export async function captureViaPicker(): Promise<string | null> {
  try {
    // Try camera first
    const cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!cameraResult.canceled && cameraResult.assets[0].base64) {
      return cameraResult.assets[0].base64;
    }

    // Fallback to image library
    const libraryResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!libraryResult.canceled && libraryResult.assets[0].base64) {
      return libraryResult.assets[0].base64;
    }

    return null;
  } catch (error) {
    console.error('Image picker error:', error);
    return null;
  }
}
