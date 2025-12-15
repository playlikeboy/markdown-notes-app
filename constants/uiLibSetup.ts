import { Colors, Typography, Spacings } from 'react-native-ui-lib';

// Define the Wordsy Palette
Colors.loadColors({
  primary: '#000000',
  secondary: '#545454',
  accent: '#000000', // Buttons
  background: '#FFFFFF',
  secondaryBackground: '#F6F6F6',
  cardBlue: '#4CD2F0',
  cardGray: '#F6F6F6',
  headerBlue: '#A3E4F5',
  danger: '#E11900',
  white: '#FFFFFF',
  border: '#E2E2E2',
  transparent: 'transparent',
});

// Define Wordsy Typography
Typography.loadTypographies({
  header: { fontSize: 32, fontWeight: '600', color: Colors.primary, letterSpacing: -0.5 },
  subHeader: { fontSize: 20, fontWeight: '500', color: Colors.primary },
  body: { fontSize: 16, lineHeight: 24, color: Colors.primary },
  label: { fontSize: 14, fontWeight: '500', color: Colors.secondary },
});

// Define Spacings
Spacings.loadSpacings({
  ws: 4,
  wm: 16,
  wl: 24,
  wxl: 32,
});
