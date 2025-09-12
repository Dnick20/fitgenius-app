// Custom Primer theme configuration for FitGenius
// Following GitHub Primer Design System guidelines

export const customPrimerTheme = {
  colors: {
    // Custom brand colors while maintaining Primer structure
    brand: {
      primary: '#ff6b35', // FitGenius orange
      secondary: '#e91e63', // FitGenius pink
    },
    // Override some defaults for fitness app feel
    accent: {
      fg: '#ff6b35',
      emphasis: '#e91e63',
    }
  },
  
  space: [
    '0',
    '4px',  // 1
    '8px',  // 2
    '16px', // 3
    '24px', // 4
    '32px', // 5
    '40px', // 6
    '48px', // 7
    '64px', // 8
  ],
  
  fontSizes: [
    '12px', // 0
    '14px', // 1
    '16px', // 2
    '20px', // 3
    '24px', // 4
    '32px', // 5
    '40px', // 6
    '48px', // 7
  ],
  
  // Follow Primer's responsive breakpoints
  breakpoints: ['544px', '768px', '1012px', '1280px'],
};

// Design tokens following Primer guidelines
export const designTokens = {
  // Spacing scale (following Primer's 4px base unit)
  space: {
    xs: '4px',
    sm: '8px', 
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Typography scale
  typography: {
    heading1: { fontSize: '48px', lineHeight: '1.25', fontWeight: '600' },
    heading2: { fontSize: '40px', lineHeight: '1.25', fontWeight: '600' },
    heading3: { fontSize: '32px', lineHeight: '1.25', fontWeight: '600' },
    heading4: { fontSize: '24px', lineHeight: '1.33', fontWeight: '600' },
    heading5: { fontSize: '20px', lineHeight: '1.25', fontWeight: '600' },
    heading6: { fontSize: '16px', lineHeight: '1.25', fontWeight: '600' },
    body: { fontSize: '14px', lineHeight: '1.5', fontWeight: '400' },
    caption: { fontSize: '12px', lineHeight: '1.33', fontWeight: '400' },
  },
  
  // Border radius following Primer patterns
  radii: {
    small: '6px',
    medium: '12px', 
    large: '16px',
  },
  
  // Colors following Primer's semantic naming
  semanticColors: {
    success: '#1f883d',
    warning: '#d1242f', 
    error: '#da3633',
    info: '#0969da',
  }
};