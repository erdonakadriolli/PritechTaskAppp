import { Platform, ViewStyle } from 'react-native';

export const colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#EEF2F6',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primarySoft: '#EEF2FF',
  success: '#10B981',
  successSoft: '#D1FAE5',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.4 },
};

export const shadow: { sm: ViewStyle; md: ViewStyle; lg: ViewStyle } = {
  sm: Platform.select({
    web: { boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)' } as unknown as ViewStyle,
    default: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
      elevation: 2,
    },
  }) as ViewStyle,
  md: Platform.select({
    web: { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' } as unknown as ViewStyle,
    default: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 4,
    },
  }) as ViewStyle,
  lg: Platform.select({
    web: { boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)' } as unknown as ViewStyle,
    default: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 24,
      elevation: 10,
    },
  }) as ViewStyle,
};
