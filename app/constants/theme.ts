// Theme constants for Is This True? app

export const colors = {
  primary: '#6366F1',      // Indigo
  secondary: '#8B5CF6',    // Purple
  accent: '#F59E0B',       // Amber
  background: '#0F172A',   // Dark
  surface: '#1E293B',     // Lighter dark
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  success: '#10B981',      // Green
  warning: '#F59E0B',     // Amber
  error: '#EF4444',        // Red
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  heading: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};
