import {DefaultTheme} from 'react-native-paper';
import {lightColors, darkColors} from './colors';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...lightColors,
  },
};

export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    ...darkColors,
  },
};
