export const colors = {
  primary: '#2196F3',
  secondary: '#03A9F4',
  success: '#4CAF50',
  profit: '#4CAF50',
  danger: '#F44336',
  loss: '#F44336',
  warning: '#FF9800',
  info: '#00BCD4',
  
  // Light theme
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    card: '#FFFFFF',
  },
  
  // Dark theme
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#BDBDBD',
    border: '#424242',
    card: '#1E1E1E',
  },
};

export const lightColors = {
  ...colors,
  background: colors.light.background,
  surface: colors.light.surface,
  text: colors.light.text,
  textSecondary: colors.light.textSecondary,
  border: colors.light.border,
  card: colors.light.card,
};

export const darkColors = {
  ...colors,
  background: colors.dark.background,
  surface: colors.dark.surface,
  text: colors.dark.text,
  textSecondary: colors.dark.textSecondary,
  border: colors.dark.border,
  card: colors.dark.card,
};
