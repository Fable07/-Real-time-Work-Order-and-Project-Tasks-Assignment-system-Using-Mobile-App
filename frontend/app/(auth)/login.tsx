// ─────────────────────────────────────────
// LOGIN SCREEN
// All roles login using Employee Number
// and password. Redirects based on role.
// ─────────────────────────────────────────

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ENDPOINTS } from "../../constants/api";
import { styles } from "../../styles/auth/login.styles";

export default function LoginScreen() {
  const { login } = useAuth();

  // ── Local State ──────────────────────────
  const [employeeNo, setEmployeeNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Handle Login ─────────────────────────
  const handleLogin = async () => {
    if (!employeeNo || !password) {
      Alert.alert("Error", "Please enter your Employee Number and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeNo, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save user and token to auth context
      await login(data.user, data.token);
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* App Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoRing}>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.appName}>TaskFlow</Text>
          <Text style={styles.tagline}>Work Order Management System</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSub}>Sign in to your account</Text>

          {/* Employee Number Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Employee Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🪪</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Employee Number"
                placeholderTextColor="#94a3b8"
                value={employeeNo}
                onChangeText={setEmployeeNo}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              {/* Toggle password visibility */}
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.inputIcon}>
                  {showPassword ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            Contact your administrator if you don't have an account.
          </Text>
        </View>

        <Text style={styles.footer}>TaskFlow © 2025 • All rights reserved</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
