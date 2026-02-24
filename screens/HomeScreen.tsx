// Home Screen - Welcome and Get Started

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

interface HomeScreenProps {
  onGetStarted: () => void;
}

export default function HomeScreen({ onGetStarted }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>?</Text>
          </View>
          <Text style={styles.title}>Is This True?</Text>
          <Text style={styles.subtitle}>Fact-check anything in seconds</Text>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📸</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Capture Screen</Text>
              <Text style={styles.featureDesc}>
                Take a screenshot of any news, posts, or claims you see
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🔍</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Analysis</Text>
              <Text style={styles.featureDesc}>
                Our system searches the web to verify the claim
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📊</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Get Results</Text>
              <Text style={styles.featureDesc}>
                See a truth percentage and summary instantly
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Tap the camera button to take a photo or select from gallery
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Our AI analyzes the image to check if it's true
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Get instant truth percentage results!
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This app requires accessibility permissions to work.{'\n'}
          We never collect or store your personal data.
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
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  logoText: {
    fontSize: 48,
    color: colors.text,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  featureList: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  featureDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  howItWorks: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  stepText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
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
  disclaimer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 20,
  },
});
