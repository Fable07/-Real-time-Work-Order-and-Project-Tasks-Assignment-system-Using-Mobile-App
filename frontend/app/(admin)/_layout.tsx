// ─────────────────────────────────────────
// ADMIN GROUP LAYOUT
// Wraps all admin screens
// ─────────────────────────────────────────
import { Stack } from "expo-router";

export default function AdminLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
