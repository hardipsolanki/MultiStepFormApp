---
name: react-native
description: Use this skill for building, debugging, and improving React Native apps in VS Code using Blackbox AI.
---

# React Native

## Instructions

Follow these steps when working on React Native projects:

### 1. Project Setup

- Create a project using:
  - Expo:
    ```bash
    npx create-expo-app myApp
    cd myApp
    npm start
    ```
  - React Native CLI:
    ```bash
    npx react-native init MyApp
    cd MyApp
    npx react-native run-android
    ```

### 2. File Structure Guidelines

- Keep code modular:
  - `/components` → reusable UI
  - `/app` → pages
  - `/store` → redux store
  - `/feature` → redux slices
  - `/types` → typescript types
  - `/utils` → helpers

### 3. Coding Rules

- Use functional components + hooks
- Prefer TypeScript if possible
- Keep styles in `StyleSheet.create`
- Avoid inline styles for large components
- creat separate files for plain text, colors.

### 4. Common Tasks

#### UI Development

- Use `View`, `Text`, `Image`, `FlatList`
- Use `SafeAreaView` for layout safety
- Use `ScrollView` only when needed (avoid for large lists)
