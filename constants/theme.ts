export const theme = {
  colors: {
    primary: '#000000',
    background: '#FFFFFF',
    secondaryBackground: '#F6F6F6', // Uber light gray
    border: '#E2E2E2', // Subtle borders
    text: '#000000',
    textSecondary: '#545454',
    accent: '#000000', // Buttons are black
    danger: '#E11900',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 4, // Almost square
    m: 8,
    l: 12,
  },
  typography: {
    header: {
      fontSize: 32,
      fontWeight: '600' as '600',
      letterSpacing: -0.5,
      color: '#000000',
    },
    subHeader: {
      fontSize: 20,
      fontWeight: '500' as '500',
      color: '#000000',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: '#000000',
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as '500',
      color: '#545454',
    }
  }
};
