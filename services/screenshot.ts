// Screenshot service for Is This True? app
// Uses ImagePicker for everything - handles permissions automatically

import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';

// These return true - permissions are requested when actually needed
export async function requestCameraPermission(): Promise<boolean> {
  return true;
}

export async function requestScreenshotPermission(): Promise<boolean> {
  return true;
}

export async function requestOverlayPermission(): Promise<boolean> {
  return true;
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  return true;
}

// Main function to get an image - tries camera first, then gallery
export async function captureImage(): Promise<string | null> {
  try {
    // Check and request camera permission
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert(
        'Camera Permission Needed',
        'Please allow camera access to take photos.',
        [{ text: 'OK' }]
      );
      return null;
    }

    // Try camera first
    const cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!cameraResult.canceled && cameraResult.assets[0].base64) {
      return cameraResult.assets[0].base64;
    }

    // If camera cancelled or failed, try gallery
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (libraryPermission.status !== 'granted') {
      Alert.alert(
        'Photo Library Permission Needed',
        'Please allow access to select photos.',
        [{ text: 'OK' }]
 );
      return null;
    }

    const libraryResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!libraryResult.canceled && libraryResult.assets[0].base64) {
      return libraryResult.assets[0].base64;
    }

    return null;
  } catch (error) {
    console.error('Image capture error:', error);
    return null;
  }
}

// Legacy function names for compatibility
export async function takeScreenshot(): Promise<string | null> {
  return captureImage();
}

export async function captureViaPicker(): Promise<string | null> {
  return captureImage();
}
