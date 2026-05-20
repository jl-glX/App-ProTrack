# Budget Tracker - Multi-Platform Distribution Guide

This app is available on multiple platforms:

## Progressive Web App (PWA)

The app is automatically available as a PWA when you visit the website. Users can install it on:

- **Android**: Chrome menu > "Add to Home screen"
- **iOS/iPadOS**: Safari > Share > "Add to Home Screen"
- **Windows**: Edge/Chrome > Install icon in address bar
- **macOS**: Safari > File > "Add to Dock"
- **Linux**: Chrome/Firefox > Menu > "Install"

### PWA Features

- Offline support
- App-like experience
- Automatic updates
- Works on all modern browsers
- No app store required

## Desktop Applications

### Windows

1. **Portable Version (.exe)**: Download and run directly, no installation required
2. **Installer Version (.exe)**: Full Windows installer with automatic updates

### macOS

1. **DMG**: Drag and drop to Applications folder
2. **ZIP**: Extract and move to Applications

### Linux

1. **AppImage**: Universal Linux package, run anywhere
2. **DEB**: For Debian/Ubuntu-based systems
3. **RPM**: For Fedora/RHEL-based systems
4. **Snap**: Cross-distro package from Snap Store

## Mobile Applications

### Android

1. **Google Play Store**: Search for "Budget Tracker" (coming soon)
2. **APK Direct Download**: Available from the website
   - Enable "Unknown sources" in Android settings
   - Download and install APK
3. **F-Droid**: Open-source app store (coming soon)

### iOS/iPadOS

1. **App Store**: Search for "Budget Tracker" (coming soon)
2. **PWA**: Install via Safari as described above

## Building from Source

### Prerequisites

```bash
npm install
```

### Build PWA

```bash
npm run build
```

### Build Desktop Apps (Electron)

```bash
# Install Electron dependencies
npm install --save-dev electron electron-builder

# Build for all platforms
npm run build:electron

# Build for specific platform
npm run build:electron:win
npm run build:electron:mac
npm run build:electron:linux
```

### Build Mobile Apps (Capacitor)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Build web assets first
npm run build

# Sync with native projects
npx cap sync

# Android
npx cap open android
# Then build APK/AAB in Android Studio

# iOS
npx cap open ios
# Then build in Xcode
```

### APK Build Instructions

1. Install Android Studio
2. Open the android project: `npx cap open android`
3. Build > Generate Signed Bundle / APK
4. Select APK
5. Create or use existing keystore
6. Build release APK

### F-Droid Submission

To submit to F-Droid:

1. Ensure the app is fully open source
2. Remove any proprietary dependencies
3. Submit metadata to F-Droid repository
4. Follow F-Droid contribution guidelines

## Distribution Channels

### Official Website

- PWA installation
- Direct APK download
- Desktop app downloads
- Documentation and guides

### App Stores

- Google Play Store (Android)
- Apple App Store (iOS/iPadOS)
- Microsoft Store (Windows)
- Mac App Store (macOS)
- Snap Store (Linux)
- F-Droid (Android - open source)

### Direct Downloads

All releases are available at:

- GitHub Releases
- Official website download page

## Platform-Specific Features

### PWA

✅ Offline functionality
✅ Push notifications
✅ Background sync
✅ Install prompts
✅ App shortcuts

### Desktop (Electron)

✅ Native menus
✅ System tray integration
✅ Auto-update
✅ File system access
✅ Native notifications

### Mobile (Capacitor)

✅ Native UI components
✅ Camera access
✅ Biometric authentication
✅ Push notifications
✅ Deep linking

## Security & Privacy

- All data stored locally by default
- No tracking or analytics (optional)
- End-to-end encryption for cloud sync (optional)
- Open source codebase for transparency

## Support

- GitHub Issues: Bug reports and feature requests
- Documentation: Full user guide available
- Community Forums: User discussion and support

## License

MIT License - Free and open source
