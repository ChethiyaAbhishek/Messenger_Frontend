# Messenger Frontend

## Overview

Messenger is a real-time cross-platform mobile chat application inspired by the UI of Meta's Messenger. This repository contains the frontend implementation built with React Native and Expo. It supports private and group chats with features like real-time messaging via WebSockets, biometric authentication for chat locks, user blocking, group management, and more. The app adapts to system themes (light/dark) and runs on both Android and iOS.

The frontend communicates with a separate backend (Java with Hibernate) via WebSockets for instant updates and REST APIs for data fetching. For full project details, including backend implementation and diagrams, refer to the [Project Documentation PDF](Messenger%20Project%20Documentation.pdf) included in this repository.

**Note:** Media sharing (images, videos, etc.) in chats and groups is not yet implemented. The biometric verification and status screens have UI developed but are not fully integrated. The calls screen is a placeholder TSX file without UI.

## Features

- **User Authentication**: Mobile number verification with country code selection, user setup with name, and optional profile image upload.
- **Real-Time Messaging**: Private chats and group chats with instant delivery using WebSockets. Message statuses: SENT (single gray check), DELIVERED (double gray checks), READ (double blue checks).
- **Chat List**: Displays recent conversations with profile images (visible only for saved contacts), names, last message, timestamp, and unread count.
- **Online/Offline Status**: Green circle for online, gray for offline.
- **Chat Locks**: Biometric verification (fingerprint) to lock/unlock private and group chats.
- **Contact Management**: Block/unblock users (blocked users can't message), save/unsave contacts (profile images shown only for saved contacts).
- **Group Management**: Create groups with name and optional profile image. Admins can add/remove members; members can leave. If admin leaves, the first added member becomes admin. Delete groups as admin.
- **Search Functionality**: Search for existing chats, contacts, or users to start new chats.
- **Profile Management**: Update user name and profile image.
- **UI Themes**: Automatically adapts to system light/dark mode.
- **Animations and Alerts**: Smooth transitions and notifications for user actions.
- **Role Management**: In groups, roles include admin (full control) and member.

## Screens

The app includes the following screens:

- **Splash Screen**: App logo on startup.
- **Mobile Verification Screen**: Enter country code and mobile number, validated against the backend.
- **Setup Screen**: Add first and last name for new users, with field validations.
- **Profile Image Screen**: Upload or skip profile image using Expo Image Picker.
- **Home Screen**: Searchable chat list, online contacts in a horizontal list, top modal for logout/profile, bottom navigation for home/groups/profile.
- **Individual Chat Screen**: Conversation history, contact details, message status, typing area, and send button.
- **Contact Profile Screen**: View details, options to save/block/set chat lock.
- **Search New Chat Screen**: List all registered users with search to start new chats.
- **Groups Screen**: List joined groups with search, unread badges, and button to create new groups.
- **New Group Screen**: Create group with name and optional image.
- **Group Member Adding Screen**: Admins add members with search.
- **Group Chat Screen**: Group messages, member details, and message status.
- **Group Profile Screen**: Group details, member list, admin controls (add/remove members).
- **User Profile Screen**: Update name and profile image.
- **Biometric Verification Screen**: UI developed for fingerprint auth (used for chat locks).
- **Status Screen**: UI developed but not integrated.
- **Calls Screen**: Placeholder TSX file (no UI built).

For screenshots of these screens, see the [Project Documentation PDF](Messenger%20Project%20Documentation.pdf) (pages 8-14).

## Technology Stack

- **React Native**: Core framework for building the mobile app.
- **Expo**: For development, deployment, and modules like image picker and local authentication.
- **NativeWind & Tailwind CSS**: For styling and responsive UI.
- **WebSockets**: For real-time messaging (sockets located in `src/socket`).
- **React Navigation**: Bottom tabs and stack navigation.
- **Other Libraries**: See `package.json` for full list, including Expo modules for camera, image picker, secure store, and more.

## Installation

1. **Prerequisites**:
   - Node.js (v18 or higher)
   - Expo CLI: Install globally with `npm install -g expo-cli`
   - Android Studio or Xcode for emulators (optional for physical devices)

2. **Clone the Repository**:
   ```
   git clone https://github.com/ChethiyaAbhishek/Messenger_Frontend.git
   cd messenger-frontend
   ```

3. **Install Dependencies**:
   ```
   npm install
   ```
   Or if using Yarn:
   ```
   yarn install
   ```

4. **Configure Validations**:
   - Mobile number validations (based on country) are in `src/util/Validation.ts`. Edit regex patterns here for custom rules.

5. **Backend Setup**:
   - This frontend requires a compatible backend. Set the backend URL in your environment (e.g., in a config file or env variables). Refer to the project documentation for backend details.

## Usage

1. **Start the Development Server**:
   ```
   npm start
   ```
   Or with Expo:
   ```
   expo start
   ```

2. **Run on Android/iOS**:
   - Android: `npm run android` (or scan QR code in Expo Go app)
   - iOS: `npm run ios` (requires macOS and Xcode)

3. **Build for Production**:
   - Use Expo EAS for building APK/IPA: `eas build --platform android` or `eas build --platform ios`.
   - For more details, see Expo documentation.

## Directory Structure

- `src/`: Main source code.
  - `screens/`: All screen components (e.g., HomeScreen.tsx, ChatScreen.tsx).
  - `socket/`: WebSocket handlers for real-time features (e.g., sendChat, groupMsgs).
  - `util/`: Utilities like Validation.ts for mobile number checks.
  - `components/`: Contexts like AuthProvider and WebSocketProvider.
  - `api/`: User Services.
- `assets/`: Images, icons, etc.
- `package.json`: Dependencies and scripts.

## Customization

- **Mobile Validations**: Edit `src/util/Validation.ts` to adjust country-specific phone number regex.
- **WebSockets**: All socket logic is in `src/socket/`. Extend for new real-time features.
- **Themes**: The app uses system themes via NativeWind. Customize colors in Tailwind config.

## Future Enhancements

- Integrate media sharing in chats/groups.
- Add push notifications for new messages.
- Implement voice/video calling.
- Add status/stories feature.
- Enable cloud backup and sync.
- Full end-to-end encryption.

For more ideas, see the project documentation (page 68).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

This project was developed as part of the Handheld Device Programming I (React Native) course at Java Institute for Advanced Technology. Special thanks to faculty and peers for guidance.
