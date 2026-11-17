# JoyNook: Complete Google Search Indexing & Mobile Store Publishing Guide

This guide walks you step-by-step through:
1. **Google Search Console Verification & Sitemap Indexing**
2. **Android App Bundle (.aab) Build & Google Play Publishing**
3. **iOS Xcode Archive & Apple App Store Publishing**

---

## 1. Google Search Console Verification & Indexing

The website is live and canonicalized at:
`https://joynook-gaming-website.vercel.app/`

### Step 1: Open Google Search Console
1. Navigate to: [https://search.google.com/search-console/](https://search.google.com/search-console/)
2. Sign in with your Google account.
3. Click **Add Property** in the top-left dropdown.

### Step 2: Choose Property Type
Select **URL prefix** and enter:
```
https://joynook-gaming-website.vercel.app/
```
Click **Continue**.

### Step 3: Verification Method (Two Options)

#### Option A: HTML Tag (Easiest & Instant)
1. In Search Console, select **HTML tag** under "Other verification methods".
2. Google will provide a meta tag like:
   ```html
   <meta name="google-site-verification" content="ABC123YourVerificationCodeHere" />
   ```
3. Copy only the code inside `content="..."`.
4. Go to your **Vercel Project Settings > Environment Variables**:
   - Key: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - Value: `ABC123YourVerificationCodeHere`
5. Redeploy in Vercel (or push a commit). The tag will automatically render in the `<head>` of your website.
6. Click **Verify** in Google Search Console.

#### Option B: Custom Domain DNS TXT Record (When using a custom domain)
1. Add a TXT record to your DNS provider (e.g., Namecheap, Cloudflare, GoDaddy):
   - Host / Name: `@`
   - Type: `TXT`
   - Value: `google-site-verification=...`
2. Click **Verify**.

### Step 4: Submit Your Dynamic Sitemap
1. In Search Console's left sidebar, click **Sitemaps**.
2. Under "Add a new sitemap", enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Search Console will parse all 18 game routes, all 8 category routes, and the homepage immediately.

### Step 5: Request Immediate URL Indexing
1. At the top of Search Console, paste:
   `https://joynook-gaming-website.vercel.app/`
2. Click **Test Live URL**.
3. Once verified, click **Request Indexing**.
4. Repeat for your top 3 games (e.g. `/games/bubble-pop`, `/games/2048`, `/games/color-sort`).

---

## 2. Android App (.aab) Build & Google Play Console Guide

The Android project is pre-configured in the repository at:
`android/` (Package ID: `com.joynook.games`, App: `JoyNook`).

### Prerequisites
- Install [Android Studio](https://developer.android.com/studio) (Giraffe or newer).
- Have a Google Play Developer Account ($25 one-time registration).

### Step 1: Open the Project in Android Studio
From your project root, run:
```powershell
npx cap open android
```
Or open Android Studio and choose **Open an Existing Project**, then select the `android` folder.

### Step 2: Test on an Emulator or Connected Device
1. Wait for Gradle sync to complete.
2. Select your connected Android device or create an Android Virtual Device (AVD).
3. Click the green **Run (Play)** button (`Shift + F10`).
4. Test full-screen gameplay, haptic feedback, and hardware back button.

### Step 3: Generate Signed Release Android App Bundle (.aab)
1. In Android Studio top menu, click **Build > Generate Signed Bundle / APK...**
2. Select **Android App Bundle** and click **Next**.
3. Under **Key store path**, click **Create new...**:
   - Keystore path: Choose a secure directory outside public git (e.g. `C:\Users\Owner\keystores\joynook-release.jks`).
   - Password: Choose a strong password.
   - Key Alias: `joynook`
   - Key Password: Choose a strong password.
   - Validity: `25` years.
   - Fill in your Certificate details (First and Last Name, Organization).
   - Click **OK**.
   > ⚠️ **CRITICAL**: Back up your `.jks` file and passwords securely. If lost, Google Play will not allow updates to your app.
4. Select **release** build variant and click **Finish**.
5. Android Studio will generate the signed `.aab` file at:
   `android/app/release/app-release.aab`

### Step 4: Upload to Google Play Console
1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**:
   - App name: `JoyNook: Calming Mini Games`
   - Default language: `English (United States)`
   - App or game: `Game`
   - Free or paid: `Free`
3. In **App content** / Dashboard:
   - **Privacy Policy**: Enter `https://joynook-gaming-website.vercel.app/privacy`
   - **App access**: All functionality is available without restrictions.
   - **Ads**: No, my app does not contain ads.
   - **Content rating**: Complete the questionnaire (Select "Game" -> Everyone 3+).
   - **Target audience**: 13 and up (or general audience).
   - **Data safety**: Follow the answers in `store-assets/STORE_LISTINGS.md` (Select "No data collected").
4. In **Store presence > Main store listing**:
   - Upload `public/store-assets/google-play-icon-512x512.png` as App Icon.
   - Upload `public/store-assets/google-play-feature-graphic-1024x500.png` as Feature Graphic.
   - Upload phone screenshots (at least 2, 1080x1920 or 1080x2400).
   - Copy short description and full description from `store-assets/STORE_LISTINGS.md`.
5. In **Production > Releases**:
   - Click **Create new release**.
   - Upload `app-release.aab`.
   - Enter Release Name: `1.0.0`.
   - Click **Next** and **Start rollout to Production**.

---

## 3. iOS App Build & Apple App Store Publishing Guide

The iOS project is pre-configured at:
`ios/App/` (Bundle ID: `com.joynook.games`, App: `JoyNook`).

### Prerequisites
- macOS computer with [Xcode](https://developer.apple.com/xcode/) 15 or newer.
- Apple Developer Program membership ($99/year).

### Step 1: Open the Project in Xcode
From your project root (on macOS or transferred repo), run:
```bash
npx cap open ios
```
Or open `ios/App/App.xcworkspace` in Xcode.

### Step 2: Configure Signing & Team
1. In the left project navigator, click the top `App` project.
2. Select the `App` target.
3. Click the **Signing & Capabilities** tab.
4. Check **Automatically manage signing**.
5. Select your **Team** (your Apple Developer account).
6. Verify Bundle Identifier is `com.joynook.games`.

### Step 3: App Icons & Safe Area
The icons are already configured in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.
Viewport in Next.js is configured with `viewportFit: "cover"` to respect iOS notch and home bar.

### Step 4: Archive and Upload to App Store Connect
1. In Xcode top bar, select destination: **Any iOS Device (arm64)**.
2. In the menu, click **Product > Archive**.
3. Once the Organizer window appears, select your build and click **Distribute App**.
4. Choose **App Store Connect** > **Upload** > Click **Next** through standard checks > Click **Upload**.

### Step 5: Prepare App Store Connect Listing
1. Log in to [App Store Connect](https://appstoreconnect.apple.com/).
2. Click **My Apps** > **+** > **New App**.
   - Platforms: `iOS`
   - Name: `JoyNook - Relaxing Games`
   - Primary Language: `English (U.S.)`
   - Bundle ID: `com.joynook.games`
   - SKU: `JOYNOOK-001`
3. Under **App Information**:
   - Privacy Policy URL: `https://joynook-gaming-website.vercel.app/privacy`
4. Under **App Privacy**:
   - Select **Data Not Collected**.
5. Under **Version 1.0.0**:
   - Paste description, keywords, and URLs from `store-assets/STORE_LISTINGS.md`.
   - Upload screenshots for 6.7" iPhone and 12.9" iPad.
   - Select your uploaded build from Xcode.
6. Click **Submit for Review**.
