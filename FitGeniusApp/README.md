# FitGenius Grocery App

Smart grocery planning with AI-powered price comparison across Walmart, Kroger, and Whole Foods. Create 7-day meal plans and get the best deals on your weekly groceries.

## Features

- 📱 **Cross-Platform**: iOS, Android, and Web support
- 🛒 **Smart Grocery Lists**: Auto-generated from 7-day meal plans
- 💰 **Price Comparison**: Real-time pricing from major grocery chains
- 🏪 **Store Selection**: Find the best deals or shop by preferred store
- 🍽️ **Meal Planning**: Pre-built weekly meal plans for different household sizes
- 📍 **Location-Based**: Zipcode-based regional pricing
- ✅ **Interactive Lists**: Check off items as you shop

## Technology Stack

- **Framework**: React Native with Expo
- **Cross-Platform**: iOS, Android, Web
- **State Management**: React Hooks
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons
- **Build System**: EAS Build
- **AI Intelligence**: GroceryIntelligenceBot

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- For iOS: Xcode (Mac only)
- For Android: Android Studio

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fitgenius/grocery-app.git
cd grocery-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Platform-Specific Development

#### Web Development
```bash
npm run web
```

#### iOS Development
```bash
npm run ios
```

#### Android Development
```bash
npm run android
```

## Building for Production

### Prerequisites for App Store Deployment

1. **Apple Developer Account**: Required for iOS App Store
2. **Google Play Console Account**: Required for Android Play Store
3. **EAS CLI**: Install with `npm install -g @expo/eas-cli`

### iOS App Store Build

1. Configure your Apple Developer account in `eas.json`
2. Build the iOS app:
```bash
npm run build:ios
```

3. Submit to App Store:
```bash
npm run submit:ios
```

### Android Play Store Build

1. Configure your Google Play Console credentials
2. Build the Android app:
```bash
npm run build:android
```

3. Submit to Play Store:
```bash
npm run submit:android
```

### Web Deployment

Build for web hosting:
```bash
npm run build:web
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

## App Store Configuration

### iOS Configuration

- **Bundle Identifier**: `com.fitgenius.grocery`
- **App Name**: FitGenius Grocery
- **Category**: Food & Drink / Lifestyle
- **Target Audience**: 4+ (General Audience)

### App Store Description

**Short Description**:
Smart grocery planning with AI price comparison

**Full Description**:
Transform your grocery shopping with FitGenius Grocery! Our AI-powered app creates personalized 7-day meal plans and automatically generates smart shopping lists with real-time price comparisons across Walmart, Kroger, and Whole Foods.

**Key Features:**
• 📋 Auto-generated grocery lists from meal plans
• 💰 Real-time price comparison across major stores
• 🍽️ Pre-built healthy meal plans for any household size
• 📍 Location-based regional pricing
• ✅ Interactive shopping lists with check-off functionality
• 🏪 Find the cheapest options or shop by preferred store

Save time and money on every grocery trip with intelligent meal planning and price optimization. Perfect for families, couples, or individuals looking to eat well while staying on budget.

### App Store Keywords

grocery, meal planning, price comparison, walmart, kroger, whole foods, shopping list, budget, food, nutrition, weekly planner, smart shopping, ai

### App Store Screenshots Requirements

- iPhone: 6.7", 6.5", 5.5" displays required
- iPad: 12.9", 11" displays required
- Showcase key features: meal planning, price comparison, grocery lists

## Privacy Policy

The app collects minimal user data:
- Zipcode for regional pricing (not stored)
- Meal preferences (stored locally)
- Anonymous usage analytics

No personal information is shared with third parties.

## Support

For support and feature requests:
- Email: support@fitgenius.com
- GitHub Issues: https://github.com/fitgenius/grocery-app/issues

## License

© 2024 FitGenius. All rights reserved.

## Deployment Checklist

### Pre-Launch
- [ ] Test on iOS simulator
- [ ] Test on Android emulator  
- [ ] Test web version
- [ ] Verify price comparison functionality
- [ ] Test with different zipcodes
- [ ] Create app icons (1024x1024 for App Store)
- [ ] Create screenshots for all device sizes
- [ ] Write App Store description and metadata
- [ ] Set up Apple Developer account
- [ ] Configure EAS build credentials

### App Store Submission
- [ ] Configure iOS bundle identifier
- [ ] Set up provisioning profiles
- [ ] Build production iOS app
- [ ] Test iOS app on device
- [ ] Upload to App Store Connect
- [ ] Add app metadata and screenshots
- [ ] Submit for review
- [ ] Monitor review status

### Post-Launch
- [ ] Monitor crash reports
- [ ] Track user feedback
- [ ] Plan feature updates
- [ ] Marketing and user acquisition