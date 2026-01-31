import { Stack } from "expo-router";

export default function RootLayout() {
  const isLogin = true;

  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen"
        options={{ title: "Acceuil", headerShown: true }}
      />

      <Stack.Screen
        name="connexion"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="historique"
        options={{ title: "historique", headerShown: false }}
      />

      <Stack.Screen
        name="+not-found"
        options={{ title: "404", headerShown: false }}
      />
    </Stack>
  );
}
