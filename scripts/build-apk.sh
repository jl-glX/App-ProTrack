#!/bin/bash

# Build APK for Budget Tracker
# This script builds the Android APK file

set -e

echo "🔨 Building Budget Tracker APK..."

# Step 1: Build the web app
echo "📦 Building web application..."
npm run build:pwa

# Step 2: Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

# Step 3: Check if Android project exists
if [ ! -d "android" ]; then
  echo "📱 Adding Android platform..."
  npx cap add android
fi

# Step 4: Build the APK
echo "🏗️  Building APK..."
cd android

# Make gradlew executable
chmod +x gradlew

# Build release APK
./gradlew assembleRelease

cd ..

# Step 5: Copy APK to downloads folder
echo "📋 Copying APK to downloads folder..."
mkdir -p dist-electron
cp android/app/build/outputs/apk/release/app-release-unsigned.apk dist-electron/app-release.apk

# Step 6: Create signed APK (if keystore exists)
if [ -f "android/release.keystore" ]; then
  echo "🔐 Signing APK..."
  ./gradlew assembleRelease
  cp android/app/build/outputs/apk/release/app-release.apk dist-electron/BudgetTracker.apk
else
  echo "⚠️  No keystore found. Using unsigned APK."
  cp android/app/build/outputs/apk/release/app-release-unsigned.apk dist-electron/BudgetTracker.apk
fi

echo "✅ APK build complete!"
echo "📍 APK location: dist-electron/BudgetTracker.apk"
echo ""
echo "To install on Android:"
echo "1. Transfer BudgetTracker.apk to your device"
echo "2. Enable 'Unknown Sources' in Settings"
echo "3. Open the APK file and tap Install"
