import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
