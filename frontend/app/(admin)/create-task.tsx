// ─────────────────────────────────────────
// CREATE TASK SCREEN (Admin only)
// Admin creates a task and assigns it
// directly to a Manager
// ─────────────────────────────────────────

import React, { useState, useEffect } from "react";
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
import { styles } from "../../styles/admin/create-task.styles";

export default function CreateTask() {
  const { user, token } = useAuth();
  const router = useRouter();

  // ── Local State ──────────────────────────
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [managers, setManagers] = useState<any[]>([]);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ── Fetch Managers ───────────────────────
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch(ENDPOINTS.allUsers, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Filter only managers from all users
        setManagers(data.filter((u: any) => u.role === "manager"));
      } catch {
        Alert.alert("Error", "Failed to load managers");
      } finally {
        setFetching(false);
      }
    };
    fetchManagers();
  }, []);

  // ── Handle Create Task ───────────────────
  const handleCreate = async () => {
    if (!taskName || !selectedManager) {
      Alert.alert("Error", "Please fill in task name and select a manager.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.createTask, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskName,
          description,
          assignedTo: selectedManager._id,
          assignedByName: user?.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Alert.alert(
        "✅ Task Created!",
        `Task assigned to ${selectedManager.firstName} ${selectedManager.lastName}`,
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
          <Text style={styles.pageTitle}>Create Task</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.card}>
          {/* Task Name Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Task Name</Text>
            <View style={styles.inputRow}>
              <Text style={styles.icon}>📋</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task name"
                placeholderTextColor="#475569"
                value={taskName}
                onChangeText={setTaskName}
              />
            </View>
          </View>

          {/* Description Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the task..."
              placeholderTextColor="#475569"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Manager Selection */}
          <View style={styles.field}>
            <Text style={styles.label}>Assign to Manager</Text>
            {fetching ? (
              <ActivityIndicator color="#3b82f6" />
            ) : managers.length === 0 ? (
              <Text style={styles.empty}>
                No managers found. Create a manager account first.
              </Text>
            ) : (
              managers.map((m) => (
                <TouchableOpacity
                  key={m._id}
                  style={[
                    styles.managerCard,
                    selectedManager?._id === m._id && styles.managerCardActive,
                  ]}
                  onPress={() => setSelectedManager(m)}
                >
                  {/* Avatar */}
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {m.firstName.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.managerInfo}>
                    <Text style={styles.managerName}>
                      {m.firstName} {m.lastName}
                    </Text>
                    <Text style={styles.managerRole}>
                      Manager • No: {m.employeeNo}
                    </Text>
                  </View>
                  {/* Selected checkmark */}
                  {selectedManager?._id === m._id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.btn,
              (loading || !selectedManager) && styles.btnDisabled,
            ]}
            onPress={handleCreate}
            disabled={loading || !selectedManager}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Assign Task</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
