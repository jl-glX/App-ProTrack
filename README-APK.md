# Building APK for Budget Tracker

This guide explains how to build the Android APK for Budget Tracker.

## Prerequisites

1. **Node.js and npm** - Install from https://nodejs.org/
2. **Android Studio** - Install from https://developer.android.com/studio
3. **Java Development Kit (JDK) 17** - Required for Android builds
4. **Android SDK** - Installed via Android Studio

## Quick Build

Run the following command to build the APK:

```bash
npm run build:android
```

This will:

1. Build the web application
2. Sync with Capacitor
3. Build the Android APK
4. Copy the APK to `dist-electron/BudgetTracker.apk`

## Manual Build Steps

If you prefer to build manually:

### 1. Build the Web App

```bash
npm run build:pwa
```

### 2. Sync with Capacitor

```bash
npx cap sync android
```

### 3. Add Android Platform (first time only)

```bash
npx cap add android
```

### 4. Build the APK

```bash
cd android
./gradlew assembleRelease
cd ..
```

### 5. Find the APK

The APK will be located at:

```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## Creating a Signed APK

To distribute the APK, you should sign it:

### 1. Generate a Keystore (first time only)

```bash
keytool -genkey -v -keystore android/release.keystore -alias budget-tracker -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing

Create `android/keystore.properties`:

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=budget-tracker
storeFile=release.keystore
```

### 3. Update build.gradle

Add to `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../release.keystore')
            storePassword project.hasProperty('storePassword') ? storePassword : ''
            keyAlias project.hasProperty('keyAlias') ? keyAlias : ''
            keyPassword project.hasProperty('keyPassword') ? keyPassword : ''
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 4. Build Signed APK

```bash
cd android
./gradlew assembleRelease
```

## Installing the APK

### On Device

1. Transfer `BudgetTracker.apk` to your Android device
2. Open Settings > Security
3. Enable "Unknown Sources" or "Install unknown apps"
4. Open the APK file
5. Tap "Install"

### Via ADB

```bash
adb install dist-electron/BudgetTracker.apk
```

## Testing

To test the app in Android Studio:

```bash
npm run cap:android
```

This opens the Android project in Android Studio where you can run on emulators or connected devices.

## Downloading from the App

Users can download the APK directly from the Downloads page in the app:

1. Navigate to Downloads page
2. Click "Download APK" under Android section
3. The APK will be downloaded to their device
4. Follow installation instructions

## File Locations

- **Build script**: `scripts/build-apk.sh`
- **Android project**: `android/`
- **Output APK**: `dist-electron/BudgetTracker.apk`
- **Capacitor config**: `capacitor.config.json`

## Troubleshooting

### Gradle Build Fails

- Ensure JDK 17 is installed and JAVA_HOME is set
- Check Android SDK is properly installed
- Run `./gradlew clean` in the android directory

### APK Not Installing

- Enable "Unknown Sources" in device settings
- Check minimum Android version (API 22 / Android 5.1+)
- Ensure previous version is uninstalled

### App Crashes on Launch

- Check Android Studio Logcat for errors
- Verify all Capacitor plugins are synced
- Rebuild with `npm run build:android`

## Production Deployment

For production:

1. Always use signed APKs
2. Test on multiple Android versions
3. Consider publishing to Google Play Store
4. Keep keystore file secure (DO NOT commit to git)

## Support

For issues, check:

- Capacitor docs: https://capacitorjs.com/
- Android developer guide: https://developer.android.com/
- Project issues: GitHub repository
