// ─────────────────────────────────────────
// HRD GROUP LAYOUT
// Wraps all HRD screens
// ─────────────────────────────────────────
import { Stack } from "expo-router";

export default function HRDLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
