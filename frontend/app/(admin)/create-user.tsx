// ─────────────────────────────────────────
// CREATE USER SCREEN (Admin only)
// Admin creates fully verified employee
// accounts with complete information
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
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ENDPOINTS } from "../../constants/api";
import { styles } from "../../styles/admin/create-user.styles";

// Available roles admin can assign
const ROLES = ["manager", "supervisor", "worker"];

export default function CreateUser() {
  const { user, token } = useAuth();
  const router = useRouter();

  // ── Local State ──────────────────────────
  const [employeeNo, setEmployeeNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Handle Create ────────────────────────
  const handleCreate = async () => {
    // Validate all required fields
    if (
      !employeeNo ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !birthdate ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // Validate birthdate format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthdate)) {
      Alert.alert("Error", "Birthdate format must be YYYY-MM-DD.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.createUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeNo,
          firstName,
          lastName,
          phoneNumber,
          email,
          birthdate,
          password,
          role,
          createdBy: user?.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Show success with employee number
      Alert.alert(
        "✅ Account Created!",
        `Name: ${firstName} ${lastName}\nRole: ${role.toUpperCase()}\nEmployee No: ${employeeNo}\n\nShare the Employee Number and password with the employee for login.`,
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (err: any) {
      Alert.alert("Error", err.message);
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
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Create Account</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <Text style={styles.subtitle}>
          Fill in all employee details to create a verified account.
        </Text>

        <View style={styles.card}>
          {/* Section: Account Info */}
          <Text style={styles.sectionLabel}>Account Information</Text>

          {/* Employee Number */}
          <View style={styles.field}>
            <Text style={styles.label}>Employee Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>🪪</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. EMP-001"
                placeholderTextColor="#475569"
                value={employeeNo}
                onChangeText={setEmployeeNo}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Role Selector */}
          <View style={styles.field}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                  onPress={() => setRole(r)}
                >
                  <Text
                    style={[
                      styles.roleBtnText,
                      role === r && styles.roleBtnTextActive,
                    ]}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section: Personal Info */}
          <Text style={styles.sectionLabel}>Personal Information</Text>

          {/* First Name */}
          <View style={styles.field}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                placeholderTextColor="#475569"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          {/* Last Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                placeholderTextColor="#475569"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Birthdate */}
          <View style={styles.field}>
            <Text style={styles.label}>Birthdate</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>🎂</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#475569"
                value={birthdate}
                onChangeText={setBirthdate}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Section: Contact Info */}
          <Text style={styles.sectionLabel}>Contact Information</Text>

          {/* Phone Number */}
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#475569"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Section: Security */}
          <Text style={styles.sectionLabel}>Security</Text>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Set a password"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.icon}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor="#475569"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.icon}>
                  {showConfirmPassword ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
