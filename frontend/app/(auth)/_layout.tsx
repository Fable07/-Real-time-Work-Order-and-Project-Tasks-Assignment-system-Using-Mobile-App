// ─────────────────────────────────────────
// AUTH GROUP LAYOUT
// Wraps all authentication screens
// ─────────────────────────────────────────
import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
