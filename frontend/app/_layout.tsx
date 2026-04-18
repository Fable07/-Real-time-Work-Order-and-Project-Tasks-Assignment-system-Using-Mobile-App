// ─────────────────────────────────────────
// ROOT LAYOUT
// Entry point of the app
// Handles role-based navigation after login
// ─────────────────────────────────────────

import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";

// ─────────────────────────────────────────
// NAVIGATION GUARD
// Redirects user based on role after login
// Waits until layout is fully mounted
// ─────────────────────────────────────────
function RootLayoutNav() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Track if the layout has mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark layout as mounted on first render
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't navigate until layout is fully mounted
    if (!mounted) return;

    const inAuthGroup = segments[0] === "(auth)";

    // If not logged in, redirect to login
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user) {
      // Redirect to correct dashboard based on role
      switch (user.role) {
        case "admin":
          router.replace("/(admin)/dashboard");
          break;
        case "hrd":
          router.replace("/(hrd)/dashboard");
          break;
        case "manager":
          router.replace("/(manager)/dashboard");
          break;
        case "supervisor":
          router.replace("/(supervisor)/dashboard");
          break;
        case "worker":
          router.replace("/(worker)/dashboard");
          break;
        default:
          router.replace("/(auth)/login");
      }
    }
  }, [user, mounted]);

  // Slot renders the current active child route
  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}

// ─────────────────────────────────────────
// ROOT LAYOUT EXPORT
// Wraps everything with AuthProvider
// ─────────────────────────────────────────
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
